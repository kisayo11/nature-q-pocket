import React from 'react';
import {
  BookOpen, ChevronRight, ShieldCheck, Stethoscope, ShieldAlert, Zap, Clock,
  Award, Star, Flame, UserCheck, Target, ClipboardList, Accessibility, Scan,
  Pill, UtensilsCrossed, Wrench, FileText
} from 'lucide-react';
import {
  DEPARTMENTS,
  getRulesByDept
} from '../utils/deptUtils';

function getDeptIcon(name) {
  switch (name) {
    case '간호부': return <Stethoscope size={15} />;
    case '진료부': return <UserCheck size={15} />;
    case 'QPS실': return <Target size={15} />;
    case '감염관리실': return <ShieldAlert size={15} />;
    case '원무과': return <ClipboardList size={15} />;
    case '재활치료실': return <Accessibility size={15} />;
    case '방사선실': return <Scan size={15} />;
    case '약제과': return <Pill size={15} />;
    case '영양팀': return <UtensilsCrossed size={15} />;
    case '시설팀': return <Wrench size={15} />;
    default: return <Stethoscope size={15} />;
  }
}

export default function HomeHub({
  rules = [],
  checkedMustPass = {},
  selectedDept = '간호부',
  onSelectDept,
  onNavigateTab,
  onOpenRule,
  onOpenMustPass
}) {
  const mustPassRules = rules.filter((r) => r.isMustPass);
  const mustPassTotal = mustPassRules.length || 10;
  const mustPassCheckedCount = mustPassRules.filter((r) => checkedMustPass[r.code]).length;
  const masteryRate = Math.round((mustPassCheckedCount / mustPassTotal) * 100);

  return (
    <div className="home-hub-clean-wrap">
      {/* 1. Clinical Command Hero Station */}
      <section className="hub-hero-card">
        {/* Masthead Header Strip */}
        <div className="hero-top-row">
          <div className="hero-badge-cluster">
            <span className="hero-dept-tag">
              <span className="hero-dept-dot" />
              <span>{selectedDept} 인증 규정</span>
            </span>
            <span className="hero-status-pill mono-num">
              4주기 인증 기준 // OFFICIAL
            </span>
          </div>
          <span className="hero-audit-badge mono-num">
            58 RULES
          </span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="hero-title-block">
          <h1 className="hero-main-title">
            네이처 요양병원 실무 규정집
          </h1>
          <p className="hero-subtitle">
            의료기관 인증평가 12개 장 58개 규정 및 현장 조사위원 구두 질의 수검 방어 핸드북
          </p>
        </div>

        {/* Physical 10-Segmented LED Must-Pass Meter */}
        <div className="hero-progress-wrap">
          <div className="hero-progress-head">
            <div className="hp-title">
              <ShieldCheck size={16} />
              <span>10대 탈락방지 필수 규정 (Must-Pass)</span>
            </div>
            <div className="hp-score mono-num">
              <strong>{mustPassCheckedCount}</strong> / {mustPassTotal} 완료
              <span className="hp-rate-pill">{masteryRate}%</span>
            </div>
          </div>

          {/* Discrete 10 LED Segment Cells */}
          <div className="hero-progress-segments">
            {Array.from({ length: mustPassTotal }).map((_, idx) => (
              <div
                key={idx}
                className={`hp-segment-cell ${idx < mustPassCheckedCount ? 'active' : ''}`}
                title={`필수 규정 ${idx + 1}번 숙지 현황`}
              />
            ))}
          </div>
        </div>

        {/* Action Tray: Direct Hotline & Official Printed Handbook */}
        <div className="hero-action-tray">
          <button
            className="hub-hotline-btn"
            onClick={() => {
              if (onOpenMustPass) onOpenMustPass();
              else onNavigateTab('handbook');
            }}
            aria-label="10대 필수 규정 핫라인 열람"
          >
            <div className="hhb-left">
              <div className="hhb-icon-wrap">
                <ShieldAlert size={18} />
              </div>
              <div className="hhb-text">
                <div className="hhb-title">10대 필수 규정 핫라인</div>
                <div className="hhb-sub">불인증 직결 필수 규정 모아보기</div>
              </div>
            </div>
            <div className="hhb-cta-pill">
              <span>열람</span>
              <ChevronRight size={13} />
            </div>
          </button>

          <a
            href="/nature_handbook_print.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-handbook-link"
            aria-label="핸드북 인쇄본 소책자 PDF 열람"
          >
            <div className="hhl-left">
              <div className="hhl-icon-wrap">
                <BookOpen size={16} />
              </div>
              <div className="hhl-text">
                <span className="hhl-title">핸드북 소책자 PDF (68P)</span>
                <span className="hhl-sub">원내 배포 인쇄본 원문 열람</span>
              </div>
            </div>
            <div className="hhl-cta-pill">
              <span>PDF</span>
              <ChevronRight size={13} />
            </div>
          </a>
        </div>
      </section>

      {/* 2. Dual Master Shortcuts Tray */}
      <section className="hub-dual-shortcuts">
        <button
          className="hub-shortcut-btn shortcut-master"
          onClick={() => onNavigateTab('common')}
          aria-label="전직원 17대 마스터 수칙 열기"
        >
          <div className="hsc-left">
            <div className="hsc-icon-wrap master">
              <Star size={15} />
            </div>
            <div className="hsc-text">
              <div className="hsc-title">전직원 17대 마스터 수칙</div>
              <div className="hsc-sub">신체보호대·화재·욕창 핵심 질문</div>
            </div>
          </div>
          <ChevronRight size={14} />
        </button>

        <button
          className="hub-shortcut-btn shortcut-brigade"
          onClick={() => onNavigateTab('brigade')}
          aria-label="내 자위소방대 역할 열기"
        >
          <div className="hsc-left">
            <div className="hsc-icon-wrap brigade">
              <Flame size={15} />
            </div>
            <div className="hsc-text">
              <div className="hsc-title">내 자위소방대 역할</div>
              <div className="hsc-sub">주간 5대팀 & 야간 2대축 비상행동</div>
            </div>
          </div>
          <ChevronRight size={14} />
        </button>
      </section>

      {/* 3. 4-Grid Core Action Shortcuts */}
      <section className="hub-core-actions-grid">
        <button
          className="hub-core-card active-tracer"
          onClick={() => onNavigateTab('inspection')}
          aria-label="실사 조사대응 콘솔 열기"
        >
          <div className="hcc-icon-wrap tracer">
            <Zap size={20} />
          </div>
          <div className="hcc-info">
            <div className="hcc-header-row">
              <strong className="hcc-title">실사 조사대응</strong>
              <span className="hcc-tag mono-num">3SEC</span>
            </div>
            <span className="hcc-sub">3초 구두답변 & 질의응답 Tracer</span>
          </div>
        </button>

        <button
          className="hub-core-card active-quick"
          onClick={() => onNavigateTab('golden')}
          aria-label="기준수치 및 계산기 열기"
        >
          <div className="hcc-icon-wrap quick">
            <Clock size={20} />
          </div>
          <div className="hcc-info">
            <div className="hcc-header-row">
              <strong className="hcc-title">기준수치·계산기</strong>
              <span className="hcc-tag mono-num">14종</span>
            </div>
            <span className="hcc-sub">골든넘버 수치 & 낙상·욕창 도구</span>
          </div>
        </button>

        <button
          className="hub-core-card active-dept"
          onClick={() => onNavigateTab('quiz')}
          aria-label="실전 모의퀴즈 열기"
        >
          <div className="hcc-icon-wrap quiz">
            <Award size={20} />
          </div>
          <div className="hcc-info">
            <div className="hcc-header-row">
              <strong className="hcc-title">실전 모의퀴즈</strong>
              <span className="hcc-tag mono-num">60Q</span>
            </div>
            <span className="hcc-sub">60문항 암기카드 & 복습 훈련</span>
          </div>
        </button>

        <button
          className="hub-core-card active-handbook"
          onClick={() => onNavigateTab('handbook')}
          aria-label="규정집 전체 열람하기"
        >
          <div className="hcc-icon-wrap handbook">
            <BookOpen size={20} />
          </div>
          <div className="hcc-info">
            <div className="hcc-header-row">
              <strong className="hcc-title">규정집 전체</strong>
              <span className="hcc-tag mono-num">58개</span>
            </div>
            <span className="hcc-sub">12개 챕터 58규정 원문 열람</span>
          </div>
        </button>
      </section>

      {/* 4. Laboratory 10-Department Sequencer Rack */}
      <section className="hub-section-block">
        <div className="hub-sec-header">
          <div className="hub-sec-title">
            <Stethoscope size={16} />
            <span>부서별 주요 규정 바로가기</span>
          </div>
          <span className="hub-sec-hint mono-num">10 DEPARTMENTS</span>
        </div>

        <div className="dept-chips-grid">
          {DEPARTMENTS.map((dept, idx) => {
            const ruleCount = getRulesByDept(rules, dept.name).length;
            const isSelected = selectedDept === dept.name;

            return (
              <button
                key={idx}
                className={`dept-chip-btn ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  onSelectDept(dept.name);
                  onNavigateTab('handbook');
                }}
                aria-label={`${dept.name} 규정 ${ruleCount}개 보기`}
              >
                <div className="dcb-icon-box">
                  {getDeptIcon(dept.name)}
                </div>
                <div className="dcb-info">
                  <span className="dcb-name">{dept.name}</span>
                  <span className="dcb-count mono-num">{ruleCount}개</span>
                </div>
                {isSelected && (
                  <div className="dcb-active-dot" />
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
