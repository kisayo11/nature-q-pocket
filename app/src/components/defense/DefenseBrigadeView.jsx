import React, { useState } from 'react';
import {
  Flame, Users, Bell, PhoneCall, ShieldAlert, ArrowRight,
  CheckCircle2, AlertTriangle, ShieldCheck, HeartPulse
} from 'lucide-react';
import fireBrigadeData from '../../data/fireBrigadeData.json';

export default function DefenseBrigadeView({ selectedDept = '간호부', onOpenRule }) {
  const [brigadeDept, setBrigadeDept] = useState(selectedDept || '간호부');

  const activeBrigadeInfo = fireBrigadeData.deptLookup[brigadeDept] || fireBrigadeData.deptLookup['간호부'];
  const matchingTeam = fireBrigadeData.teams.find((t) => t.id === activeBrigadeInfo.teamId) || fireBrigadeData.teams[2];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 1. Top Emergency Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
          border: '1.5px solid #fecdd3',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🚨</span>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#9f1239', margin: 0 }}>
                네이처요양병원 자위소방대 비상대응체계 (규정 10.6 부록 3)
              </h2>
              <p style={{ fontSize: '11.5px', color: '#be123c', margin: '3px 0 0', fontWeight: 600 }}>
                비상방송 멘트: 내선 900번(원무과)에 <strong>"코드레드(Code Red) O병동 O호실 2회"</strong> 즉시 요청!
              </p>
            </div>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#9f1239', background: '#fff', padding: '5px 12px', borderRadius: '16px', border: '1px solid #fda4af' }}>
            대장: 병원장 | 부대장(소방관리자): 시설팀장 | 보조자: 원무과장
          </div>
        </div>

        {/* Essential Rule Bar */}
        <div style={{ background: '#fff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #fecdd3', fontSize: '11.5px', color: '#881337', fontWeight: 700 }}>
          ⚡ <strong>임무자 필수 수칙(부록 3 ◈①):</strong> 통보연락 임무자는 비상방송 및 119 신고 후 즉시 방화문을 폐쇄하고 피난유도팀에 합류할 것!
        </div>
      </div>

      {/* 2. Department Selector for Instant Brigade Lookup */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} color="var(--primary)" />
            <span>나의 소속 부서를 선택하세요</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>부서 클릭 시 내 역할 즉시 표시</span>
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {Object.keys(fireBrigadeData.deptLookup).map((dName) => {
            const isSelected = brigadeDept === dName;
            return (
              <button
                key={dName}
                onClick={() => setBrigadeDept(dName)}
                style={{
                  padding: '7px 13px',
                  borderRadius: '18px',
                  fontSize: '12px',
                  fontWeight: isSelected ? 900 : 600,
                  background: isSelected ? '#e11d48' : 'var(--surface-raised)',
                  color: isSelected ? '#fff' : 'var(--text-main)',
                  border: '1px solid',
                  borderColor: isSelected ? '#e11d48' : 'var(--border)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? 'var(--shadow-xs)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {dName}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Active Department Spotlight Card */}
      <div
        style={{
          background: 'var(--surface)',
          border: `2px solid ${matchingTeam.color}`,
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>
              선택 부서: <strong>{brigadeDept}</strong>
            </span>
            <div style={{ fontSize: '17px', fontWeight: 900, color: matchingTeam.color, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span>주간 소속: 【{activeBrigadeInfo.teamName}】</span>
              <span style={{ fontSize: '11px', fontWeight: 700, background: matchingTeam.bg, color: matchingTeam.color, padding: '2px 8px', borderRadius: '4px' }}>
                팀장: {matchingTeam.leader}
              </span>
            </div>
          </div>

          <div style={{
            fontSize: '11.5px',
            fontWeight: 800,
            background: '#fef2f2',
            color: '#dc2626',
            padding: '4px 10px',
            borderRadius: '8px',
            border: '1px solid #fecaca'
          }}>
            1초 즉답 가능
          </div>
        </div>

        {/* Daytime Key Duties */}
        <div style={{ background: 'var(--surface-raised)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>
            ☀️ [주간] {brigadeDept} 직원이 즉각 수행해야 할 임무:
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.5 }}>
            {activeBrigadeInfo.keyRole}
          </div>
          <ul style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '12px', color: 'var(--text-sub)', lineHeight: 1.6 }}>
            {matchingTeam.steps.map((step, sIdx) => (
              <li key={sIdx}>{step}</li>
            ))}
          </ul>
        </div>

        {/* Nighttime Transition Duties */}
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#fff', padding: '12px 14px', borderRadius: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 900, color: '#a5b4fc', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🌙 [야간 및 휴일] 소수 인원 비상 전환 시 나의 역할:</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc', lineHeight: 1.5 }}>
            {activeBrigadeInfo.nightRole}
          </div>
        </div>
      </div>

      {/* 4. Building Safety & Evacuation Facilities Box */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            🏥 네이처요양병원 소방시설 및 피난 핵심 수칙 (규정 10.6 본문 5조)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px', fontSize: '12px' }}>
          <div style={{ background: 'var(--surface-raised)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <strong style={{ color: 'var(--primary)' }}>• 인명구조기구 위치:</strong>
            <div style={{ color: 'var(--text-sub)', marginTop: '2px' }}>{fireBrigadeData.buildingSafetyFacilities.lifesavingGear}</div>
          </div>
          <div style={{ background: 'var(--surface-raised)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <strong style={{ color: '#dc2626' }}>• 병동 산소차단밸브(Oxygen):</strong>
            <div style={{ color: 'var(--text-sub)', marginTop: '2px' }}>{fireBrigadeData.buildingSafetyFacilities.oxygenValve}</div>
          </div>
          <div style={{ background: 'var(--surface-raised)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <strong style={{ color: '#d97706' }}>• 층별 대피공간(휴게공간):</strong>
            <div style={{ color: 'var(--text-sub)', marginTop: '2px' }}>{fireBrigadeData.buildingSafetyFacilities.tempRefuge}</div>
          </div>
          <div style={{ background: 'var(--surface-raised)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <strong style={{ color: '#2563eb' }}>• 9층 옥상 비상문 관리:</strong>
            <div style={{ color: 'var(--text-sub)', marginTop: '2px' }}>{fireBrigadeData.buildingSafetyFacilities.rooftopDoor}</div>
          </div>
        </div>
      </div>

      {/* 5. All 5 Teams Overview Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 0' }}>
          📋 자위소방대 5개 팀 전체 편성표 (규정 10.6 부록 3)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
          {fireBrigadeData.teams.map((t) => (
            <div
              key={t.id}
              style={{
                background: 'var(--surface)',
                border: `1.5px solid ${t.id === activeBrigadeInfo.teamId ? t.color : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '13.5px', color: t.color, fontWeight: 900 }}>
                  {t.name}
                </strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
                  팀장: {t.leader}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-sub)', fontWeight: 600 }}>
                <strong>구성 부서:</strong> {t.departments.join(', ')}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-main)', background: t.bg, padding: '6px 8px', borderRadius: '6px', fontWeight: 700, marginTop: '2px' }}>
                {t.actionSummary}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Nightshift 2-Pillar System Special Card */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🌙</span>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
              {fireBrigadeData.nightShift.title}
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 800 }}>
              지휘: {fireBrigadeData.nightShift.commander}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
          {fireBrigadeData.nightShift.groups.map((grp, gIdx) => (
            <div key={gIdx} style={{ background: 'var(--surface-raised)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--primary)', marginBottom: '3px' }}>
                {grp.name}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                담당: {grp.members}
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11.5px', color: 'var(--text-main)', lineHeight: 1.6 }}>
                {grp.tasks.map((task, tIdx) => (
                  <li key={tIdx}>{task}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Link to 10.6 full regulation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => onOpenRule && onOpenRule('10.6')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11.5px',
            fontWeight: 800,
            color: 'var(--primary)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <span>규정 10.6 화재안전 관리활동 전문 열람</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
