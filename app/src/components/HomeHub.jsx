import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, BookOpen, ArrowRight, CheckCircle2,
  ChevronRight, ShieldCheck, Stethoscope,
  Zap, MessageSquare, Award
} from 'lucide-react';
import {
  DEPARTMENTS,
  DEPARTMENT_QUICK_ANSWERS,
  getRulesByDept
} from '../utils/deptUtils';
import TracerScenariosCard from './TracerScenariosCard';

export default function HomeHub({
  rules = [],
  checkedMustPass = {},
  selectedDept = '간호부',
  onSelectDept,
  onNavigateTab,
  onOpenRule,
  onOpenEmergency,
  onOpenMustPass
}) {
  const mustPassRules = rules.filter((r) => r.isMustPass);
  const mustPassTotal = mustPassRules.length || 10;
  const mustPassCheckedCount = mustPassRules.filter((r) => checkedMustPass[r.code]).length;
  const masteryRate = Math.round((mustPassCheckedCount / mustPassTotal) * 100);

  // Home Hub Segmented View Mode ('tracer' | 'quick' | 'dept')
  const [activeHubView, setActiveHubView] = useState('tracer');

  // Active Department for 3-Second Quick Answers
  const [activeAnswerDept, setActiveAnswerDept] = useState(selectedDept || '간호부');

  useEffect(() => {
    if (selectedDept) {
      setActiveAnswerDept(selectedDept);
    }
  }, [selectedDept]);

  const currentQuickAnswers = DEPARTMENT_QUICK_ANSWERS[activeAnswerDept] || DEPARTMENT_QUICK_ANSWERS['간호부'];

  return (
    <div className="home-hub-clean-wrap">
      {/* LEFT COLUMN (Desktop) / TOP AREA (Mobile) */}
      <div className="home-hub-col-left">
        {/* 1. Integrated Hero Card */}
        <section className="hub-hero-card">
          <div className="hero-top-row">
            <span className="hero-dept-tag">
              <span className="hero-dept-dot" />
              <span>{selectedDept} 인증 규정</span>
            </span>
            <span className="hero-status-pill">
              4주기 인증 기준
            </span>
          </div>

          <h1 className="hero-main-title">
            네이처 요양병원 실무 규정집
          </h1>

          {/* Must-Pass Checklist Progress */}
          <div className="hero-progress-wrap">
            <div className="hero-progress-head">
              <span className="hp-title">
                <ShieldCheck size={15} color="var(--primary)" />
                <span>★ 10대 탈락방지 필수 규정</span>
              </span>
              <span className="hp-score">
                <strong>{mustPassCheckedCount}</strong> / {mustPassTotal}항목 ({masteryRate}%)
              </span>
            </div>
            <div className="hero-progress-track">
              <div
                className="hero-progress-fill"
                style={{ width: `${Math.min(masteryRate, 100)}%` }}
              />
            </div>
          </div>

          {/* Direct Hotline Quick Button */}
          <button
            onClick={() => {
              if (onOpenMustPass) onOpenMustPass();
              else onNavigateTab('handbook');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
              border: '1px solid #fecdd3',
              cursor: 'pointer',
              color: '#9f1239',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px' }}>🚨</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 800 }}>10대 필수 규정 핫라인</div>
                <div style={{ fontSize: '10.5px', color: '#be123c' }}>불인증 직결 핵심 규정 원클릭 열람</div>
              </div>
            </div>
            <ChevronRight size={15} color="#e11d48" />
          </button>

          {/* Integrated Printed Handbook Link Button */}
          <a
            href="/nature_handbook_print.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-handbook-link"
          >
            <div className="hhl-left">
              <BookOpen size={15} className="hhl-icon" />
              <div className="hhl-text">
                <span className="hhl-title">인쇄용 요약 핸드북 소책자 (74P)</span>
                <span className="hhl-sub">실물 배포본 전자책 전체 열람</span>
              </div>
            </div>
            <ChevronRight size={15} className="hhl-arrow" />
          </a>
        </section>

        {/* 2. 4-Grid Core Action Shortcuts */}
        <div className="hub-core-actions-grid">
          <div
            className={`hub-core-card ${activeHubView === 'tracer' ? 'active-tracer' : ''}`}
            onClick={() => setActiveHubView('tracer')}
          >
            <div className="hcc-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
              <Zap size={18} />
            </div>
            <div className="hcc-info">
              <strong className="hcc-title">돌발 Tracer</strong>
              <span className="hcc-sub">6대 실사시나리오</span>
            </div>
          </div>

          <div
            className={`hub-core-card ${activeHubView === 'quick' ? 'active-quick' : ''}`}
            onClick={() => setActiveHubView('quick')}
          >
            <div className="hcc-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <MessageSquare size={18} />
            </div>
            <div className="hcc-info">
              <strong className="hcc-title">3초 구두답변</strong>
              <span className="hcc-sub">부서별 핵심즉답</span>
            </div>
          </div>

          <div
            className={`hub-core-card ${activeHubView === 'dept' ? 'active-dept' : ''}`}
            onClick={() => setActiveHubView('dept')}
          >
            <div className="hcc-icon" style={{ background: '#fdf4ff', color: '#9333ea' }}>
              <Stethoscope size={18} />
            </div>
            <div className="hcc-info">
              <strong className="hcc-title">부서별 규정</strong>
              <span className="hcc-sub">11개 부서 바로가기</span>
            </div>
          </div>

          <div
            className="hub-core-card"
            onClick={() => onNavigateTab('quiz')}
          >
            <div className="hcc-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
              <Award size={18} />
            </div>
            <div className="hcc-info">
              <strong className="hcc-title">실전 모의퀴즈</strong>
              <span className="hcc-sub">60문항 암기카드</span>
            </div>
          </div>
        </div>

        {/* 3. Compact Emergency Strip */}
        <div
          className="hub-emergency-strip"
          onClick={() => onOpenEmergency('menu')}
        >
          <div className="hes-left">
            <span className="hes-badge">비상</span>
            <span className="hes-numbers">화재 900 · CPR 900 · 보안 901</span>
          </div>
          <span className="hes-link">
            전체 비상망 <ChevronRight size={13} />
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN (Desktop) / MAIN FOCUS AREA (Mobile) */}
      <div className="home-hub-col-right">
        {/* Segmented Control Bar */}
        <div className="hub-segmented-bar">
          <button
            className={`hsb-tab ${activeHubView === 'tracer' ? 'active' : ''}`}
            onClick={() => setActiveHubView('tracer')}
          >
            <Zap size={14} />
            <span>⚡ 돌발 Tracer (6대)</span>
          </button>
          <button
            className={`hsb-tab ${activeHubView === 'quick' ? 'active' : ''}`}
            onClick={() => setActiveHubView('quick')}
          >
            <MessageSquare size={14} />
            <span>💬 3초 구두답변</span>
          </button>
          <button
            className={`hsb-tab ${activeHubView === 'dept' ? 'active' : ''}`}
            onClick={() => setActiveHubView('dept')}
          >
            <Stethoscope size={14} />
            <span>🏢 부서별 규정 (11개)</span>
          </button>
        </div>

        {/* Dynamic View 1: Tracer Scenarios */}
        {activeHubView === 'tracer' && (
          <div className="hub-tab-pane">
            <TracerScenariosCard onOpenRule={onOpenRule} />
          </div>
        )}

        {/* Dynamic View 2: 3-Second Quick Answers */}
        {activeHubView === 'quick' && (
          <div className="hub-tab-pane">
            <div className="hub-sec-header" style={{ marginBottom: 10 }}>
              <div className="hub-sec-title">
                <CheckCircle2 size={17} color="var(--primary)" />
                <span>조사위원 질문 시 3초 구두 답변 ({activeAnswerDept})</span>
              </div>
              <button
                className="hub-sec-link"
                onClick={() => onNavigateTab('golden')}
              >
                기준 수치 <ChevronRight size={13} />
              </button>
            </div>

            {/* Department switch tabs */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
              {DEPARTMENTS.map((dept) => {
                const isActive = activeAnswerDept === dept.name;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setActiveAnswerDept(dept.name)}
                    style={{
                      padding: '6px 11px',
                      borderRadius: '16px',
                      fontSize: '11.5px',
                      fontWeight: isActive ? 800 : 600,
                      background: isActive ? 'var(--primary)' : 'var(--surface-raised)',
                      color: isActive ? '#fff' : 'var(--text-muted)',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <span>{dept.icon}</span>
                    <span>{dept.name}</span>
                    {selectedDept === dept.name && (
                      <span style={{ fontSize: '9px', padding: '1px 4px', borderRadius: '4px', background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--border)', color: isActive ? '#fff' : 'var(--text-muted)' }}>내부서</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Answer Cards */}
            <div className="quick-answers-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
              {currentQuickAnswers.map((item, idx) => (
                <div
                  key={idx}
                  className={`quick-answer-card border-${item.color}`}
                  onClick={() => onOpenRule(item.code)}
                  style={{ minWidth: 0, maxWidth: 'none' }}
                >
                  <div className="qac-top">
                    <span className="qac-code">규정 {item.code}</span>
                    <span className="qac-tag">{activeAnswerDept} 답변</span>
                  </div>
                  <h3 className="qac-title">{item.title}</h3>
                  <p className="qac-text">"{item.answer}"</p>
                  <div className="qac-footer">
                    <span>상세 규정 열람</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic View 3: Department Chips */}
        {activeHubView === 'dept' && (
          <div className="hub-tab-pane">
            <div className="hub-sec-header" style={{ marginBottom: 10 }}>
              <div className="hub-sec-title">
                <Stethoscope size={17} color="var(--primary)" />
                <span>부서별 주요 규정 바로가기</span>
              </div>
              <span className="hub-sec-hint">선택 시 규정집 필터로 이동</span>
            </div>

            <div className="dept-chips-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
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
                    style={{ padding: '12px 8px' }}
                  >
                    <span className="dcb-icon">{dept.icon}</span>
                    <span className="dcb-name">{dept.name}</span>
                    <span className="dcb-count">{ruleCount}개</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
