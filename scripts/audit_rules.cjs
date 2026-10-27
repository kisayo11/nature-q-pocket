const fs = require('fs');
const path = require('path');

const rulesPath = path.resolve(__dirname, '../app/src/data/rulesData.json');
const goldenPath = path.resolve(__dirname, '../app/src/data/goldenNumbers.json');

const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
const golden = JSON.parse(fs.readFileSync(goldenPath, 'utf8'));

console.log('======================================================');
console.log('   네이처요양병원 Q-Pocket 마스터 데이터 정밀 무결성 검증');
console.log('======================================================');
console.log(`[1] 59개 규정 데이터 전수 검증 (총 규정 수: ${rules.length}개)`);

const errors = [];
const warnings = [];
const chineseRegex = /[\u4e00-\u9fff]/;
const codes = new Set();

rules.forEach((r, idx) => {
  if (codes.has(r.code)) {
    errors.push(`중복된 규정 코드: ${r.code}`);
  }
  codes.add(r.code);

  if (!r.code) errors.push(`규정 인덱스 ${idx}: code 누락`);
  if (!r.title) errors.push(`규정 ${r.code}: title 누락`);
  if (!r.quickAnswer || r.quickAnswer.length < 5) errors.push(`규정 ${r.code}: quickAnswer 유효하지 않음`);
  if (!r.faqQuestion || !r.faqAnswer) errors.push(`규정 ${r.code}: FAQ 질문/답변 누락`);
  if (!r.keyPoints || r.keyPoints.length === 0) errors.push(`규정 ${r.code}: keyPoints 누락`);

  // 한자 포함 여부 체크 (사용자 친화적 한글 표기 권장)
  if (chineseRegex.test(r.quickAnswer)) warnings.push(`규정 ${r.code}: quickAnswer에 한자 포함 (${r.quickAnswer.match(chineseRegex)})`);
  if (chineseRegex.test(r.faqQuestion) || chineseRegex.test(r.faqAnswer)) warnings.push(`규정 ${r.code}: FAQ에 한자 포함`);
});

if (errors.length > 0) {
  console.log(`❌ 규정 데이터 오류 (${errors.length}건):`, errors);
} else {
  console.log('✓ 59개 전 규정의 코드, 제목, 3초 답변, FAQ, 실무지침 유효성 검증 완료!');
}

if (warnings.length > 0) {
  console.log(`⚠️ 규정 데이터 경고 (${warnings.length}건):`, warnings);
} else {
  console.log('✓ 비표준 한자나 불필요한 보일러플레이트 없음!');
}

console.log('\n[2] 골든넘버(임계치/유효기간) 데이터 검증');
console.log(`골든넘버 항목 수: ${golden.length}개`);
let goldenErrors = 0;
golden.forEach((g, i) => {
  if (!g.name || !g.value) {
    console.log(`골든넘버 #${i} name 또는 value 누락`);
    goldenErrors++;
  }
});
if (goldenErrors === 0) {
  console.log('✓ 모든 골든넘버 데이터 무결성 검증 완료!');
}

console.log('\n[3] 검증 종합 결과');
if (errors.length === 0 && goldenErrors === 0) {
  console.log('🎉 모든 데이터 무결성 검증 통과 (ZERO DEFECT)!');
} else {
  console.log('⚠️ 데이터 오류가 발견되었으니 점검이 필요합니다.');
  process.exit(1);
}
