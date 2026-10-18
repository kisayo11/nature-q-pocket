// Google Sheets Auto-Sync Utility
import defaultQuizData from '../data/quizData.json';

const SPREADSHEET_ID = '1kHG6C2qzSdWtrJXv-yHrC5rSUyUq4199MS_KL0m4CGE';

async function fetchSheetGViz(tabName) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}`;
  const res = await fetch(url);
  const text = await res.text();
  const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
  return JSON.parse(jsonStr);
}

export async function autoSyncWithGoogleSheets(currentRules = [], currentGoldenNumbers = []) {
  const result = {
    syncedAt: new Date().toISOString(),
    success: false,
    updatedEmergency: null,
    updatedGoldenNumbers: null,
    error: null,
  };

  try {
    // 1. Fetch Emergency Contacts (01_비상연락망_기본정보)
    try {
      const emerData = await fetchSheetGViz('01_비상연락망_기본정보');
      if (emerData?.table?.rows?.length > 0) {
        const emerRows = emerData.table.rows.map((r) => {
          const c = r.c;
          return {
            category: c[0]?.v || '',
            title: c[1]?.v || '',
            dayExt: String(c[2]?.v || ''),
            nightPhone: String(c[3]?.v || ''),
            location: c[4]?.v || '',
            desc: c[5]?.v || '',
          };
        }).filter(x => x.title);
        result.updatedEmergency = emerRows;
      }
    } catch (e) {
      console.warn('Emergency sheet sync note:', e.message);
    }

    // 2. Fetch Golden Numbers (04_골든넘버_임계치)
    try {
      const gnData = await fetchSheetGViz('04_골든넘버_임계치');
      if (gnData?.table?.rows?.length > 0) {
        const gnRows = gnData.table.rows.map((r) => {
          const c = r.c;
          return {
            category: c[0]?.v || '기준',
            name: c[1]?.v || '',
            value: `${c[2]?.v || ''} ${c[3]?.v || ''}`.trim(),
            question: c[4]?.v || '',
            action: c[5]?.v || '',
          };
        }).filter(x => x.name);
        if (gnRows.length > 0) {
          result.updatedGoldenNumbers = gnRows;
        }
      }
    } catch (e) {
      console.warn('Golden numbers sheet sync note:', e.message);
    }

    // 2.5 Fetch Live Rules Master & PDF URLs (02_57개규정_마스터)
    try {
      const rulesSheet = await fetchSheetGViz('02_57개규정_마스터');
      if (rulesSheet?.table?.rows?.length > 0 && currentRules?.length > 0) {
        const rowMap = {};
        rulesSheet.table.rows.forEach((r) => {
          const c = r.c;
          const code = c[0]?.v !== undefined && c[0]?.v !== null ? String(c[0].v).trim() : '';
          if (!code) return;
          rowMap[code] = {
            title: c[1]?.v ? String(c[1].v).trim() : undefined,
            quickAnswer: c[4]?.v ? String(c[4].v).trim() : undefined,
            faq: c[6]?.v ? String(c[6].v).trim() : undefined,
            customPdfUrl: c[8]?.v ? String(c[8].v).trim() : undefined,
          };
        });

        const merged = currentRules.map((cr) => {
          const update = rowMap[cr.code];
          if (!update) return cr;
          const isBoilerplateQa = update.quickAnswer && (
            update.quickAnswer.includes('규정에 따라 정해진 절차를 준수') ||
            update.quickAnswer.length < 5
          );
          const isBoilerplateFaq = update.faq && (
            update.faq.includes('관련 업무 수행 기준과 서식 관리 방법') ||
            update.faq.length < 5
          );
          return {
            ...cr,
            title: update.title || cr.title,
            quickAnswer: (!isBoilerplateQa && update.quickAnswer) ? update.quickAnswer : cr.quickAnswer,
            faq: (!isBoilerplateFaq && update.faq) ? update.faq : cr.faq,
            pdfUrl: update.customPdfUrl || cr.pdfUrl || `/regulations/${cr.code}.pdf`,
          };
        });
        result.updatedRules = merged;
      }
    } catch (e) {
      console.warn('Rules master sheet sync note:', e.message);
    }

    // 3. Fetch Quiz Database (05_일일퀴즈_암기카드)
    try {
      const quizData = await fetchSheetGViz('05_일일퀴즈_암기카드');
      if (quizData?.table?.rows?.length > 0) {
        const quizRows = quizData.table.rows.map((r) => {
          const c = r.c;
          const id = c[0]?.v || '';
          const category = c[1]?.v || '인증공통';
          const difficulty = c[2]?.v || '초급';
          const type = c[3]?.v || 'choice';
          const question = c[4]?.v || '';
          if (!question) return null;

          // Options parsing
          const opt1 = c[5]?.v ? String(c[5].v).trim() : '';
          const opt2 = c[6]?.v ? String(c[6].v).trim() : '';
          const opt3 = c[7]?.v ? String(c[7].v).trim() : '';
          const opt4 = c[8]?.v ? String(c[8].v).trim() : '';

          let options = [];
          if (type.toUpperCase() === 'OX' || (opt1 === 'O' && opt2 === 'X')) {
            options = ['그렇다 (O)', '아니다 (X)'];
          } else {
            options = [opt1, opt2, opt3, opt4].filter((o) => o && o !== '-');
          }

          // Answer index resolver (1-based to 0-based, or O/X resolver)
          let answerIdx = 0;
          const rawAns = c[9]?.v !== undefined && c[9]?.v !== null ? String(c[9].v).trim() : '';
          if (rawAns === 'O' || rawAns === '1' || rawAns === 1) {
            answerIdx = (options.length === 2 && options[0].includes('O')) ? 0 : 0;
          } else if (rawAns === 'X' || rawAns === '2' || rawAns === 2) {
            answerIdx = (options.length === 2 && options[1].includes('X')) ? 1 : 1;
          } else if (rawAns === '3' || rawAns === 3) {
            answerIdx = 2;
          } else if (rawAns === '4' || rawAns === 4) {
            answerIdx = 3;
          } else if (!rawAns && type.toUpperCase() === 'OX') {
            // Default fallback for blank OX
            answerIdx = 1;
          }

          const explanation = c[10]?.v || '';
          const rule = c[11]?.v ? String(c[11].v).trim() : '1.1';

          return {
            id,
            category,
            difficulty,
            type,
            question,
            options,
            answer: answerIdx,
            explanation,
            rule,
          };
        }).filter(Boolean);

        if (quizRows.length > 0) {
          // Merge sheet quiz rows with master defaultQuizData (sheet rows take priority by ID)
          const sheetMap = new Map();
          quizRows.forEach((q) => {
            if (q.id) sheetMap.set(q.id, q);
          });
          const merged = defaultQuizData.map((item) => {
            return sheetMap.has(item.id) ? { ...item, ...sheetMap.get(item.id) } : item;
          });
          quizRows.forEach((q) => {
            if (q.id && !merged.some((m) => m.id === q.id)) {
              merged.push(q);
            }
          });
          result.updatedQuiz = merged;
        }
      }
    } catch (e) {
      console.warn('Quiz sheet sync note:', e.message);
    }

    result.success = true;
    return result;
  } catch (err) {
    result.error = err.message;
    return result;
  }
}
