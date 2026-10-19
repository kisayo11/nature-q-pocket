import React, { useState } from 'react';
import {
  Settings, RefreshCw, ShieldCheck, Check,
  ExternalLink, Building2, Sun, Moon, Type, Eye,
  Trash2, AlertTriangle, MessageSquarePlus, Link
} from 'lucide-react';
import { DEPARTMENTS } from '../utils/deptUtils';
import { DEFAULT_FEEDBACK_WEBHOOK_URL } from './FeedbackModal';

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
  setInspectMode = () => {},
  onResetAllData,
  onOpenFeedback
}) {
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [syncFailed, setSyncFailed] = useState(false);

  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem('nature_feedback_webhook_url') || DEFAULT_FEEDBACK_WEBHOOK_URL;
  });
  const [savedWebhook, setSavedWebhook] = useState(false);

  const handleSaveWebhook = () => {
    localStorage.setItem('nature_feedback_webhook_url', webhookUrl.trim());
    setSavedWebhook(true);
    setTimeout(() => setSavedWebhook(false), 2500);
  };

  const triggerSync = async () => {
    setSyncing(true);
    setSyncSuccess(false);
    setSyncFailed(false);
    const success = await onSyncSheets();
    setTimeout(() => {
      setSyncing(false);
      setSyncSuccess(success);
      setSyncFailed(!success);
      setTimeout(() => {
        setSyncSuccess(false);
        setSyncFailed(false);
      }, 3500);
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {DEPARTMENTS.map((dept) => {
            const isSelected = selectedDept === dept.name;
            return (
              <button
                key={dept.id}
                onClick={() => onSelectDept(dept.name)}
                style={{
                  padding: '11px 10px',
                  borderRadius: '10px',
                  border: '1.5px solid',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                  background: isSelected ? 'var(--primary-light)' : 'var(--surface-raised)',
                  color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{dept.icon}</span>
                  <span>{dept.name}</span>
                </div>
                {isSelected && <Check size={14} color="var(--primary)" />}
              </button>
            );
          })}
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
          {syncStatus?.error && (
            <div style={{ marginTop: 6, fontSize: '11px', color: 'var(--danger)', lineHeight: 1.4 }}>
              동기화 오류: {syncStatus.error}
            </div>
          )}
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
            background: syncFailed ? 'var(--danger)' : syncSuccess ? 'var(--success)' : 'var(--primary)',
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
          <span>{syncing ? '최신 데이터 동기화 중...' : syncFailed ? '동기화 실패 · 다시 시도' : syncSuccess ? '동기화 완료!' : '지금 즉시 최신 데이터 다시 가져오기'}</span>
        </button>
      </div>

      {/* 4. Feedback & Error Report Settings Card */}
      <div className="calc-card" style={{ borderColor: '#fecaca' }}>
        <div className="calc-title" style={{ color: '#dc2626' }}>
          <MessageSquarePlus size={18} color="#dc2626" /> 원내 오류 신고 및 수정 제보
        </div>
        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
          실제 부서 실무와 상이하거나 오탈자, 잘못된 지침이 있다면 즉시 제보해 주세요. 구글 스프레드시트에 실시간으로 기록됩니다.
        </p>

        <button
          onClick={() => onOpenFeedback && onOpenFeedback('설정 메뉴에서 일반 제보')}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: '8px',
            border: 'none',
            background: '#dc2626',
            color: '#fff',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginBottom: 12
          }}
        >
          <MessageSquarePlus size={15} />
          <span>오류 신고 및 수정 제보 창 열기</span>
        </button>

        {/* Admin Apps Script Webhook URL setting */}
        <div style={{ background: 'var(--surface-raised)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
            <Link size={13} color="var(--primary)" />
            <span>[관리자용] Google Apps Script 웹 앱 연동 URL</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 8 }}>
            Apps Script 배포 후 발급받은 URL을 등록하면 실시간 스프레드시트 저장이 활성화됩니다.
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSaveWebhook}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: 'none',
                background: savedWebhook ? 'var(--success)' : 'var(--primary)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {savedWebhook ? '저장됨!' : '저장'}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Reset Learning Data Card */}
      <div className="calc-card" style={{ borderColor: 'var(--danger-light)' }}>
        <div className="calc-title" style={{ color: 'var(--danger)' }}>
          <Trash2 size={18} color="var(--danger)" /> 학습 및 체크 기록 초기화
        </div>
        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
          기기(브라우저)에 저장된 <strong>규정 북마크, 8대 필수 숙지 체크, 골든넘버 암기 체크, 오답노트, 실천 점검 수칙</strong>을 초기 상태로 깨끗하게 비웁니다.
        </p>

        <button
          onClick={() => {
            if (window.confirm('정말로 모든 학습 체크, 북마크, 오답노트 기록을 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
              onResetAllData && onResetAllData();
            }
          }}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: '8px',
            border: '1px solid var(--danger)',
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}
        >
          <Trash2 size={14} />
          <span>모든 학습 및 체크 기록 초기화</span>
        </button>
      </div>

      {/* 5. System Info Card */}
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
