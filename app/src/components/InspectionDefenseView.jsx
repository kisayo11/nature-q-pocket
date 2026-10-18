import React, { useState } from 'react';
import {
  MessageSquare, Zap, CheckCircle2, ArrowRight,
  ShieldAlert, Sparkles, BookOpen, Clock, HelpCircle,
  AlertTriangle, Droplets, HeartPulse, Flame, ShieldCheck, Stethoscope
} from 'lucide-react';
import {
  DEPARTMENTS,
  DEPARTMENT_QUICK_ANSWERS
} from '../utils/deptUtils';
import tracerScenarios from '../data/tracerScenarios.json';

const ICON_MAP = {
  AlertTriangle,
  Droplets,
  HeartPulse,
  Flame,
  ShieldCheck,
  Stethoscope
};

export default function InspectionDefenseView({
  selectedDept = '간호부',
  onOpenRule,
  initialSubTab = 'quick'
}) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // 'quick' | 'tracer'
  const [activeDept, setActiveDept] = useState(selectedDept || '간호부');
  const [activeScenarioId, setActiveScenarioId] = useState('fall');

  const currentQuickAnswers = DEPARTMENT_QUICK_ANSWERS[activeDept] || DEPARTMENT_QUICK_ANSWERS['간호부'];
  const activeScenario = tracerScenarios.find((s) => s.id === activeScenarioId) || tracerScenarios[0];
  const IconComponent = ICON_MAP[activeScenario.icon] || AlertTriangle;

  return (
    <div className="inspection-view-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '1060px', margin: '0 auto', width: '100%' }}>
      {/* 1. Header Segmented Control (3초 구두답변 vs 돌발 추적조사) */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.3px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="var(--primary)" />
              <span>현장 실사 완벽 대응 (말하기 & 행동하기)</span>
            </h1>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '3px 0 0' }}>
              조사위원의 기습 질문에 3초 내 구두 답변하고, 6대 돌발 상황 시 즉각 행동합니다.
            </p>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '3px 9px',
            borderRadius: '16px',
            border: '1px solid hsla(168, 80%, 28%, 0.15)'
          }}>
            실사 방어 전용 허브
          </span>
        </div>

        {/* 2-Way Segmented Control */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            background: 'var(--surface-raised)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid var(--border)'
          }}
        >
          <button
            onClick={() => setActiveSubTab('quick')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '9px',
              border: 'none',
              background: activeSubTab === 'quick' ? 'var(--surface)' : 'transparent',
              color: activeSubTab === 'quick' ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: activeSubTab === 'quick' ? 800 : 600,
              cursor: 'pointer',
              boxShadow: activeSubTab === 'quick' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <MessageSquare size={16} />
            <span>3초 구두 답변 (부서별 즉답)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tracer')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '9px',
              border: 'none',
              background: activeSubTab === 'tracer' ? 'var(--surface)' : 'transparent',
              color: activeSubTab === 'tracer' ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: activeSubTab === 'tracer' ? 800 : 600,
              cursor: 'pointer',
              boxShadow: activeSubTab === 'tracer' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Zap size={16} />
            <span>돌발 추적조사 (Tracer 6대)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SUB-TAB 1: 3초 구두 답변 (부서별 실사 기습질문 즉답)
         ========================================================================= */}
      {activeSubTab === 'quick' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Department switcher chips */}
          <div
            style={{
              display: 'flex',
              gap: 6,
              overflowX: 'auto',
              padding: '2px 0 6px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {DEPARTMENTS.map((dept) => {
              const isActive = activeDept === dept.name;
              return (
                <button
                  key={dept.id}
                  onClick={() => setActiveDept(dept.name)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '18px',
                    fontSize: '12px',
                    fontWeight: isActive ? 800 : 600,
                    background: isActive ? 'var(--primary)' : 'var(--surface)',
                    color: isActive ? '#fff' : 'var(--text-sub)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{dept.icon}</span>
                  <span>{dept.name}</span>
                  {selectedDept === dept.name && (
                    <span style={{
                      fontSize: '9px',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--border)',
                      color: isActive ? '#fff' : 'var(--text-muted)'
                    }}>
                      내부서
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Answer Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '12px'
            }}
          >
            {currentQuickAnswers.map((item, idx) => (
              <div
                key={idx}
                className={`quick-answer-card border-${item.color}`}
                onClick={() => onOpenRule && onOpenRule(item.code)}
                style={{
                  minWidth: 0,
                  maxWidth: 'none',
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)' }}>
                    규정 {item.code}
                  </span>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {activeDept} 즉답
                  </span>
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px' }}>
                  {item.title}
                </h3>
                <div style={{
                  background: 'var(--surface-raised)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12.5px',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  lineHeight: 1.5,
                  marginBottom: '10px'
                }}>
                  "{item.answer}"
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 700, color: 'var(--primary)' }}>
                  <span>상세 규정 전문 열람</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: 돌발 추적조사 (Tracer 6대 현장시나리오)
         ========================================================================= */}
      {activeSubTab === 'tracer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Scenario Selector Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 6,
              overflowX: 'auto',
              padding: '2px 0 6px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {tracerScenarios.map((s) => {
              const TabIcon = ICON_MAP[s.icon] || AlertTriangle;
              const isActive = s.id === activeScenarioId;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveScenarioId(s.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                    background: isActive ? 'var(--primary)' : 'var(--surface)',
                    color: isActive ? '#fff' : 'var(--text-sub)',
                    fontSize: '12px',
                    fontWeight: isActive ? 800 : 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <TabIcon size={14} color={isActive ? '#fff' : 'var(--text-muted)'} />
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Scenario Detail Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '14px',
              alignItems: 'start'
            }}
          >
            {/* Left: Banner & Timeline Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <IconComponent size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 800,
                          color: '#fff',
                          background: 'var(--primary)',
                          padding: '1px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        {activeScenario.badge}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        규정 {activeScenario.relatedRule} 연계
                      </span>
                    </div>
                    <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      {activeScenario.title}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Action Steps Timeline */}
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={16} color="var(--primary)" />
                  <span>실사 행동 단계별 타임라인 (Action Steps)</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeScenario.steps.map((st, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--surface-raised)',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          color: '#fff',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)' }}>
                            {st.actor}
                          </span>
                          {st.time && (
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                color: 'var(--danger)',
                                background: 'var(--danger-light)',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              <Clock size={10} />
                              <span>{st.time}</span>
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-sub)', margin: 0, lineHeight: 1.45 }}>
                          {st.action}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Surveyor Q&A + Tips + Regulation Link */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <HelpCircle size={16} color="var(--warning)" />
                  <span>조사위원 현장 기습 질문 (Surveyor Q)</span>
                </div>

                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-raised)',
                    borderLeft: '3.5px solid var(--warning)',
                    fontSize: '12.5px',
                    color: 'var(--text-main)',
                    fontWeight: 600,
                    lineHeight: 1.55
                  }}
                >
                  "{activeScenario.surveyorQuestion}"
                </div>
              </div>

              {/* Consultant Tip */}
              <div
                style={{
                  background: 'linear-gradient(135deg, hsla(168, 55%, 96%, 0.9) 0%, hsla(178, 60%, 94%, 0.8) 100%)',
                  border: '1px solid hsla(168, 80%, 30%, 0.2)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: 'var(--primary)',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={16} color="var(--primary)" />
                  <span>인증 컨설턴트 핵심 검증 포인트</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-main)', margin: 0, lineHeight: 1.55 }}>
                  {activeScenario.keyTip}
                </p>
              </div>

              {/* Regulation Link */}
              {onOpenRule && (
                <button
                  onClick={() => onOpenRule(activeScenario.relatedRule)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface)',
                    border: '1.5px solid var(--primary)',
                    color: 'var(--primary)',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={16} />
                    <span>관련 공식 규정 {activeScenario.relatedRule} 전문 확인</span>
                  </div>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
