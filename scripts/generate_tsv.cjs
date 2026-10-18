const fs = require('fs');
const path = require('path');

const authenticData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../app/src/data/authenticRulesData.json'), 'utf8'));

const header = ['규정번호', '규정명', '담당부서', '필수여부', '3초핵심모범답변', '상세실무지침', '조사위원빈출질문_FAQ', '주요서식_점검대장'].join('\t');

const rows = authenticData.map(r => {
  const code = r.code;
  const title = r.title;
  const dept = r.department.join(', ');
  const mustPass = r.isMustPass ? '필수(Must-Pass)' : '정규';
  const quickAns = r.quickAnswer.replace(/[\r\n\t]/g, ' ').trim();
  const guidelines = r.keyPoints.join('; ').replace(/[\r\n\t]/g, ' ').trim();
  const faq = `${r.faqQuestion} ${r.faqAnswer}`.replace(/[\r\n\t]/g, ' ').trim();
  const forms = (r.forms || []).join('; ').replace(/[\r\n\t]/g, ' ').trim();

  return [code, title, dept, mustPass, quickAns, guidelines, faq, forms].join('\t');
});

const tsvContent = header + '\n' + rows.join('\n');
const tsvPath = path.resolve(__dirname, '../google_sheets/02_57개규정_마스터.tsv');
fs.writeFileSync(tsvPath, tsvContent, 'utf8');
console.log('Successfully written TSV. Total rows:', rows.length + 1);
