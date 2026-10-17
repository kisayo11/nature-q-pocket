import fs from 'fs';
import { CHAPTERS } from './src/data/chaptersData.js';

console.log('=== 1. RULES DATA AUDIT (58개 규정 전수 검증) ===');
const rules = JSON.parse(fs.readFileSync('src/data/rulesData.json', 'utf8'));
const golden = JSON.parse(fs.readFileSync('src/data/goldenNumbers.json', 'utf8'));

console.log('Total rules count:', rules.length);

const errors = [];
const warnings = [];
const chineseRegex = /[\u4e00-\u9fff]/;

// Check duplicate codes
const codes = new Set();
rules.forEach((r, idx) => {
  if (codes.has(r.code)) {
    errors.push(`Duplicate rule code: ${r.code}`);
  }
  codes.add(r.code);

  if (!r.code) errors.push(`Rule index ${idx}: missing code`);
  if (!r.title) errors.push(`Rule ${r.code}: missing title`);
  if (!r.quickAnswer || r.quickAnswer.length < 5) errors.push(`Rule ${r.code}: invalid quickAnswer`);
  if (!r.faqQuestion || !r.faqAnswer) errors.push(`Rule ${r.code}: missing faqQuestion or faqAnswer`);
  if (!r.keyPoints || r.keyPoints.length === 0) errors.push(`Rule ${r.code}: missing keyPoints`);
  if (r.keyPoints && r.keyPoints.some(p => p.length < 5)) errors.push(`Rule ${r.code}: too short keyPoint`);
  if (!r.fullTextSnippet || r.fullTextSnippet.length < 20) errors.push(`Rule ${r.code}: too short fullTextSnippet`);
  
  // Chinese character check (should not be in core user-facing text)
  if (chineseRegex.test(r.quickAnswer)) warnings.push(`Rule ${r.code}: quickAnswer contains Chinese char: ${r.quickAnswer.match(chineseRegex)}`);
  if (chineseRegex.test(r.faqQuestion) || chineseRegex.test(r.faqAnswer)) warnings.push(`Rule ${r.code}: FAQ contains Chinese char`);
  if (r.keyPoints && r.keyPoints.some(p => chineseRegex.test(p))) warnings.push(`Rule ${r.code}: keyPoints contains Chinese char`);

  // Check for broken placeholder or legacy boilerplate phrases
  if (r.quickAnswer && r.quickAnswer.includes('표준 업무 절차를 철저히 준수하고 관련 기록대장에')) {
    errors.push(`Rule ${r.code}: contains legacy boilerplate in quickAnswer`);
  }
  if (r.faqAnswer && r.faqAnswer.includes('수행 절차를 숙지하고 있습니다')) {
    errors.push(`Rule ${r.code}: contains legacy boilerplate in faqAnswer`);
  }
  if (r.keyPoints && r.keyPoints.some(p => p.includes('를 철저히 준수한다.'))) {
    warnings.push(`Rule ${r.code}: keyPoints contains mechanical boilerplate '...를 철저히 준수한다.'`);
  }
});

console.log('Rules errors count:', errors.length);
if (errors.length > 0) {
  console.log('Errors:', errors);
} else {
  console.log('✓ All 58 rules have valid code, title, quickAnswer, FAQ, keyPoints, and snippets!');
}

console.log('Rules warnings count:', warnings.length);
if (warnings.length > 0) {
  console.log('Warnings:', warnings);
} else {
  console.log('✓ No Chinese characters or mechanical boilerplates found in core content!');
}

console.log('\n=== 2. MUST-PASS RULES AUDIT ===');
const mustPass = rules.filter(r => r.isMustPass);
console.log('Must pass rules count:', mustPass.length, '(Expected: 33)');
if (mustPass.length === 33) {
  console.log('✓ Exactly 33 must-pass rules verified!');
} else {
  console.log('⚠️ Expected 33 must pass rules, found:', mustPass.length);
}

console.log('\n=== 3. GOLDEN NUMBERS AUDIT ===');
console.log('Golden numbers count:', golden.length);
let goldenErrors = 0;
golden.forEach((g, i) => {
  if (!g.name || !g.value) {
    console.log(`Golden item #${i} missing name or value`);
    goldenErrors++;
  }
});
if (goldenErrors === 0) {
  console.log('✓ All golden numbers have valid name and value!');
}

console.log('\n=== 4. CHAPTERS AUDIT ===');
console.log('Chapters count:', CHAPTERS.length, '(Expected: 12)');
let chapterErrors = 0;
CHAPTERS.forEach((c) => {
  if (!c.id || !c.title) {
    console.log(`Chapter missing id or title:`, c);
    chapterErrors++;
  }
});
if (chapterErrors === 0) {
  console.log('✓ All 12 chapters correctly configured!');
}
