/**
 * 네이처요양병원 4주기 인증 Q-Pocket 전체 데이터 통합 동기화 파이프라인
 * 
 * 실행 순서:
 * 1. build_authentic_master.cjs -> 59개 규정 원천 생성 + 구글 시트 02번 CSV 갱신
 * 2. merge_to_rules_data.cjs    -> 웹앱 rulesData.json 병합
 * 3. generate_tsv.cjs           -> 구글 시트 02번 TSV 갱신
 * 4. update_dept_utils.cjs      -> 11개 부서 매핑 유틸리티 갱신
 * 5. audit_rules.cjs            -> 전 규정 무결성 및 골든넘버 자동 검증
 */

const { execSync } = require('child_process');
const path = require('path');

const scripts = [
  { name: '1. 규정 원천 생성 및 구글시트 CSV 갱신', file: 'build_authentic_master.cjs' },
  { name: '2. 웹앱 rulesData.json 통합 병합', file: 'merge_to_rules_data.cjs' },
  { name: '3. 구글시트 TSV 마스터 파일 갱신', file: 'generate_tsv.cjs' },
  { name: '4. 부서별 매핑 유틸리티 최신화', file: 'update_dept_utils.cjs' },
  { name: '5. 데이터 무결성 정밀 감사 (Audit)', file: 'audit_rules.cjs' }
];

console.log('================================================================');
console.log('   🚀 네이처요양병원 Q-Pocket 마스터 데이터 원클릭 동기화 시작');
console.log('================================================================\n');

for (const step of scripts) {
  const filePath = path.resolve(__dirname, step.file);
  console.log(`▶ [진행] ${step.name} (${step.file})...`);
  try {
    const output = execSync(`node "${filePath}"`, { encoding: 'utf8' });
    console.log(output.trim());
    console.log(`✓ [완료] ${step.name}\n`);
  } catch (err) {
    console.error(`❌ [오류] ${step.name} 실행 중 문제 발생:`, err.message);
    process.exit(1);
  }
}

console.log('================================================================');
console.log('   🎉 전체 마스터 데이터 파이프라인 동기화 및 검증 성공 완료!');
console.log('================================================================');
