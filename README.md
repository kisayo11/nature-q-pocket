# 네이처요양병원 4주기 의료기관 인증 스마트 규정집 (Nature Q-Pocket)

[![GitHub License](https://img.shields.io/badge/license-Hospital%20Confidential-green.svg)](https://github.com/kisayo11/nature-q-pocket)
[![Target Cycle](https://img.shields.io/badge/KOIHA-4주기%20요양병원인증-blue.svg)](https://www.koiha.or.kr)
[![Accreditation Date](https://img.shields.io/badge/수검일자-2026.11.25~27-orange.svg)](#)

> **네이처 요양병원 (223병상) 4주기 의료기관 인증 수검 대비 58개 공식 규정 모바일 스마트 핸드북 & 3초 구두 구술 방어 시스템**

---

## 📌 주요 핵심 기능

### 1. 3초 구두 모범 답변 시스템 (Quick Response)
- 현장 조사위원이 병동, 진료실, 조리실 등에서 기습 질문 시 **3초 이내에 답변 가능한 표준 핵심 구술 모범 답변** 제공
- 주요 구술 답변 1-터치 클립보드 복사 기능

### 2. ★필수 33개 조사항목 100% 방어 체크리스트
- 인증 기준 중 **단 1개라도 불일치(하) 판정 시 인증 취소(불인증)**되는 33개 필수 기준 전용 탭
- 부서별/조사항목별 실시간 숙지 완료 체크 및 진행률 트래킹

### 3. 초성 및 통합 검색 (Korean Choseong Search)
- `ㄴㅅ` (낙상), `ㅅㅇㅅ` (손위생), `ㅂㅎㄷ` (보호대), `1.1` 등 초성과 코드 번호, 부서명으로 0.1초 즉시 검색

### 4. 4대 비상 대응 긴급 모달 (Emergency Fast-Launcher)
- **화재 비상 (900):** 원무과 상황실 직통 내선 900번, 1인/2인/3인 근무 시 초기 행동 요령
- **심폐소생술 (CPR & AED):** 3분 골든타임 타이머, 3병동/6병동 제세동기 위치 안내
- **Spill Kit:** 5,000ppm 치아염소산나트륨 키트 사용 6단계
- **원내 보안:** 폭력/폭언/무단이탈 시 코드 및 비상 연락망

### 5. 임상 실무 자동 계산기 (Calculators)
- **Morse 낙상 위험도 평가도구 (0~125점 자동 채점 & 고위험군 알림)**
- **Braden 욕창 위험도 평가도구 (6~23점 자동 채점)**
- **약품 개봉 유효기간 라벨 생성기 (인슐린 28일, 시럽/연고 개봉 후 6개월, 소분 30일 자동 계산)**
- **CVR (위기치) 검사 결과 분석기 (Hb < 7.0, Glucose < 50, K < 2.8 / > 6.0 긴급 알림)**

### 6. 일일 1분 퀴즈 & 플래시 암기카드
- 전 직원 인증 상식 자가진단 및 플래시 카드 넘김 학습
- 부서별 랭킹 시스템

### 7. Google Drive & Sheets 마스터DB 실시간 연동
- 구글 스프레드시트 마스터 DB(`네이처요양병원_인증핸드북_마스터DB`)와 실시간 동기화 지원

---

## 🛠 실행 방법 (Local Development)

```bash
cd app
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

---

## 📂 디렉토리 구조

```
handbook/
├── app/                     # React 19 + Vite 모바일 PWA 스마트 웹앱
│   ├── src/
│   │   ├── components/      # UI 컴포넌트 (계산기, 퀴즈, 모달, 헤더 등)
│   │   ├── data/            # 58개 규정 및 퀴즈/비상 마스터 JSON
│   │   └── index.css        # HSL 기반 모바일 테마 스타일시트
│   └── public/              # PWA manifest.json, sw.js, icon.svg
├── google_sheets/           # 구글 드라이브 마스터 DB용 CSV 5종
├── [NATURE]*.pdf            # 병원 인증 58개 공식 규정집 원본
├── EXPERT_AUDIT_AND_DEFENSE_ANALYSIS.md   # 전문 수검 방어 감사 리포트
├── HOSPITAL_DATA_INPUT_GUIDE.md           # 병원 데이터 매핑 가이드
└── NATURE_HOSPITAL_ACCREDITATION_APP_MASTERPLAN.md # 프로젝트 마스터플랜
```
