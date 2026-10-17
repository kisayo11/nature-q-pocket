import React from 'react';
import {
  Award, Sun, Moon, Type, Eye, ShieldAlert,
  CheckCircle2, RefreshCw
} from 'lucide-react';

export default function Header({
  fontScale,
  setFontScale,
  theme,
  setTheme,
  inspectMode,
  setInspectMode,
  userProfile,
  onOpenEmergency,
  syncStatus
}) {
  const dDay = Math.ceil((new Date('2026-11-25') - new Date()) / (1000 * 60 * 60 * 24));

  const cycleFontScale = () => {
    if (fontScale === 1) setFontScale(1.15);
    else if (fontScale === 1.15) setFontScale(1.3);
    else setFontScale(1);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="top-header">
      <div className="top-bar-row">
        {/* Hospital Brand Title */}
        <div className="brand-badge">
          <div className="brand-logo-icon">
            <Award size={18} />
          </div>
          <div className="brand-text-col">
            <span className="brand-title">네이처 요양병원</span>
            <span className="brand-subtitle">4주기 인증 규정집</span>
          </div>
        </div>

        {/* D-Day Pill (인증평가 D-39) */}
        <div className="dday-pill">
          <span>평가 D-{dDay > 0 ? dDay : 'DAY'}</span>
        </div>

        {/* Action Controls */}
        <div className="header-controls">
          {/* Emergency Fast Call */}
          <button
            className="icon-btn emergency-quick-trigger"
            onClick={() => onOpenEmergency('fire')}
            title="화재/비상 대응 바로가기"
          >
            <ShieldAlert size={15} />
            <span className="emer-label">비상</span>
          </button>

          {/* Font Scaling */}
          <button
            className="icon-btn"
            onClick={cycleFontScale}
            title="글자 크기 변경"
          >
            <Type size={14} />
            <span className="btn-label">
              {fontScale === 1 ? '보통' : fontScale === 1.15 ? '크게' : '아주크게'}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            className="icon-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? '다크 모드' : '라이트 모드'}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* Inspect Mode Toggle (조사위원 대응 모드) */}
          <button
            className={`icon-btn ${inspectMode ? 'active' : ''}`}
            onClick={() => setInspectMode(!inspectMode)}
            title="조사위원 현장 조사 대응 모드"
          >
            <Eye size={15} />
            <span className="btn-label">조사위원</span>
          </button>
        </div>
      </div>

      {/* Subtle Live Sync Notice Bar */}
      {syncStatus?.synced && (
        <div className="sync-status-indicator">
          <span className="sync-live-dot" />
          <span>구글 스프레드시트 실시간 연동 완료</span>
        </div>
      )}
    </header>
  );
}
