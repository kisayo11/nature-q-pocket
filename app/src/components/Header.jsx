import React from 'react';
import {
  Award, ShieldAlert, Settings, Home, BookOpen, Clock, Calculator, HelpCircle, Zap
} from 'lucide-react';

export default function Header({
  onOpenEmergency,
  onOpenSettings,
  syncStatus,
  activeTab,
  onNavigateTab
}) {
  const dDay = Math.ceil((new Date('2026-11-25') - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <header className="top-header-clean">
      <div className="top-bar-clean">
        {/* Hospital Brand Title */}
        <div
          className="brand-badge-clean"
          onClick={() => onNavigateTab && onNavigateTab('home')}
          style={{ cursor: 'pointer' }}
        >
          <div className="brand-logo-icon">
            <Award size={18} color="#fff" />
          </div>
          <div className="brand-text-col">
            <div className="brand-name-row">
              <span className="brand-title">네이처 요양병원</span>
              {syncStatus?.synced && (
                <span className="live-sync-indicator" title="구글 스프레드시트 실시간 연동됨" />
              )}
            </div>
            <span className="brand-subtitle">인증 Q-POCKET</span>
          </div>
        </div>

        {/* Desktop Navigation Bar (Only visible on screens >= 768px) */}
        <nav className="header-desktop-nav">
          <button
            className={`hd-nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => onNavigateTab && onNavigateTab('home')}
          >
            <Home size={15} />
            <span>홈</span>
          </button>
          <button
            className={`hd-nav-link ${activeTab === 'handbook' ? 'active' : ''}`}
            onClick={() => onNavigateTab && onNavigateTab('handbook')}
          >
            <BookOpen size={15} />
            <span>규정집</span>
          </button>
          <button
            className={`hd-nav-link ${activeTab === 'tracer' ? 'active' : ''}`}
            onClick={() => onNavigateTab && onNavigateTab('tracer')}
          >
            <Zap size={15} />
            <span>추적조사</span>
          </button>
          <button
            className={`hd-nav-link ${activeTab === 'golden' ? 'active' : ''}`}
            onClick={() => onNavigateTab && onNavigateTab('golden')}
          >
            <Clock size={15} />
            <span>기준수치</span>
          </button>
          <button
            className={`hd-nav-link ${activeTab === 'calc' ? 'active' : ''}`}
            onClick={() => onNavigateTab && onNavigateTab('calc')}
          >
            <Calculator size={15} />
            <span>계산기</span>
          </button>
          <button
            className={`hd-nav-link ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => onNavigateTab && onNavigateTab('quiz')}
          >
            <HelpCircle size={15} />
            <span>모의퀴즈</span>
          </button>
        </nav>

        {/* Right Actions: D-Day, Emergency Call, Settings */}
        <div className="header-actions-clean">
          <div className="dday-pill-clean">
            <span>D-{dDay > 0 ? dDay : 'DAY'}</span>
          </div>

          <button
            className="emer-quick-btn"
            onClick={() => onOpenEmergency('menu')}
            title="원내 비상대응 연락망 (화재/CPR/유출/보안)"
          >
            <ShieldAlert size={14} />
            <span>비상</span>
          </button>

          <button
            className={`header-settings-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={onOpenSettings}
            title="환경 설정"
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: activeTab === 'settings' ? 'var(--primary-light)' : 'var(--surface-raised)',
              color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
