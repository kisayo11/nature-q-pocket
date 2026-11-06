import React from 'react';
import {
  Award, ShieldAlert, Settings, Home, BookOpen, Clock, ShieldCheck, HelpCircle, MessageSquarePlus, Activity
} from 'lucide-react';

export default function Header({
  onOpenEmergency,
  onOpenSettings,
  onOpenFeedback,
  syncStatus,
  activeTab,
  onNavigateTab
}) {
  const dDay = Math.ceil((new Date('2026-11-25') - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <header className="top-header-clean">
      <div className="top-bar-clean">
        {/* Hospital Brand & Accreditation Console Insignia */}
        <div
          className="brand-badge-clean"
          onClick={() => onNavigateTab && onNavigateTab('home')}
          role="button"
          tabIndex={0}
          aria-label="네이처 요양병원 홈으로 이동"
        >
          <div className="brand-logo-icon">
            <Award size={18} />
          </div>
          <div className="brand-text-col">
            <div className="brand-name-row">
              <span className="brand-title">네이처 요양병원</span>
              {syncStatus?.synced && (
                <span className="live-sync-indicator" title="구글 스프레드시트 실시간 연동 완료" />
              )}
            </div>
            <span className="brand-subtitle mono-num">Q-POCKET · 4TH ACCREDITATION</span>
          </div>
        </div>

        {/* Desktop Navigation GNB (Screens >= 768px) */}
        <nav className="header-desktop-nav" aria-label="메인 네비게이션">
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
            className={`hd-nav-link ${activeTab === 'inspection' || activeTab === 'tracer' ? 'active' : ''}`}
            onClick={() => onNavigateTab && onNavigateTab('inspection')}
          >
            <ShieldCheck size={15} />
            <span>조사대응</span>
          </button>
          <button
            className={`hd-nav-link ${activeTab === 'golden' || activeTab === 'calc' ? 'active' : ''}`}
            onClick={() => onNavigateTab && onNavigateTab('golden')}
          >
            <Clock size={15} />
            <span>기준수치</span>
          </button>
          <button
            className={`hd-nav-link ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => onNavigateTab && onNavigateTab('quiz')}
          >
            <HelpCircle size={15} />
            <span>모의퀴즈</span>
          </button>
        </nav>

        {/* Right Actions: D-Day LED Counter, Report Bug, Emergency Switch, Settings */}
        <div className="header-actions-clean">
          <div className="dday-pill-clean" title="2026년 11월 25일 의료기관 4주기 본인증평가 D-Day">
            <span className="mono-num">D-{dDay > 0 ? dDay : 'DAY'}</span>
          </div>

          <button
            className="report-quick-btn"
            onClick={onOpenFeedback}
            title="오류 신고 및 규정 수정 제보"
            aria-label="규정 수정 및 오류 제보하기"
          >
            <MessageSquarePlus size={13} />
            <span>제보</span>
          </button>

          <button
            className="emer-quick-btn"
            onClick={() => onOpenEmergency('menu')}
            title="원내 비상대응 연락망 (화재/CPR/유출/보안)"
            aria-label="원내 비상대응 긴급 연락망 열기"
          >
            <ShieldAlert size={14} />
            <span>비상</span>
          </button>

          <button
            className={`header-settings-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={onOpenSettings}
            title="환경 설정"
            aria-label="앱 환경설정 열기"
          >
            <Settings size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
