# 네이처요양병원 4주기 의료기관 인증 스마트 규정집 (Nature Q-Pocket)
## 📘 통합 시스템 운영 및 유지보수 매뉴얼 (Maintenance & Operations Manual)

> **최종 갱신일:** 2026-10-27  
> **대상 시스템:** Nature Q-Pocket 모바일 웹앱 / 59개 인증 규정 마스터 DB / 구글 시트 연동 시스템 / 소책자 인쇄물 파이프라인  
> **수검 목표일:** 2026.11.25 ~ 27 (4주기 의료기관평가인증원 본수검)

---

## 📑 목차
1. [시스템 개요 및 아키텍처](#1-시스템-개요-및-아키텍처)
2. [핵심 데이터 구조 및 파이프라인](#2-핵심-데이터-구조-및-파이프라인)
3. [규정 갱신 및 데이터 동기화 표준 워크플로우](#3-규정-갱신-및-데이터-동기화-표준-워크플로우)
4. [Google Sheets 마스터 DB & 오류 피드백 운영](#4-google-sheets-마스터-db--오류-피드백-운영)
5. [핸드북 소책자 (HWPX / PDF) 유지보수](#5-핸드북-소책자-hwpx--pdf-유지보수)
6. [부서별 맞춤 뷰 및 필수 33개 항목 관리](#6-부서별-맞춤-뷰-및-필수-33개-항목-관리)
7. [웹앱 빌드 및 배포 (Vercel & PWA)](#7-웹앱-빌드-및-배포-vercel--pwa)
8. [긴급 대응 모달, 계산기, 퀴즈 데이터 갱신](#8-긴급-대응-모달-계산기-퀴즈-데이터-갱신)
9. [운영 트러블슈팅 및 장애 복구 가이드](#9-운영-트러블슈팅-및-장애-복구-가이드)

---

## 1. 시스템 개요 및 아키텍처

Nature Q-Pocket은 네이처요양병원(223병상) 전 직원이 인증평가 수검 시 현장에서 즉각적인 구두 답변과 규정 조회를 할 수 있도록 설계된 **하이브리드 모바일 스마트 핸드북 플랫폼**입니다.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        [ 데이터 원천 (Data Sources) ]                   │
│   • 병원 결재 59개 공식 규정집 (HWPX / PDF)                              │
│   • 4주기 요양병원인증 교육 핸드북 소책자 (Pretendard HWPX)              │
│   • Google Sheets (5대 마스터 시트 + 06_오류신고 피드백 시트)             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Python / Node.js 파이프라인
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      [ 빌드 & 정제 파이프라인 (Scripts) ]                │
│   • scripts/build_authentic_master.cjs  -> 59개 규정 원천 생성          │
│   • scripts/merge_to_rules_data.cjs     -> 웹앱 마스터 JSON 병합        │
│   • scripts/generate_tsv.cjs            -> 시트용 데이터 동기화         │
│   • scripts/patch_handbook_xml.py       -> 소책자 HWPX 정밀 패치        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   [ 클라이언트 애플리케이션 (React 19 + Vite) ]           │
│   • app/src/data/rulesData.json         (59개 규정 3초 모범답변/FAQ)     │
│   • app/src/data/allStaffChecklist.json (33개 필수 조사항목 100% 방어)  │
│   • app/src/data/fireBrigadeData.json   (주간/야간 자위소방대 편성)    │
│   • app/src/data/goldenNumbers.json     (임계치/주기/라벨링 골든넘버)   │
│   • PWA Service Worker (오프라인 캐싱 지원)                            │
│   • Vercel Edge Hosting (초고속 반응형 웹)                             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 핵심 데이터 구조 및 파이프라인

모든 규정 데이터는 무결성을 위해 **단일 원천(Single Source of Truth)** 체계로 관리됩니다.

### 2.1 주요 데이터 파일 위치

| 파일 경로 | 역할 및 내용 | 관리 주체 |
|---|---|---|
| `scripts/build_authentic_master.cjs` | 59개 규정의 핵심 구술답변, 빈출 FAQ, 실무지침, 서식 마스터 정의 | 개발자 / QPS팀 |
| `app/src/data/authenticRulesData.json` | 빌드 스크립트에서 자동 생성되는 정제된 중간 데이터 | 자동 생성 |
| `app/src/data/rulesData.json` | 웹앱 전체에서 사용하는 최종 마스터 JSON (전문 스니펫, 초성 포함) | 자동 생성 / 병합 |
| `google_sheets/02_57개규정_마스터.csv` | 구글 시트 마스터 DB 동기화용 UTF-8 BOM CSV | 자동 생성 |
| `app/src/data/allStaffChecklist.json` | 조사위원 기습 질문 대비 33개 필수 기준 전 직원 체크리스트 | QPS팀 / 간호부 |
| `app/src/data/goldenNumbers.json` | 필수 암기 임계치(Morse 51점, 소독액 5,000ppm 등) 모음 | 진료부 / 약제과 |
| `app/src/data/fireBrigadeData.json` | 본관/신관, 주간/야간 자위소방대 편성표 및 분대별 임무 | 시설팀 / 소방안전관리자 |

### 2.2 규정 객체(Rule Object) 필수 규격
`rulesData.json`의 각 규정 항목은 다음 필드를 반드시 포함해야 합니다:
```json
{
  "code": "1.1",
  "title": "정확한 환자 확인 및 의사소통",
  "isMustPass": true,
  "department": ["진료부", "간호부", "약제과"],
  "quickAnswer": "모든 투약·처치 전 \"성함이 어떻게 되십니까?\" 개방형 질문과...",
  "faqQuestion": "환자 확인을 반드시 시행해야 하는 4대 필수 시점은 언제입니까?",
  "faqAnswer": "① 의약품 투여 전, ② 혈액제제 투여 전, ③ 검사 시행 전, ④ 처치 시행 전입니다.",
  "keyPoints": ["유도 질문 금지", "등록번호 대조", "동명이인 관리"],
  "forms": ["구두/전화처방 기록지", "PRN 처방 목록"],
  "pdfUrl": "/regulations/1.1.pdf",
  "searchKey": "1.1 정확한 환자 확인 및 의사소통 ㅈㅎㅎ ㅎㅈ ㅎㅇ 진료부 간호부 약제과 필수"
}
```

---

## 3. 규정 갱신 및 데이터 동기화 표준 워크플로우

원내 규정이 개정되거나 부서별 실무 지침이 변경되었을 때의 표준 절차입니다.

### 3.1 규정 텍스트/답변 갱신 (예: 10.6 소방 규정 수칙 변경 시)

1. **마스터 정의 수정**:
   `scripts/build_authentic_master.cjs`에서 해당 규정 코드(예: `10.6`) 객체의 `quickAnswer`, `keyPoints`, `faqAnswer` 등을 최신 내용으로 수정합니다.
2. **원클릭 통합 동기화 실행 (⭐ 추천)**:
   ```bash
   cd app
   npm run sync:data
   ```
   *이 단 한 줄의 명령어로 아래 5단계가 순차적·자동으로 완료됩니다:*
   - ① `build_authentic_master.cjs` (규정 원천 생성 + 구글 시트 02번 CSV 갱신)
   - ② `merge_to_rules_data.cjs` (웹앱 `rulesData.json` 통합 병합)
   - ③ `generate_tsv.cjs` (구글 시트 TSV 갱신)
   - ④ `update_dept_utils.cjs` (11개 부서 매핑 유틸 갱신)
   - ⑤ `audit_rules.cjs` (전 규정 무결성 & 골든넘버 검증)
3. **웹앱 프로덕션 빌드 및 배포**:
   ```bash
   npm run build
   git commit -am "feat: update regulation 10.6"
   git push origin main
   ```

### 3.2 개별 규정 HWPX 수정 및 PDF 교체 (예: 4.1, 4.2 수정 시)

1. `hwp_source/[NATURE]4.1 의약품 선정 및 확보.hwpx` 파일을 한글(한컴오피스)에서 직접 편집 후 저장합니다.
2. 아래 원클릭 변환 스크립트를 실행하여 웹앱 및 원본 보관소에 동시 갱신합니다:
   ```bash
   python scripts/convert_single.py "hwp_source/[NATURE]4.1 의약품 선정 및 확보.hwpx" "app/public/regulations/4.1.pdf" "pdf_source/[NATURE]4.1 의약품 선정 및 확보.pdf"
   ```
   *(Rust 기반 rhwp 초고속 무인 렌더러를 탑재하여 한컴오피스 프로그램 팝업 없이 10초 만에 PDF를 생성·동기화합니다.)*
3. 웹앱에서 `[전문 보기]` 탭을 눌러 브라우저 내에서 PDF가 정상 렌더링되는지 확인합니다.

---

## 4. Google Sheets 마스터 DB & 오류 피드백 운영

### 4.1 마스터 DB 실시간 조회 (`googleSheetsSync.js`)
웹앱 구동 시 로컬스토리지 캐시를 먼저 보여준 후, 백그라운드에서 Google Sheets 마스터 DB를 조회하여 최신 데이터로 자동 교체합니다.

- **구글 시트 ID**: `1s-Jb-6u5u_gG-QeH0_xZ3_m...` (`app/src/utils/googleSheetsSync.js`에 설정)
- **수동 강제 새로고침**: 앱 내 [설정] 탭 ➔ **[구글 시트 즉시 동기화]** 버튼 클릭

### 4.2 현장 직원 오류 신고/수정 제보 피드백 시스템
현장 간호사 및 직원들이 모바일 화면에서 [오류 제보/수정 요청]을 누르면 Google Apps Script(GAS) 웹훅을 통해 `06_오류신고_피드백` 시트에 실시간 누적됩니다.

* **관련 파일**: `app/src/components/FeedbackModal.jsx`, `Code.js`, `GOOGLE_SHEETS_FEEDBACK_SETUP.md`
* **운영 팁**: 관리자는 주 1~2회 구글 시트의 [06_오류신고_피드백] 탭을 확인하고, 채택된 건을 `scripts/build_authentic_master.cjs`에 반영 후 빌드합니다.

---

## 5. 핸드북 소책자 (HWPX / PDF) 유지보수

휴대용 인쇄 소책자(A6 사이즈)의 원본과 인쇄용 PDF 관리 방법입니다.

* **마스터 소책자 한글 원본**: `hwp_source/4주기 요양병원인증 교육 핸드북(네이처요양병원)_완료.hwpx`
* **웹앱 제공용 인쇄 PDF**: `app/public/nature_handbook_print.pdf` (앱 내 [소책자 다운로드] 링크 연동)

### 소책자 내용 수정 시 절차:
1. `hwp_source/4주기 요양병원인증 교육 핸드북(네이처요양병원)_완료.hwpx` 한글 파일 내용 수정 및 저장
2. 소책자 PDF 원클릭 갱신 명령 실행:
   ```bash
   python scripts/convert_single.py "hwp_source/4주기 요양병원인증 교육 핸드북(네이처요양병원)_완료.hwpx" "app/public/nature_handbook_print.pdf"
   ```
3. 생성된 소책자 PDF 페이지수 및 주요 키워드 자동 검증 완료 확인 후 깃 커밋

---

## 6. 부서별 맞춤 뷰 및 필수 33개 항목 관리

### 6.1 11개 대상 부서 필터링 로직 (`app/src/utils/deptUtils.js`)
부서별 직원이 로그인 시(또는 설정 변경 시) 해당 부서에 해당하는 규정과 우선순위 항목만 필터링됩니다.
- 대상 부서: 간호부, 진료부, 약제과, 영양과, 재활치료실, 의료정보실/원무, 시설팀, 영상검사실, 임상병리실, 감염관리실, QPS실
- 부서 매핑 갱신이 필요할 때는 `scripts/update_dept_utils.cjs`를 실행하여 59개 규정의 `department` 배열을 일괄 매핑합니다.

### 6.2 33개 필수 조사항목 (`allStaffChecklist.json`)
인증평가에서 단 1개라도 불일치(하) 판정을 받으면 즉시 **불인증**되는 33개 핵심 항목입니다.
- 항목 위치: `app/src/data/allStaffChecklist.json`
- 직원 체크 완료 상태는 사용자의 모바일 `localStorage`(`nature_checklist_progress`)에 안전하게 저장됩니다.

---

## 7. 웹앱 빌드 및 배포 (Vercel & PWA)

### 7.1 로컬 개발 서버 실행
```bash
cd app
npm install
npm run dev
```
브라우저에서 `http://localhost:3000` (또는 Vite 할당 포트)으로 접속합니다.

### 7.2 프로덕션 빌드
```bash
cd app
npm run build
```
빌드 산출물은 `app/dist/` 디렉토리에 생성됩니다.

### 7.3 Vercel 배포
저장소가 GitHub(`kisayo11/nature-q-pocket`)과 연동되어 있으므로 `main` 브랜치에 `git push`가 이루어지면 Vercel에서 자동으로 프로덕션 빌드 및 배포가 완료됩니다.
* 설정 파일: `vercel.json` (루트 위치)
* 정적 파일 캐시 헤더 및 SPA 라우팅 리라이트 규칙 내장

---

## 8. 긴급 대응 모달, 계산기, 퀴즈 데이터 갱신

| 기능 탭 | 관련 파일 | 수정 시 유의사항 |
|---|---|---|
| **화재 비상(900) & 소방대** | `app/src/data/fireBrigadeData.json`, `EmergencyModal.jsx` | 주간/야간 연락처 및 1인/2인/3인 초기 소화·통보 요령 유지 |
| **CPR & Spill Kit** | `app/src/data/spillKitData.js`, `EmergencyModal.jsx` | 3분 골든타임 타이머 및 5,000ppm 락스 희석액 비율(1:8) 불변 |
| **낙상·욕창 계산기** | `app/src/components/Calculators.jsx` | Morse Scale(0~125점), Braden Scale(6~23점) 공식 로직 준수 |
| **위기치(CVR) 분석기** | `app/src/components/Calculators.jsx` | Hb < 7.0, Glucose < 50 또는 > 400, K < 2.8 또는 > 6.0 임계치 |
| **1일 1분 퀴즈** | `app/src/data/quizData.json` | 각 문제 객체에 `id`, `category`, `question`, `options`, `answer`, `explanation` 포함 |

---

## 9. 운영 트러블슈팅 및 장애 복구 가이드

### Q1. 새 규정을 반영했는데 모바일 폰에서 예전 내용이 계속 나옵니다.
* **원인**: PWA Service Worker(`sw.js`) 또는 브라우저 로컬 캐시 때문입니다.
* **해결**:
  1. 앱 우측 상단 [설정] 탭 ➔ **[캐시 초기화 & 최신 데이터 갱신]** 버튼 클릭
  2. 모바일 브라우저 새로고침(또는 홈 화면 바로가기 재실행)

### Q2. 구글 시트에서 수정한 내용이 웹앱에 실시간으로 반영되지 않습니다.
* **원인**: Google Sheets API 호출 주기 또는 로컬스토리지 우선 표시 정책.
* **해결**:
  1. 구글 시트에서 [공유] 권한이 "링크가 있는 모든 사용자(뷰어)"로 되어 있는지 확인
  2. 앱 [설정] ➔ **[구글 시트 즉시 동기화]** 클릭
  3. 콘솔 로그(`F12`)에서 `[GoogleSheetsSync] Sync success` 메시지 확인

### Q3. 규정 번호(코드)를 새로 추가하거나 변경할 때 주의할 점은?
1. `scripts/build_authentic_master.cjs`에 추가
2. `app/public/regulations/{코드}.pdf` 파일 배치
3. `node scripts/build_authentic_master.cjs` ➔ `node scripts/merge_to_rules_data.cjs` 순차 실행
4. `allStaffChecklist.json`이나 `deptUtils.js`에 해당 규정 코드가 포함되어야 하는지 확인

---

**네이처요양병원 4주기 인증평가 수검의 완벽한 성공을 지원합니다.**  
시스템 문의 및 기술 지원: QPS실 / 전산 유지보수팀
