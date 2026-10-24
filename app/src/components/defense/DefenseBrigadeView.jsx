import React, { useState } from 'react';
import {
  Flame, Users, Bell, PhoneCall, ShieldAlert, ArrowRight,
  CheckCircle2, AlertTriangle, ShieldCheck, HeartPulse, ChevronDown, ChevronUp
} from 'lucide-react';
import fireBrigadeData from '../../data/fireBrigadeData.json';

export default function DefenseBrigadeView({ selectedDept = '간호부', onOpenRule }) {
  const [brigadeDept, setBrigadeDept] = useState(selectedDept || '간호부');
  const [showAllTeams, setShowAllTeams] = useState(false);
  const [showFacilities, setShowFacilities] = useState(false);
  const [showNightShiftAll, setShowNightShiftAll] = useState(false);

  const activeBrigadeInfo = fireBrigadeData.deptLookup[brigadeDept] || fireBrigadeData.deptLookup['간호부'];
  const matchingTeam = fireBrigadeData.teams.find((t) => t.id === activeBrigadeInfo.teamId) || fireBrigadeData.teams[2];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* 1. Emergency Core Rule Ribbon */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
          border: '1.5px solid #fecdd3',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🚨</span>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 900, color: '#9f1239', margin: 0 }}>
                자위소방대 비상방송 & 1초 골든룰
              </h2>
              <div style={{ fontSize: '12px', color: '#be123c', marginTop: '2px', fontWeight: 700 }}>
                방송 요청: 내선 900번에 <strong>"코드레드(Code Red) O병동 O호실 2회"</strong>
              </div>
            </div>
          </div>
          <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#9f1239', background: '#fff', padding: '3px 9px', borderRadius: '12px', border: '1px solid #fda4af' }}>
            대장: 병원장 | 부대장(소방관리자): 시설팀장
          </div>
        </div>

        <div style={{ background: '#fff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #fecdd3', fontSize: '11px', color: '#881337', fontWeight: 700 }}>
          ⚡ <strong>임무자 황금수칙(부록 3 ◈①):</strong> 통보연락 후 즉시 방화문을 닫고 피난유도팀에 합류할 것!
        </div>
      </div>

      {/* 2. Department Selector Chips */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)' }}>
            내 부서 선택:
          </span>
          <span style={{ fontSize: '10.5px', color: 'var(--primary)', fontWeight: 800 }}>
            현재 [{brigadeDept}] 선택됨
          </span>
        </div>

        <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
          {Object.keys(fireBrigadeData.deptLookup).map((dName) => {
            const isSelected = brigadeDept === dName;
            return (
              <button
                key={dName}
                onClick={() => setBrigadeDept(dName)}
                style={{
                  padding: '5px 11px',
                  borderRadius: '16px',
                  fontSize: '11.5px',
                  fontWeight: isSelected ? 900 : 600,
                  background: isSelected ? '#e11d48' : 'var(--surface-raised)',
                  color: isSelected ? '#fff' : 'var(--text-main)',
                  border: '1px solid',
                  borderColor: isSelected ? '#e11d48' : 'var(--border)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {dName}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. My Department Spotlight Card (CORE FOCUS) */}
      <div
        style={{
          background: 'var(--surface)',
          border: `2px solid ${matchingTeam.color}`,
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>
              나의 소속 부서: <strong>{brigadeDept}</strong>
            </span>
            <div style={{ fontSize: '16px', fontWeight: 900, color: matchingTeam.color, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
              <span>주간 소속: 【{activeBrigadeInfo.teamName}】</span>
              <span style={{ fontSize: '10.5px', fontWeight: 700, background: matchingTeam.bg, color: matchingTeam.color, padding: '1px 6px', borderRadius: '4px' }}>
                팀장: {matchingTeam.leader}
              </span>
            </div>
          </div>

          <div style={{ fontSize: '10.5px', fontWeight: 800, background: '#fef2f2', color: '#dc2626', padding: '3px 8px', borderRadius: '6px', border: '1px solid #fecaca' }}>
            1초 즉답 마스터
          </div>
        </div>

        {/* Daytime Duty */}
        <div style={{ background: 'var(--surface-raised)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '12px', fontWeight: 900, color: 'var(--text-main)', marginBottom: '3px' }}>
            ☀️ [주간] {brigadeDept} 핵심 임무:
          </div>
          <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.5 }}>
            {activeBrigadeInfo.keyRole}
          </div>
          <ul style={{ margin: '6px 0 0', paddingLeft: '16px', fontSize: '11.5px', color: 'var(--text-sub)', lineHeight: 1.5 }}>
            {matchingTeam.steps.map((step, sIdx) => (
              <li key={sIdx}>{step}</li>
            ))}
          </ul>
        </div>

        {/* Nighttime Duty */}
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#fff', padding: '10px 12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 900, color: '#a5b4fc', marginBottom: '2px' }}>
            🌙 [야간 및 휴일] 소수 인원 비상 전환 시 내 역할:
          </div>
          <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#f8fafc', lineHeight: 1.5 }}>
            {activeBrigadeInfo.nightRole}
          </div>
        </div>
      </div>

      {/* 4. Progressive Disclosure: 원내 소방시설 & 피난 핵심수칙 (Collapsible) */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <button
          onClick={() => setShowFacilities((prev) => !prev)}
          style={{
            width: '100%',
            padding: '11px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface)',
            cursor: 'pointer',
            border: 'none',
            fontSize: '12.5px',
            fontWeight: 800,
            color: 'var(--text-main)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={15} color="var(--primary)" />
            <span>🏥 원내 소방시설 & 대피공간 핵심 위치 (공기호흡기, 산소밸브 등)</span>
          </div>
          {showFacilities ? <ChevronUp size={15} color="var(--text-muted)" /> : <ChevronDown size={15} color="var(--text-muted)" />}
        </button>

        {showFacilities && (
          <div style={{ padding: '0 14px 14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px', fontSize: '11.5px' }}>
            <div style={{ background: 'var(--surface-raised)', padding: '9px 11px', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <strong style={{ color: 'var(--primary)' }}>• 인명구조기구:</strong>
              <div style={{ color: 'var(--text-sub)', marginTop: '2px' }}>{fireBrigadeData.buildingSafetyFacilities.lifesavingGear}</div>
            </div>
            <div style={{ background: 'var(--surface-raised)', padding: '9px 11px', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <strong style={{ color: '#dc2626' }}>• 병동 산소차단밸브(Oxygen):</strong>
              <div style={{ color: 'var(--text-sub)', marginTop: '2px' }}>{fireBrigadeData.buildingSafetyFacilities.oxygenValve}</div>
            </div>
            <div style={{ background: 'var(--surface-raised)', padding: '9px 11px', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <strong style={{ color: '#d97706' }}>• 층별 대피공간(휴게공간):</strong>
              <div style={{ color: 'var(--text-sub)', marginTop: '2px' }}>{fireBrigadeData.buildingSafetyFacilities.tempRefuge}</div>
            </div>
            <div style={{ background: 'var(--surface-raised)', padding: '9px 11px', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <strong style={{ color: '#2563eb' }}>• 9층 옥상 비상문 관리:</strong>
              <div style={{ color: 'var(--text-sub)', marginTop: '2px' }}>{fireBrigadeData.buildingSafetyFacilities.rooftopDoor}</div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Progressive Disclosure: 자위소방대 전체 5개 팀 편성표 (Collapsible) */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <button
          onClick={() => setShowAllTeams((prev) => !prev)}
          style={{
            width: '100%',
            padding: '11px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface)',
            cursor: 'pointer',
            border: 'none',
            fontSize: '12.5px',
            fontWeight: 800,
            color: 'var(--text-main)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={15} color="var(--primary)" />
            <span>📋 자위소방대 5개 팀 전체 편성표 (규정 10.6 부록 3)</span>
          </div>
          {showAllTeams ? <ChevronUp size={15} color="var(--text-muted)" /> : <ChevronDown size={15} color="var(--text-muted)" />}
        </button>

        {showAllTeams && (
          <div style={{ padding: '0 14px 14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px' }}>
            {fireBrigadeData.teams.map((t) => (
              <div
                key={t.id}
                style={{
                  background: 'var(--surface-raised)',
                  border: `1.5px solid ${t.id === activeBrigadeInfo.teamId ? t.color : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '12.5px', color: t.color, fontWeight: 900 }}>
                    {t.name}
                  </strong>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
                    팀장: {t.leader}
                  </span>
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-sub)' }}>
                  <strong>구성:</strong> {t.departments.join(', ')}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-main)', background: t.bg, padding: '5px 7px', borderRadius: '4px', fontWeight: 700, marginTop: '2px' }}>
                  {t.actionSummary}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Link to Full Regulation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
        <button
          onClick={() => onOpenRule && onOpenRule('10.6')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: 800,
            color: 'var(--primary)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <span>규정 10.6 화재안전 관리활동 전문 열람</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
