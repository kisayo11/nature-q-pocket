import React from 'react';
import { Flame, ShieldAlert, Award, Sun, Moon, Type, Eye } from 'lucide-react';

export default function Header({
  fontScale,
  setFontScale,
  theme,
  setTheme,
  inspectMode,
  setInspectMode,
  userProfile,
  onOpenProfile
}) {
  const dDay = Math.ceil((new Date('2026-11-25') - new Date()) / (1000 * 60 * 60 * 24));

  const cycleFontScale = () => {
    if (fontScale === 1) setFontScale(1.18);
    else if (fontScale === 1.18) setFontScale(1.35);
    else setFontScale(1);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="top-header">
      <div className="top-bar-row">
        <div className="brand-badge">
          <Award size={20} color="var(--primary)" />
          <span>네이처 Q-포켓</span>
        </div>

        <div className="dday-pill">
          <Flame size={13} />
          <span>수검 D-{dDay > 0 ? dDay : 'DAY'}</span>
        </div>

        <div className="header-controls">
          {/* Font Scaling */}
          <button
            className="icon-btn"
            onClick={cycleFontScale}
            title="글자 크기 변경"
          >
            <Type size={14} style={{ marginRight: 2 }} />
            {fontScale === 1 ? '보통' : fontScale === 1.18 ? '크게' : '왕'}
          </button>

          {/* Theme Toggle */}
          <button
            className="icon-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? '다크모드' : '라이트모드'}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* Inspect Mode Toggle */}
          <button
            className={`icon-btn ${inspectMode ? 'active' : ''}`}
            onClick={() => setInspectMode(!inspectMode)}
            title="조사위원 수검 모드 토글"
          >
            <Eye size={15} />
            <span style={{ fontSize: '11px', marginLeft: 3 }}>수검</span>
          </button>
        </div>
      </div>
    </header>
  );
}
