import React, { useState } from 'react';
import {
  AlertTriangle, Droplets, HeartPulse, Flame, ShieldCheck,
  Stethoscope, ChevronRight, Clock, HelpCircle, Sparkles, BookOpen,
  CheckCircle2, ArrowRight
} from 'lucide-react';
import tracerScenarios from '../data/tracerScenarios.json';

const ICON_MAP = {
  AlertTriangle,
  Droplets,
  HeartPulse,
  Flame,
  ShieldCheck,
  Stethoscope
};

export default function TracerScenariosView({ onOpenRule }) {
  const [activeScenarioId, setActiveScenarioId] = useState('fall');

  const activeScenario = tracerScenarios.find((s) => s.id === activeScenarioId) || tracerScenarios[0];
  const IconComponent = ICON_MAP[activeScenario.icon] || AlertTriangle;

  return (
    <div className="tracer-view-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Page Header */}
      <div
        className="tracer-page-header"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 18px',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(5,150,105,0.25)'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '17px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.3px', margin: 0 }}>
                현장 실사 추적조사(Tracer) 대응 시나리오
              </h1>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                조사위원의 병동 라운딩 및 돌발 상황 검증 시 1분 내 표준 행동 지침
              </p>
            </div>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '4px 10px',
            borderRadius: '20px',
            border: '1px solid hsla(168, 80%, 28%, 0.15)',
            whiteSpace: 'nowrap'
          }}>
            실사 100% 빈출 (6대)
          </span>
        </div>

        {/* 2. Scenario Switcher Tabs */}
        <div
          className="tracer-tab-bar"
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingTop: '10px',
            paddingBottom: '2px',
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
                  background: isActive ? 'var(--primary)' : 'var(--surface-raised)',
                  color: isActive ? '#fff' : 'var(--text-main)',
                  fontSize: '12px',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <TabIcon size={14} color={isActive ? '#fff' : 'var(--text-muted)'} />
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Active Scenario Detail View (2-Column on Desktop) */}
      <div
        className="tracer-content-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '16px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Title & Timeline Action Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Scenario Banner */}
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
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color: '#fff',
                      background: 'var(--primary)',
                      padding: '2px 7px',
                      borderRadius: '4px'
                    }}
                  >
                    {activeScenario.badge}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    규정 {activeScenario.relatedRule} 연계
                  </span>
                </div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {activeScenario.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Timeline Action Steps */}
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
                    padding: '11px 12px',
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
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
                    <p style={{ fontSize: '12px', color: 'var(--text-sub)', margin: 0, lineHeight: 1.5 }}>
                      {st.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Surveyor Q&A + Consultant Tips + Rule Link */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Surveyor Typical Question Callout */}
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

          {/* Consultant Pass Tips */}
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
                marginBottom: '8px',
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

          {/* Link to Full Regulation */}
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
                <span>관련 공식 규정 {activeScenario.relatedRule} 전문 및 서식 확인</span>
              </div>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
