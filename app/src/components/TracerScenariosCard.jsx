import React, { useState } from 'react';
import {
  AlertTriangle, Droplets, HeartPulse, Flame, ShieldCheck,
  Stethoscope, ChevronRight, Clock, HelpCircle, Sparkles, BookOpen
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

export default function TracerScenariosCard({ onOpenRule }) {
  const [activeScenarioId, setActiveScenarioId] = useState('fall');

  const activeScenario = tracerScenarios.find((s) => s.id === activeScenarioId) || tracerScenarios[0];
  const IconComponent = ICON_MAP[activeScenario.icon] || AlertTriangle;

  return (
    <section className="hub-section-block tracer-scenarios-section" style={{ marginTop: '20px' }}>
      <div className="hub-sec-header" style={{ marginBottom: '12px' }}>
        <div className="hub-sec-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--primary)" />
          <span style={{ fontSize: '15px', fontWeight: 800 }}>현장 실사 추적조사(Tracer) 6대 돌발 대응</span>
        </div>
        <span className="hub-sec-hint" style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>
          실사 100% 빈출
        </span>
      </div>

      {/* 1. Horizontal Scenario Switcher Tabs */}
      <div
        className="tracer-tab-bar"
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '8px',
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
                background: isActive ? 'var(--primary-light)' : 'var(--surface)',
                color: isActive ? 'var(--primary)' : 'var(--text-sub)',
                fontSize: '12px',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <TabIcon size={13} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
              <span>{s.title.split(' ')[0]} {s.title.split(' ')[1]}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Active Scenario Detail Card */}
      <div
        className="calc-card tracer-detail-card"
        style={{
          marginTop: '6px',
          background: 'var(--surface-raised)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '16px',
          position: 'relative'
        }}
      >
        {/* Scenario Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconComponent size={20} color="var(--primary)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'var(--primary)',
                    color: '#fff'
                  }}
                >
                  {activeScenario.badge}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  관련규정 {activeScenario.relatedRule}
                </span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                {activeScenario.title}
              </h3>
            </div>
          </div>

          {onOpenRule && (
            <button
              onClick={() => onOpenRule(activeScenario.relatedRule)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 6px'
              }}
            >
              <span>규정보기</span>
              <ChevronRight size={13} />
            </button>
          )}
        </div>

        {/* Surveyor Typical Question Callout */}
        <div
          style={{
            background: 'var(--surface)',
            borderLeft: '3px solid var(--primary)',
            padding: '10px 12px',
            borderRadius: '4px 8px 8px 4px',
            marginBottom: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 800, color: 'var(--primary)', marginBottom: '3px' }}>
            <HelpCircle size={13} />
            <span>조사위원 현장 기습 질문</span>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-main)', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
            "{activeScenario.surveyorQuestion}"
          </p>
        </div>

        {/* Step-by-Step Action Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
          {activeScenario.steps.map((st, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                position: 'relative'
              }}
            >
              {/* Step Number Dot */}
              <div
                style={{
                  minWidth: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '1px'
                }}
              >
                {idx + 1}
              </div>

              {/* Step Content */}
              <div style={{ flex: 1, background: 'var(--surface)', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)' }}>
                    ⏱️ {st.time}
                  </span>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', background: 'var(--surface-raised)', padding: '1px 6px', borderRadius: '4px' }}>
                    {st.actor}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                  {st.action}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Consultant Key Tip */}
        <div
          style={{
            background: 'hsl(45, 100%, 95%)',
            border: '1px solid hsl(45, 90%, 80%)',
            borderRadius: '8px',
            padding: '10px 12px',
            fontSize: '11.5px',
            color: 'hsl(30, 90%, 25%)',
            lineHeight: 1.5,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '6px'
          }}
        >
          <span style={{ fontSize: '13px' }}>💡</span>
          <div>
            <strong style={{ fontWeight: 800 }}>인증컨설턴트 실사 조언: </strong>
            <span>{activeScenario.keyTip}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
