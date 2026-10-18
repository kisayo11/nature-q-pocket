// Medical Department Matching Utility (네이처 요양병원 10대 전문 부서 정합성 매핑)

export const DEPARTMENTS = [
  { id: '간호부', name: '간호부', icon: '🩺' },
  { id: '진료부', name: '진료부', icon: '👨‍⚕️' },
  { id: 'QPS실', name: 'QPS실', icon: '🎯' },
  { id: '감염관리실', name: '감염관리실', icon: '🛡️' },
  { id: '원무과', name: '원무과', icon: '📋' },
  { id: '재활치료실', name: '재활치료실', icon: '🏃' },
  { id: '방사선실', name: '방사선실', icon: '🩻' },
  { id: '약제과', name: '약제과', icon: '💊' },
  { id: '영양팀', name: '영양팀', icon: '🥗' },
  { id: '시설팀', name: '시설팀', icon: '🔧' },
];

// 부서별 실무 동의어 및 하위 조직 매핑
export const DEPT_SYNONYMS = {
  '간호부': ['간호부', '간호팀', '중앙공급실'],
  '진료부': ['진료부', '의사', '한의사'],
  'QPS실': ['QPS실', 'QPS', '질 향상', '환자안전', '지표관리'],
  '감염관리실': ['감염관리실', '감염관리', '감염관리위원회'],
  '원무과': ['원무과', '원무팀', '심사팀', '의무기록실', '전산실', '총무팀', '사회복지사', '병원운영위원회'],
  '재활치료실': ['재활치료실', '재활치료', '물리치료', '작업치료', '물리치료실'],
  '방사선실': ['방사선실', '방사선사', '영상검사', '영상', '의료기기', '의료장비'],
  '약제과': ['약제과', '약국', '약제팀', '약사'],
  '영양팀': ['영양팀', '영양과', '조리원', '급식'],
  '시설팀': ['시설팀', '시설관리', '자위소방대', '보안'],
};

// 재활치료실 전담 규정 코드 매핑 (차트/물리치료실 실사 핵심 규정)
const REHAB_SPECIFIC_CODES = ['1.1', '1.2', '1.3', '3.1.3', '7.2', '10.5', '10.6'];

// 방사선실(의료기기 관리 포함) 전담 규정 코드 매핑
const RAD_SPECIFIC_CODES = ['2.3.1', '2.3.2', '2.3.3', '10.5'];

// 특정 부서에 해당하는 규정인지 검사
export const isRuleMatchingDept = (rule, selectedDept) => {
  if (!selectedDept || selectedDept === '전체') return true;

  // 1. 공통 규정은 모든 부서에 매칭
  const ruleDepts = rule.department || [];
  if (ruleDepts.some((d) => d.includes('전 부서') || d.includes('전 직원'))) return true;

  // 2. 특수 진료지원 부서 코드 직접 매칭
  if (selectedDept === '재활치료실') {
    if (REHAB_SPECIFIC_CODES.includes(rule.code)) return true;
  }
  if (selectedDept === '방사선실') {
    if (RAD_SPECIFIC_CODES.includes(rule.code)) return true;
  }

  // 3. 부서명 및 동의어 일치 검사
  const synonyms = DEPT_SYNONYMS[selectedDept] || [selectedDept];
  return ruleDepts.some((d) => synonyms.some((syn) => d.includes(syn)));
};

// 특정 부서에 해당하는 규정 목록 필터링
export const getRulesByDept = (rules, selectedDept) => {
  if (!selectedDept || selectedDept === '전체') return rules;
  return rules.filter((rule) => isRuleMatchingDept(rule, selectedDept));
};

// 10대 부서별 현장 실사 3초 구두 모범 답변 데이터셋
export const DEPARTMENT_QUICK_ANSWERS = {
  '간호부': [
    { code: '1.1', title: '환자 확인', answer: '이름과 생년월일(2가지 지표)을 개방형 질문으로 확인합니다.', color: 'emerald' },
    { code: '1.2', title: '낙상 고위험', answer: 'Morse 51점 이상 환자는 침상과 전산에 빨간 스티커를 부착합니다.', color: 'amber' },
    { code: '2.3.1', title: '외부 위탁검사/CVR', answer: '원내 검사실이 없어 채혈 후 냉장보관·외부 위탁하며, CVR 발생 시 즉시 주치의 보고합니다.', color: 'teal' },
    { code: '10.5', title: '의료기기 고장 시', answer: '적색 "사용중지/고장" 라벨 부착 후 의료기기 총괄 관리자인 방사선사에게 수리 의뢰합니다.', color: 'indigo' },
    { code: '3.2.3', title: '신체보호대', answer: '의사 1일 1회 처방 후 2시간마다 관찰 기록, 10~30분 일시 해제합니다.', color: 'purple' },
    { code: '4.2', title: '약품 냉장보관', answer: '냉장고 2~8℃ 유지(1일 2회 점검), 인슐린 개봉 후 28일간 사용합니다.', color: 'blue' },
    { code: '10.6', title: '화재 비상통보', answer: '원무과(내선 900)에 즉시 통보하고 C급(독립) ➔ B급(부축) ➔ A급(침상) 대피합니다.', color: 'rose' },
    { code: '3.2.1', title: '심폐소생술(CPR)', answer: '내선 900번으로 "CPR + 발생장소" 순으로 2회 원내 방송을 요청합니다.', color: 'emerald' },
  ],
  '진료부': [
    { code: '2.2.2', title: '초기평가 기한', answer: '입원 후 24시간 이내 의사 초기평가 완료, 입원 중 주 1회 이상 재평가를 기록합니다.', color: 'blue' },
    { code: '2.3.1', title: '위탁검사 CVR 대응', answer: '수탁기관 위기검사치(CVR) 통보 접수 시 환자상태 즉시 재평가 및 응급처치를 처방합니다.', color: 'teal' },
    { code: '3.2.3', title: '신체보호대 처방', answer: '1일 1회 원칙으로 처방하며, 구체적인 임상 사유와 적용 부위를 명확히 기재합니다.', color: 'purple' },
    { code: '3.1.1', title: '치료계획 설명', answer: '입원 후 72시간 이내에 환자 및 보호자에게 종합 진료 및 치료계획을 설명합니다.', color: 'emerald' },
    { code: '4.3', title: '마약류 처방', answer: '원내 정식 처방전에 의해 발행하며, 잔여량 발생 시 약국 반납 및 입회 폐기합니다.', color: 'amber' },
    { code: '11.2', title: '의무기록 완결', answer: '퇴원환자 의무기록은 퇴원 후 24시간 이내 완결 작성을 원칙으로 관리합니다.', color: 'rose' },
  ],
  'QPS실': [
    { code: '6.2', title: '안전사건 보고체계', answer: '사건 발생 즉시 구두 보고 후, 24시간 이내에 전산 안전보고서를 작성하여 QPS실에 접수합니다.', color: 'emerald' },
    { code: '6.2', title: '사건 3단계 분류', answer: '환자 피해 없는 "근접오류", 일시 피해 "위해사건", 사망/영구손상 "적신호사건"으로 분류합니다.', color: 'rose' },
    { code: '6.3', title: '질 향상(QI) 활동', answer: 'PDCA(계획-실행-평가-개선) 사이클에 따라 매년 원내 QI 과제를 선정하고 전 부서가 수행합니다.', color: 'blue' },
    { code: '6.1', title: '환자안전위원회', answer: '분기별 1회 이상 개최하여 원내 안전사건 분석 및 시스템적 재발방지대책을 심의·의결합니다.', color: 'purple' },
    { code: '12.1', title: '임상 질 지표 관리', answer: '낙상발생률, 욕창발생률, 손위생 수행률 등 핵심 지표를 정기 수집하고 전 부서에 환류합니다.', color: 'amber' },
    { code: '9.2', title: '직원 안전 교육', answer: '신규 및 전 직원을 대상으로 환자안전 및 감염관리 교육을 연 1회 이상 필수로 이수합니다.', color: 'teal' },
  ],
  '감염관리실': [
    { code: '1.3', title: '손위생 모니터링', answer: 'WHO 5대 순간에 맞춰 손위생을 실시하며, 매월 부서별 수행률을 직접 관찰·피드백합니다.', color: 'teal' },
    { code: '7.7', title: 'CRE/VRE 접촉격리', answer: '격리실 배치, 접촉주의 표지판 부착, 전용 가운·장갑 착용, 전용 혈압계·체온계를 사용합니다.', color: 'rose' },
    { code: '9.4', title: '바늘 찔림 사고', answer: '흐르는 물과 비누로 세척 후 소독하고, 감염관리실(내선 902)로 즉시 유선 보고 및 혈액검사를 합니다.', color: 'purple' },
    { code: '7.2', title: '의료기구 소독기준', answer: '고위험기구(멸균), 준위험기구(고수준 소독), 비위험기구(환경소독제)로 분류하여 소독 관리합니다.', color: 'blue' },
    { code: '7.3', title: '격리 폐기물 관리', answer: '격리실 내 폐기물은 전용 적색 봉투에 담아 전용 용기에 밀폐 후 당일 외부 반출합니다.', color: 'amber' },
    { code: '7.1', title: '감염병 유행 대처', answer: '원내 감염 의심환자 2명 이상 집단 발생 시 즉시 감염관리실에 통보하고 역학조사를 시행합니다.', color: 'emerald' },
  ],
  '원무과': [
    { code: '5.1', title: '환자권리장전', answer: '환자의 권리와 의무를 접수창구 및 원내 주요 게시판에 항상 부착·게시합니다.', color: 'emerald' },
    { code: '5.3', title: '불만고충처리', answer: '고충 접수 후 7일 이내 조사 결과를 민원인에게 유선 또는 서면으로 통보합니다.', color: 'blue' },
    { code: '5.5', title: '동의서 대리인', answer: '환자 의식 저하 시 가족관계증명서, 신분증, 위임장을 철저히 대조 확인 후 서명받습니다.', color: 'purple' },
    { code: '11.3', title: '개인정보보호', answer: '전산 비밀번호는 3개월마다 변경하며, 이석 시 환자정보 화면을 반드시 잠금 조치합니다.', color: 'rose' },
    { code: '9.3', title: '법적인력기준', answer: '의사 및 간호등급 법정 인력 배치 기준을 매분기 심평원에 정기 신고·관리합니다.', color: 'amber' },
    { code: '2.1.2', title: '입원등록 절차', answer: '입원 시 신분증 본인확인과 병실 배정, 낙상·화재 주의사항을 1차 안내합니다.', color: 'teal' },
  ],
  '재활치료실': [
    { code: '1.1', title: '치료 전 환자확인', answer: '치료 시작 전 반드시 환자 인식밴드와 차트를 대조하여 이름과 생년월일을 개방형으로 확인합니다.', color: 'emerald' },
    { code: '1.2', title: '치료실 낙상 예방', answer: '휠체어 이동 시 발판을 올리고 브레이크를 고정하며, 보행훈련 시 안전벨트 착용 후 밀착 부축합니다.', color: 'amber' },
    { code: '7.2', title: '치료 매트 소독', answer: '환자 1인 치료 후 매트 및 기구 표면을 환경소독 티슈로 즉시 소독하고 건조합니다.', color: 'teal' },
    { code: '10.5', title: '온열치료 화상방지', answer: '핫팩 적용 시 타월 4~6겹 감싸고 20분 타이머 설정, 감각저하 환자는 5분마다 피부를 확인합니다.', color: 'rose' },
    { code: '3.1.3', title: '치료 중 통증평가', answer: '재활치료 전후 NRS 통증 점수를 사정하고, 극심한 통증 발생 시 즉시 중단 및 주치의 보고합니다.', color: 'purple' },
    { code: '10.6', title: '비상 대피 유도', answer: '치료실 비상벨 위치를 숙지하고 화재 시 거동 가능 환자부터 계단으로 우선 대피 유도합니다.', color: 'blue' },
  ],
  '방사선실': [
    { code: '2.3.1', title: '검사실 미운영(외부위탁)', answer: '본원은 원내 검사실 및 임상병리사가 없으며, 모든 검체검사는 병동 채혈 후 외부 수탁기관에 100% 위탁 의뢰합니다.', color: 'blue' },
    { code: '10.5', title: '의료기기 총괄관리', answer: '방사선사가 원내 전 부서 의료기기 고유번호 등록 관리, 일상점검 지도, 연 1회 검교정(Calibration)을 총괄 전담합니다.', color: 'teal' },
    { code: '10.5', title: '기기 고장·수리의뢰', answer: '각 부서 고장 접수 시 현장 확인 후 "사용중지" 표지 부착, 외주 전문업체 수리의뢰 및 병동 대체기기를 지원합니다.', color: 'rose' },
    { code: '2.3.2', title: '영상검사 및 판독', answer: '촬영 전 2가지 지표 환자확인과 임신여부를 확인하고, PACS 전송 후 영상의학과 전문의 판독소견서를 관리합니다.', color: 'emerald' },
    { code: '2.3.3', title: '방사선 피폭방호', answer: '환자 비조사 부위에 납치마(Apron)를 착용시키고, 방사선사는 차폐벽 뒤 조작실에서 안전하게 촬영합니다.', color: 'amber' },
    { code: '2.3.3', title: 'TLD 배지 선량관리', answer: '방사선 관계종사자는 가슴에 TLD 피폭선량계를 항시 착용하고 분기별(3개월) 1회 정기 판독 및 이력을 보관합니다.', color: 'purple' },
  ],
  '약제과': [
    { code: '4.2', title: '냉장약품 관리', answer: '의약품 냉장고 2~8℃ 유지(1일 2회 점검), 인슐린은 개봉 후 28일간 사용합니다.', color: 'blue' },
    { code: '4.2', title: '마약류 보관', answer: '이중잠금장치가 된 철제금고에 보관하며, 주 1회 이상 저장시설 점검부를 작성합니다.', color: 'rose' },
    { code: '4.2', title: '고위험약물 분리', answer: '고농도 전해질(KCL 등)은 일반약품과 완전 분리하고 적색 경고 라벨을 부착합니다.', color: 'amber' },
    { code: '4.1', title: '유효기간 선별', answer: '유효기간 3~6개월 미만 약품은 선별 분리하여 조기 사용 또는 제약사 반품 조치합니다.', color: 'purple' },
    { code: '4.3', title: '처방조제 검토', answer: '의사 처방전 용량·용법 적정성 검토 후 안전 조제 및 복약지도 라벨을 부착합니다.', color: 'emerald' },
    { code: '4.4', title: '투약오류 보고', answer: '투약오류 발생 시 즉시 처방의 보고 및 24시간 이내 환자안전 전산 보고를 시행합니다.', color: 'teal' },
  ],
  '영양팀': [
    { code: '7.6', title: '보존식 보관', answer: '매 식사마다 전용 냉동고(-18℃ 이하)에 144시간(6일) 동안 밀폐 보관합니다.', color: 'blue' },
    { code: '7.6', title: '배식 온도 원칙', answer: '온식은 60℃ 이상, 냉식은 5℃ 이하로 유지하여 보온보냉 배식카로 공급합니다.', color: 'rose' },
    { code: '3.1.4', title: '치료식 식단관리', answer: '당뇨식·저염식·연하곤란식 처방에 따라 영양상담 및 맞춤형 치료식을 제공합니다.', color: 'emerald' },
    { code: '7.6', title: '식기구 열탕소독', answer: '식판과 식기는 100℃ 열탕소독(5분 이상) 또는 유효염소 100ppm 이상 염소 소독합니다.', color: 'amber' },
    { code: '10.3', title: '조리장 위험물질', answer: '주방용 세척제 및 소독제는 경고표지를 부착하고 MSDS를 비치하여 밀폐 보관합니다.', color: 'purple' },
  ],
  '시설팀': [
    { code: '10.2', title: '비상발전기 기동', answer: '정전 발생 시 10초 이내 자동 기동되며, 주 1회 무부하 및 월 1회 부하시험을 실시합니다.', color: 'amber' },
    { code: '10.3', title: '의료가스 관리', answer: '산소 봄베 보관실 온도 40℃ 이하 유지, 전도방지 2중 체인 고정 및 화기엄금합니다.', color: 'blue' },
    { code: '10.6', title: '소화기 점검', answer: '소화기 압력 게이지 녹색(정상)을 확인하고, 매월 1회 외관 및 기능 점검표를 작성합니다.', color: 'rose' },
    { code: '10.3', title: 'MSDS 비치', answer: '원내 모든 화학물질 용기에 GHS 경고표지를 부착하고 16개 항목 MSDS를 비치합니다.', color: 'purple' },
    { code: '10.4', title: '보안 및 순찰', answer: '원내 취약지역 순찰일지를 기록하고, CCTV 영상은 30일 이상 보관·관리합니다.', color: 'emerald' },
    { code: '10.1', title: '방화구획 유지', answer: '방화셔터 및 방화문 하부에 물건 적재를 절대 금지하며 항시 폐쇄 상태를 유지합니다.', color: 'teal' },
  ],
};
