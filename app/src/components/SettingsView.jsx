import React, { useState } from 'react';
import {
  Settings, RefreshCw, Smartphone, ShieldCheck, Check,
  ExternalLink, Building2, HelpCircle
} from 'lucide-react';

export default function SettingsView({
  selectedDept,
  onSelectDept,
  onSyncSheets,
  syncStatus
}) {
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const departments = ['간호부', '진료부', '원무과', '영양팀', '시설팀', '약제과'];

  const triggerSync = async () => {
    setSyncing(true);
    setSyncSuccess(false);
    await onSyncSheets();
    setTimeout(() => {
      setSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 2500);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Department Selection (간편 부서 선택) */}
      <div className="calc-card">
        <div className="calc-title">
          <Building2 size={18} color="var(--primary)" /> 내 소속 부서 설정
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 12 }}>
          소속 부서를 선택하면 홈 화면과 규정집에서 해당 부서 규정이 우선 정렬됩니다.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {departments.map((d) => (
            <button
              key={d}
              onClick={() => onSelectDept(d)}
              style={{
                padding: '12px 8px',
                borderRadius: '8px',
                border: '1.5px solid',
                borderColor: selectedDept === d ? 'var(--primary)' : 'var(--border)',
                background: selectedDept === d ? 'var(--primary-light)' : 'var(--surface-raised)',
                color: selectedDept === d ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: selectedDept === d ? 800 : 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4
              }}
            >
              {selectedDept === d && <Check size={14} />}
              <span>{d}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Google Sheets Live Auto-Sync */}
      <div className="calc-card">
        <div className="calc-title">
          <RefreshCw size={18} color="var(--primary)" /> 구글 스프레드시트 실시간 연동
        </div>

        <div style={{ background: 'var(--surface-raised)', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: 'var(--text-muted)' }}>연동 방식:</span>
            <span style={{ color: 'var(--success)', fontWeight: 800 }}>● 앱 실행 시 자동 최신화</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: 'var(--text-muted)' }}>스프레드시트:</span>
            <a
              href="https://docs.google.com/spreadsheets/d/1kHG6C2qzSdWtrJXv-yHrC5rSUyUq4199MS_KL0m4CGE/edit"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}
            >
              구글 시트 열기 <ExternalLink size={12} />
            </a>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            마지막 동기화: {syncStatus?.time || '최신 유지 중'}
          </div>
        </div>

        <button
          onClick={triggerSync}
          disabled={syncing}
          style={{
            marginTop: 12,
            width: '100%',
            padding: '11px',
            borderRadius: '8px',
            border: 'none',
            background: syncSuccess ? 'var(--success)' : 'var(--primary)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'background 0.2s ease'
          }}
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? '최신 데이터 동기화 중...' : syncSuccess ? '동기화 완료!' : '지금 즉시 최신 데이터 다시 가져오기'}</span>
        </button>
      </div>

      {/* 3. System Info Card */}
      <div className="calc-card">
        <div className="calc-title">
          <ShieldCheck size={18} color="var(--primary)" /> 규정집 기준 정보
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          <div>• <strong>의료기관:</strong> 네이처 요양병원 (223병상)</div>
          <div>• <strong>적용 기준:</strong> 보건복지부 요양병원 4주기 인증기준 (Ver 4.1)</div>
          <div>• <strong>원내 원문:</strong> 병원 최신 개정 한글(HWP) 규정집 58개 전문 100% 탑재</div>
          <div>• <strong>평가 일정:</strong> 2026년 11월 25일 ~ 27일</div>
        </div>
      </div>
    </div>
  );
}
