import fs from 'fs';
import path from 'path';

const rawExtracted = JSON.parse(fs.readFileSync('src/data/hwp_extracted.json', 'utf8'));
const oldRules = JSON.parse(fs.readFileSync('src/data/rulesData.json', 'utf8'));

// Must-Pass 33개 조사항목이 속한 8대 기준
const MUST_PASS_CODES = new Set(['1.1', '1.2', '1.3', '5.2', '5.6', '9.3', '9.4', '10.6']);

// Clean Chinese binary noise from HWP
function sanitizeHWPText(text) {
  if (!text) return '';
  return text
    // Remove typical HWP binary character artifacts
    .replace(/[捤獥汤氠瑢漠杳潴景湯慴]+/g, '')
    .replace(/[-–—]\s*[-–—]/g, '')
    // Keep Korean, English, numbers, basic punctuations, newlines
    .split('\n')
    .map(line => {
      // Remove leading non-standard symbols
      let clean = line
        .replace(/[^\s\wㄱ-ㅎㅏ-ㅣ가-힣0-9.,·:;!?()\[\]{}<>'\"\/|%+\-*=~#@$^]/g, '')
        .trim();
      return clean;
    })
    .filter(line => {
      if (!line) return false;
      // Skip meaningless table headers
      if (/^(규\s*정\s*번\s*호|제\s*정\s*일|최근\s*개정일|담\s*당\s*부\s*서|시\s*행\s*일|검\s*토\s*책\s*임\s*자|검\s*토\s*주\s*기|승\s*인\s*책\s*임\s*자|검토\s*예정일|관\s*련\s*근\s*거)/.test(line)) {
        return false;
      }
      return true;
    })
    .join('\n');
}

// Extract well-structured sections from sanitized text
function parseStructuredSections(sanitized) {
  const lines = sanitized.split('\n');

  let purpose = '';
  let definitions = [];
  let policies = [];
  let processes = [];

  let currentSection = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/목적\s*\(Purpose\)/i.test(line)) {
      currentSection = 'purpose';
      continue;
    } else if (/용어\s*(의)?\s*정의\s*\(Definition\)/i.test(line)) {
      currentSection = 'definition';
      continue;
    } else if (/정책\s*\(Policy\)/i.test(line)) {
      currentSection = 'policy';
      continue;
    } else if (/지침\s*(및)?\s*절차\s*\(Guidelines\s*(&|and)?\s*Process\)/i.test(line)) {
      currentSection = 'process';
      continue;
    } else if (/부록\s*\(Appendix\)/i.test(line) || /관련\s*서식/i.test(line)) {
      currentSection = 'appendix';
      continue;
    }

    if (currentSection === 'purpose' && !purpose) {
      if (line.length > 5 && !line.includes('목적')) {
        purpose = line;
      }
    } else if (currentSection === 'definition') {
      if (line.length > 5) definitions.push(line);
    } else if (currentSection === 'policy') {
      if (line.length > 5) policies.push(line);
    } else if (currentSection === 'process') {
      if (line.length > 10) processes.push(line);
    }
  }

  return {
    purpose,
    definitions: definitions.slice(0, 8),
    policies: policies.slice(0, 10),
    processes: processes.slice(0, 15)
  };
}

// Clean and merge split sentences into complete actionable guidelines
function buildCompleteGuidelines(processes, policies) {
  const result = [];
  const pool = [...processes, ...policies];

  for (let i = 0; i < pool.length; i++) {
    let item = pool[i].trim();

    // Skip too short or header lines
    if (item.length < 15) continue;
    if (/^[0-9]\.\s*$/.test(item)) continue;
    if (item.endsWith(':') || item.endsWith('：')) continue;

    // Remove item bullets like "1)", "가.", "•"
    item = item.replace(/^[0-9가-힣a-zA-Z\•\-\*\(\)]+\s*[\.\)]\s*/, '').trim();

    // Check if next line is a continuation (broken sentence)
    if (i + 1 < pool.length && !item.endsWith('.') && !item.endsWith('다') && !item.endsWith('함')) {
      const next = pool[i + 1].trim().replace(/^[0-9가-힣a-zA-Z\•\-\*\(\)]+\s*[\.\)]\s*/, '');
      if (next.length > 3 && next.length < 50 && (next.endsWith('.') || next.endsWith('다') || next.endsWith('함'))) {
        item += ' ' + next;
        i++; // skip next
      }
    }

    // Ensure ending
    if (!item.endsWith('.') && !item.endsWith('다') && !item.endsWith('함')) {
      item += '를 철저히 준수한다.';
    }

    if (item.length >= 18 && !result.includes(item)) {
      result.push(item);
    }

    if (result.length >= 6) break;
  }

  return result;
}

const cleanedRules = oldRules.map(old => {
  const code = old.code;
  const hwpData = rawExtracted[code];
  const rawHWP = hwpData ? hwpData.text : (old.fullTextSnippet || '');

  // 1. Sanitize HWP text
  const sanitized = sanitizeHWPText(rawHWP);

  // 2. Parse structured sections
  const structured = parseStructuredSections(sanitized);

  // 3. Build complete guidelines (실천 지침)
  let cleanActionPoints = buildCompleteGuidelines(structured.processes, structured.policies);
  if (cleanActionPoints.length < 3) {
    cleanActionPoints = (old.keyPoints || []).map(p => {
      let t = p.replace(/\s+/g, ' ').trim();
      if (!t.endsWith('.') && !t.endsWith('다') && !t.endsWith('함')) t += '를 철저히 준수한다.';
      return t;
    });
  }

  // 4. Clean Full Text formatted for reading
  let cleanFullText = '';
  if (structured.purpose) {
    cleanFullText += `[목적 (Purpose)]\n${structured.purpose}\n\n`;
  }
  if (structured.definitions.length > 0) {
    cleanFullText += `[용어 정의 (Definition)]\n${structured.definitions.join('\n')}\n\n`;
  }
  if (structured.policies.length > 0) {
    cleanFullText += `[규정 정책 (Policy)]\n${structured.policies.join('\n')}\n\n`;
  }
  if (structured.processes.length > 0) {
    cleanFullText += `[실무 지침 및 절차 (Guidelines & Process)]\n${structured.processes.join('\n')}`;
  }
  if (!cleanFullText.trim()) {
    cleanFullText = sanitized;
  }

  return {
    code: old.code,
    title: old.title,
    filename: old.filename,
    isMustPass: MUST_PASS_CODES.has(old.code),
    department: old.department,
    purpose: old.purpose || structured.purpose,
    quickAnswer: old.quickAnswer,
    faq: old.faq,
    // 실천 지침 (온전하고 명확한 행동 수칙)
    keyPoints: cleanActionPoints.slice(0, 5),
    // 비치 서식은 사용자 피드백에 따라 과감히 삭제 (필요성 없음)
    forms: [], 
    // 깨끗하게 정제된 원문 전문
    fullTextSnippet: cleanFullText.trim(),
    choseong: old.choseong,
    searchKey: old.searchKey
  };
});

fs.writeFileSync('src/data/rulesData.json', JSON.stringify(cleanedRules, null, 2), 'utf8');
console.log(`Successfully cleaned and sanitized ${cleanedRules.length} rules!`);
