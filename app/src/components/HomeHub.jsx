import React, { useState, useEffect } from 'react';
import {
  BookOpen, ArrowRight, CheckCircle2, ChevronRight,
  ShieldCheck, Stethoscope, Zap, Clock, Award
} from 'lucide-react';
import {
  DEPARTMENTS,
  DEPARTMENT_QUICK_ANSWERS,
  getRulesByDept
} from '../utils/deptUtils';

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

  // Active Department for 3-Second Quick Answers (기본값: 내 소속 부서)
  const [activeAnswerDept, setActiveAnswerDept] = useState(selectedDept || '간호부');

  useEffect(() => {
    if (selectedDept) {
      setActiveAnswerDept(selectedDept);
    }
  }, [selectedDept]);

  const currentQuickAnswers = DEPARTMENT_QUICK_ANSWERS[activeAnswerDept] || DEPARTMENT_QUICK_ANSWERS['간호부'];

  return (
    <div className="home-hub-clean-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Integrated Hero Card (소속 부서 + 10대 필수 달성도 + 인쇄본 링크) */}
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
              <span>★ 10대 탈락방지 필수 규정 (Must-Pass)</span>
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

        {/* Direct Must-Pass Hotline Banner Button */}
        <button
          onClick={() => {
            if (onOpenMustPass) onOpenMustPass();
            else onNavigateTab('handbook');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 14px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
            border: '1.5px solid #fecdd3',
            cursor: 'pointer',
            color: '#9f1239',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>🚨</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#e11d48' }}>
                10대 필수 규정 핫라인 (원클릭 모드)
              </div>
              <div style={{ fontSize: '11px', color: '#9f1239', marginTop: '1px' }}>
                불인증 직결 핵심 10대 규정만 모아서 보기
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '11px',
            fontWeight: 800,
            background: '#fff',
            color: '#e11d48',
            padding: '4px 8px',
            borderRadius: '6px',
            border: '1px solid #fda4af'
          }}>
            <span>열람</span>
            <ChevronRight size={13} />
          </div>
        </button>

        {/* Integrated Printed Handbook Link Button */}
        <a
          href="/nature_handbook_print.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-handbook-link"
        >
          <div className="hhl-left">
            <BookOpen size={16} className="hhl-icon" />
            <div className="hhl-text">
              <span className="hhl-title">인쇄용 요약 핸드북 소책자 (74P)</span>
              <span className="hhl-sub">원내 실물 배포본 전자책 전체 페이지 열람</span>
            </div>
          </div>
          <ChevronRight size={16} className="hhl-arrow" />
        </a>
      </section>

      {/* 2. 4-Grid Core Action Shortcuts (핵심 바로가기) */}
      <section className="hub-core-actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '10px' }}>
        <div
          className="hub-core-card"
          onClick={() => onNavigateTab('tracer')}
          style={{ cursor: 'pointer' }}
        >
          <div className="hcc-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
            <Zap size={20} />
          </div>
          <div className="hcc-info">
            <strong className="hcc-title">실사 추적조사</strong>
            <span className="hcc-sub">6대 돌발 Tracer</span>
          </div>
        </div>

        <div
          className="hub-core-card"
          onClick={() => onNavigateTab('golden')}
          style={{ cursor: 'pointer' }}
        >
          <div className="hcc-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Clock size={20} />
          </div>
          <div className="hcc-info">
            <strong className="hcc-title">기준 수치표</strong>
            <span className="hcc-sub">시간·온도·주기 30선</span>
          </div>
        </div>

        <div
          className="hub-core-card"
          onClick={() => onNavigateTab('quiz')}
          style={{ cursor: 'pointer' }}
        >
          <div className="hcc-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
            <Award size={20} />
          </div>
          <div className="hcc-info">
            <strong className="hcc-title">실전 모의퀴즈</strong>
            <span className="hcc-sub">60문항 암기카드</span>
          </div>
        </div>

        <div
          className="hub-core-card"
          onClick={() => onNavigateTab('handbook')}
          style={{ cursor: 'pointer' }}
        >
          <div className="hcc-icon" style={{ background: '#fdf4ff', color: '#9333ea' }}>
            <BookOpen size={20} />
          </div>
          <div className="hcc-info">
            <strong className="hcc-title">규정집 전체</strong>
            <span className="hcc-sub">12개 챕터 58규정</span>
          </div>
        </div>
      </section>

      {/* 3. Essential 3-Second Oral Answers (내 부서 맞춤 3초 구두답변) */}
      <section className="hub-section-block">
        <div className="hub-sec-header" style={{ marginBottom: '10px' }}>
          <div className="hub-sec-title">
            <CheckCircle2 size={17} color="var(--primary)" />
            <span>조사위원 질문 시 3초 구두 답변</span>
          </div>
          <button
            className="hub-sec-link"
            onClick={() => onNavigateTab('golden')}
          >
            기준 수치 <ChevronRight size={13} />
          </button>
        </div>

        {/* Department tabs */}
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
                  gap: 4,
                  transition: 'all 0.15s ease'
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
      </section>

      {/* 4. Department Filter Chips (부서별 주요 규정 바로가기) */}
      <section className="hub-section-block">
        <div className="hub-sec-header" style={{ marginBottom: '10px' }}>
          <div className="hub-sec-title">
            <Stethoscope size={17} color="var(--primary)" />
            <span>부서별 주요 규정 바로가기</span>
          </div>
          <span className="hub-sec-hint">선택 시 해당 부서 규정만 필터링</span>
        </div>

        <div className="dept-chips-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
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
                style={{ padding: '10px 8px' }}
              >
                <span className="dcb-icon">{dept.icon}</span>
                <span className="dcb-name">{dept.name}</span>
                <span className="dcb-count">{ruleCount}개</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
