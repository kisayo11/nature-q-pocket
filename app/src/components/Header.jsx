import React from 'react';
import { Award, ShieldAlert } from 'lucide-react';

export default function Header({
  onOpenEmergency,
  syncStatus
}) {
  const dDay = Math.ceil((new Date('2026-11-25') - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <header className="top-header-clean">
      <div className="top-bar-clean">
        {/* Hospital Brand Title */}
        <div className="brand-badge-clean">
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

        {/* Right Actions: D-Day & Emergency Call */}
        <div className="header-actions-clean">
          <div className="dday-pill-clean">
            <span>D-{dDay > 0 ? dDay : 'DAY'}</span>
          </div>

          <button
            className="emer-quick-btn"
            onClick={() => onOpenEmergency('fire')}
            title="원내 비상대응 연락망"
          >
            <ShieldAlert size={14} />
            <span>비상</span>
          </button>
        </div>
      </div>
    </header>
  );
}
