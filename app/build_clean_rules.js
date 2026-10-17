import fs from 'fs';
import path from 'path';

const rawExtracted = JSON.parse(fs.readFileSync('src/data/hwp_extracted.json', 'utf8'));
const oldRules = JSON.parse(fs.readFileSync('src/data/rulesData.json', 'utf8'));

// Must-Pass 33개 조사항목이 속한 기준 번호 매핑 (4주기 요양병원 인증기준 공식)
// 1.1(환자확인 6개), 1.2(낙상 5개), 1.3(손위생 3개), 5.2(취약환자 3개), 5.6(안전시설 1개), 9.3(인력기준 1개), 9.4(직원안전 6개), 10.6(화재안전 8개)
const MUST_PASS_CODES = new Set(['1.1', '1.2', '1.3', '5.2', '5.6', '9.3', '9.4', '10.6']);

// Department Clean Up (간병사 제외 - 사용자 지시 14번)
function cleanDepartments(deptList) {
  if (!deptList) return ['전 부서'];
  const cleaned = deptList.filter(d => !d.includes('간병'));
  return cleaned.length > 0 ? cleaned : ['전 부서'];
}

// Choseong Search Helper
function getChoseong(str) {
  const CHOSUNG = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
  ];
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) - 44032;
    if (code >= 0 && code <= 11171) {
      result += CHOSUNG[Math.floor(code / 588)];
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}

// Parse structured policy, guidelines, forms from raw HWP text
function parseHWPContent(code, rawText) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  let purpose = '';
  let policyLines = [];
  let guidelines = [];
  let forms = [];

  let currentSection = '';

  for (const line of lines) {
    if (line.includes('목적') && line.includes('Purpose')) {
      currentSection = 'purpose';
      continue;
    } else if (line.includes('정책') && line.includes('Policy')) {
      currentSection = 'policy';
      continue;
    } else if (line.includes('지침 및 절차') || line.includes('Guidelines & Process')) {
      currentSection = 'guidelines';
      continue;
    } else if (line.includes('부록') || line.includes('Appendix') || line.includes('관련 서식')) {
      currentSection = 'forms';
      continue;
    }

    if (currentSection === 'purpose' && !purpose && line.length > 10) {
      purpose = line;
    } else if (currentSection === 'policy') {
      if (/^[0-9]+\./.test(line) || /^•/.test(line)) {
        policyLines.push(line);
      }
    } else if (currentSection === 'guidelines') {
      // Pick clean, meaningful actionable points
      if (line.length > 15 && (/^[0-9가-힣a-zA-Z\•\-\*\(]/.test(line))) {
        // filter out headers
        if (!line.startsWith('제') && !line.includes('규정번호') && !line.includes('개정일')) {
          guidelines.push(line);
        }
      }
    } else if (currentSection === 'forms') {
      if (line.includes('부록') || line.includes('서식') || line.includes('기록지') || line.includes('동의서') || line.includes('일지')) {
        forms.push(line.replace(/^[0-9\.\-\s]+/, ''));
      }
    }
  }

  return {
    purpose: purpose || '표준화된 원칙과 절차를 준수하여 안전하고 신뢰할 수 있는 의료서비스를 제공한다.',
    policyLines: policyLines.slice(0, 8),
    guidelines: guidelines.slice(0, 10),
    forms: [...new Set(forms)].slice(0, 6)
  };
}

const cleanedRules = oldRules.map(old => {
  const code = old.code;
  const hwpData = rawExtracted[code];
  const rawText = hwpData ? hwpData.text : (old.fullTextSnippet || '');

  const parsed = parseHWPContent(code, rawText);

  // Rebuild key points to be 100% complete and clean (NO truncated sentences!)
  let cleanPoints = [];

  // Use well-formed lines from parsed guidelines and policy
  if (parsed.guidelines.length > 0) {
    cleanPoints = parsed.guidelines
      .filter(p => p.length >= 10 && !p.endsWith('등') && !p.endsWith('를') && !p.endsWith('의'))
      .map(p => {
        let text = p.replace(/\s+/g, ' ');
        if (!text.endsWith('.') && !text.endsWith('다') && !text.endsWith('음') && !text.endsWith('함')) {
          text += '.';
        }
        return text;
      });
  }

  // If clean points too few, use old points with completion
  if (cleanPoints.length < 3) {
    cleanPoints = (old.keyPoints || []).map(p => {
      let text = p.trim().replace(/\s+/g, ' ');
      if (text.length > 15 && !text.endsWith('.') && !text.endsWith('다') && !text.endsWith('음') && !text.endsWith('함')) {
        text += ' 절차를 준수하여 관리한다.';
      }
      return text;
    });
  }

  // Refine forms
  const finalForms = (parsed.forms.length > 0 ? parsed.forms : (old.forms || []))
    .filter(f => !f.includes('Appendix') && f.length > 2);

  // Department clean
  const depts = cleanDepartments(old.department);

  return {
    code: old.code,
    title: old.title,
    filename: old.filename ? old.filename.replace('.pdf', '.hwp') : `[NATURE]${old.code}.hwp`,
    isMustPass: MUST_PASS_CODES.has(old.code),
    department: depts,
    purpose: old.purpose || parsed.purpose,
    quickAnswer: old.quickAnswer,
    faq: old.faq,
    keyPoints: cleanPoints.slice(0, 6),
    forms: finalForms.slice(0, 5),
    policyHighlights: parsed.policyLines,
    fullTextSnippet: rawText.slice(0, 3000), // Rich 3000 chars snippet
    choseong: getChoseong(old.title),
    searchKey: `${old.code} ${old.title} ${getChoseong(old.title)} ${depts.join(' ')} ${MUST_PASS_CODES.has(old.code) ? '필수 mustpass' : ''}`
  };
});

fs.writeFileSync('src/data/rulesData.json', JSON.stringify(cleanedRules, null, 2), 'utf8');
console.log(`Successfully updated ${cleanedRules.length} rules in src/data/rulesData.json`);
