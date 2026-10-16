import React, { useState } from 'react';
import { Settings, RefreshCw, Smartphone, ShieldCheck, User, LogOut, Check, ExternalLink } from 'lucide-react';

export default function SettingsView({ userProfile, setUserProfile, onSyncSheets }) {
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Login Form
  const [empId, setEmpId] = useState(userProfile?.empId || '');
  const [name, setName] = useState(userProfile?.name || '');
  const [dept, setDept] = useState(userProfile?.dept || '간호부');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const profile = { empId, name, dept, isLoggedIn: true };
    setUserProfile(profile);
    localStorage.setItem('nature_user_profile', JSON.stringify(profile));
  };

  const handleLogout = () => {
    const guest = { empId: '', name: '게스트', dept: '전체', isLoggedIn: false };
    setUserProfile(guest);
    localStorage.setItem('nature_user_profile', JSON.stringify(guest));
    setEmpId('');
    setName('');
  };

  const triggerSync = async () => {
    setSyncing(true);
    setSyncSuccess(false);
    await onSyncSheets();
    setTimeout(() => {
      setSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Google Drive Cloud Sync */}
      <div className="calc-card">
        <div className="calc-title"><RefreshCw size={18} color="var(--primary)" /> 구글 드라이브 마스터DB 연동</div>

        <div style={{ background: 'var(--surface-raised)', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: 'var(--text-muted)' }}>연동 상태:</span>
            <span style={{ color: 'var(--success)', fontWeight: 800 }}>● 실시간 동기화 활성</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: 'var(--text-muted)' }}>스프레드시트:</span>
            <a
              href="https://docs.google.com/spreadsheets/d/1kHG6C2qzSdWtrJXv-yHrC5rSUyUq4199MS_KL0m4CGE/edit"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}
            >
              마스터DB 열기 <ExternalLink size={12} />
            </a>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            시트 ID: 1kHG6C2qzSdWtrJXv-yHrC5rSUyUq4199MS_KL0m4CGE
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
            gap: 6
          }}
        >
          <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
          {syncing ? '구글 시트 데이터 동기화 중...' : syncSuccess ? '최신 규정 동기화 완료!' : '원내 구글 시트 최신본 동기화'}
        </button>
      </div>

      {/* 2. User Account (Dual Mode: Guest vs Staff) */}
      <div className="calc-card">
        <div className="calc-title"><User size={18} color="var(--primary)" /> 직원 모드 / 게스트 전환</div>

        {userProfile?.isLoggedIn ? (
          <div style={{ background: 'var(--primary-light)', padding: '14px', borderRadius: '8px' }}>
            <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--primary)' }}>
              👤 {userProfile.name} 님 ({userProfile.dept})
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 4 }}>
              사번: {userProfile.empId || '미기재'} | 퀴즈 풀이 및 수검 기록 추적 중
            </div>
            <button
              onClick={handleLogout}
              style={{
                marginTop: 12,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <LogOut size={14} /> 게스트 모드로 전환
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 10 }}>
              * 사번과 이름을 등록하시면 일일 퀴즈 정답률과 부서별 랭킹에 점수가 자동 집계됩니다.
            </div>

            <div className="calc-group">
              <label className="calc-label">소속 부서</label>
              <select className="calc-select" value={dept} onChange={(e) => setDept(e.target.value)}>
                <option value="간호부 (3병동)">간호부 (3병동)</option>
                <option value="간호부 (5병동)">간호부 (5병동)</option>
                <option value="간호부 (6병동)">간호부 (6병동)</option>
                <option value="진료부 (의사/한의사)">진료부 (의사/한의사)</option>
                <option value="원무행정팀">원무행정팀</option>
                <option value="영양팀">영양팀</option>
                <option value="시설안전팀">시설안전팀</option>
                <option value="QPS / 감염관리실">QPS / 감염관리실</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div className="calc-group">
                <label className="calc-label">성명</label>
                <input
                  type="text"
                  className="calc-input"
                  placeholder="예: 김간호"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="calc-group">
                <label className="calc-label">사번 (선택)</label>
                <input
                  type="text"
                  className="calc-input"
                  placeholder="예: 202401"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--primary)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              직원 프로필 등록 및 로그인
            </button>
          </form>
        )}
      </div>

      {/* 3. PWA Installation Guide */}
      <div className="calc-card">
        <div className="calc-title"><Smartphone size={18} color="var(--primary)" /> 스마트폰 홈 화면에 앱으로 추가하기</div>
        <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-main)' }}>
          <div><strong>• 아이폰 (iOS Safari):</strong> 하단 공유 버튼(네모에 화살표) ➔ <strong>[홈 화면에 추가]</strong> 클릭</div>
          <div style={{ marginTop: 4 }}><strong>• 갤럭시 (Android Chrome):</strong> 우측 상단 점 3개 ➔ <strong>[홈 화면에 추가]</strong> 또는 [앱 설치] 클릭</div>
        </div>
        <div style={{ marginTop: 10, fontSize: '11px', color: 'var(--text-muted)' }}>
          홈 화면에 추가하시면 일반 앱스토어 앱처럼 전체화면으로 실행되며, 인터넷 연결 없이도 동작합니다.
        </div>
      </div>
    </div>
  );
}
