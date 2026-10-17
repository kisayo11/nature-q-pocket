import React, { useState } from 'react';
import {
  Settings, RefreshCw, ShieldCheck, Check,
  ExternalLink, Building2, Sun, Moon, Type, Eye
} from 'lucide-react';

export default function SettingsView({
  selectedDept,
  onSelectDept,
  onSyncSheets,
  syncStatus,
  theme = 'light',
  setTheme = () => {},
  fontScale = 1,
  setFontScale = () => {},
  inspectMode = false,
  setInspectMode = () => {}
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
      {/* 1. Department Selection (소속 부서 선택) */}
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

      {/* 2. Display & View Options (화면 및 뷰 설정) */}
      <div className="calc-card">
        <div className="calc-title">
          <Settings size={18} color="var(--primary)" /> 화면 및 뷰 설정
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
          {/* Theme Option */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>화면 테마</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => setTheme('light')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: theme === 'light' ? 'var(--primary)' : 'var(--border)',
                  background: theme === 'light' ? 'var(--primary-light)' : 'var(--surface-raised)',
                  color: theme === 'light' ? 'var(--primary)' : 'var(--text-sub)',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer'
                }}
              >
                <Sun size={13} /> 라이트
              </button>
              <button
                onClick={() => setTheme('dark')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: theme === 'dark' ? 'var(--primary)' : 'var(--border)',
                  background: theme === 'dark' ? 'var(--primary-light)' : 'var(--surface-raised)',
                  color: theme === 'dark' ? 'var(--primary)' : 'var(--text-sub)',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer'
                }}
              >
                <Moon size={13} /> 다크
              </button>
            </div>
          </div>

          {/* Font Scale Option */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>글자 크기</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { label: '보통', scale: 1 },
                { label: '크게', scale: 1.15 },
                { label: '아주크게', scale: 1.3 }
              ].map((item) => (
                <button
                  key={item.scale}
                  onClick={() => setFontScale(item.scale)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: fontScale === item.scale ? 'var(--primary)' : 'var(--border)',
                    background: fontScale === item.scale ? 'var(--primary-light)' : 'var(--surface-raised)',
                    color: fontScale === item.scale ? 'var(--primary)' : 'var(--text-sub)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inspector Mode Option */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>조사위원 대응 모드</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>수검 중 모의퀴즈 탭을 숨기고 정식 규정만 표출합니다.</div>
            </div>
            <button
              onClick={() => setInspectMode(!inspectMode)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: inspectMode ? 'var(--primary)' : 'var(--border)',
                background: inspectMode ? 'var(--primary)' : 'var(--surface-raised)',
                color: inspectMode ? '#fff' : 'var(--text-sub)',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {inspectMode ? '켜짐' : '꺼짐'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Google Sheets Live Auto-Sync */}
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

      {/* 4. System Info Card */}
      <div className="calc-card">
        <div className="calc-title">
          <ShieldCheck size={18} color="var(--primary)" /> 규정집 기준 정보
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          <div>• <strong>의료기관:</strong> 네이처 요양병원 (223병상)</div>
          <div>• <strong>적용 기준:</strong> 보건복지부 요양병원 4주기 인증기준 (Ver 4.1)</div>
          <div>• <strong>원내 원문:</strong> 병원 최신 개정 한글(HWP) 및 결재본 PDF 58개 전문 100% 탑재</div>
          <div>• <strong>평가 일정:</strong> 2026년 11월 25일 ~ 27일</div>
        </div>
      </div>
    </div>
  );
}
