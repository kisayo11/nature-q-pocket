import React, { useState, useEffect } from 'react';
import { Flame, HeartPulse, Droplets, ShieldAlert, X, PhoneCall, AlertTriangle, Clock } from 'lucide-react';

export default function EmergencyModal({ type, onClose }) {
  const [currentType, setCurrentType] = useState(() => (type === 'menu' ? 'fire' : type));

  useEffect(() => {
    if (type && type !== 'menu') {
      setCurrentType(type);
    }
  }, [type]);

  // Timer for AED 3-minute golden time
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((sec) => sec - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!type) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header */}
        <div className="modal-header">
          <div className="modal-title">
            {currentType === 'fire' && <><Flame color="var(--danger)" /> 화재 비상 대응 (코드 레드)</>}
            {currentType === 'cpr' && <><HeartPulse color="hsl(30, 95%, 45%)" /> 심폐소생술 & 제세동기 (코드 블루)</>}
            {currentType === 'spill' && <><Droplets color="hsl(270, 70%, 50%)" /> Spill Kit (혈액·화학물질 유출)</>}
            {currentType === 'security' && <><ShieldAlert color="var(--secondary)" /> 원내 보안 비상 (폭력·도난·이탈)</>}
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* 4-Way Quick Emergency Category Switcher Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 14 }}>
          {[
            { id: 'fire', label: '화재(900)', icon: Flame, color: 'var(--danger)' },
            { id: 'cpr', label: 'CPR(900)', icon: HeartPulse, color: 'hsl(30, 95%, 45%)' },
            { id: 'spill', label: '유출(스필)', icon: Droplets, color: 'hsl(270, 70%, 50%)' },
            { id: 'security', label: '보안(901)', icon: ShieldAlert, color: 'var(--secondary)' }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentType === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentType(item.id)}
                style={{
                  padding: '8px 2px',
                  borderRadius: '8px',
                  border: '1.5px solid',
                  borderColor: isActive ? item.color : 'var(--border)',
                  background: isActive ? 'var(--surface-raised)' : 'var(--surface)',
                  color: isActive ? item.color : 'var(--text-muted)',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} color={isActive ? item.color : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. Fire Emergency Content */}
        {currentType === 'fire' && (
          <div>
            <div className="quick-answer-banner" style={{ background: 'var(--danger-light)', borderColor: 'var(--danger)' }}>
              <div style={{ color: 'var(--danger)', fontWeight: 800, marginBottom: 4 }}>🚨 화재 발견 시 즉시 통보 번호</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '18px', fontWeight: 900 }}>원무과 상황실: 내선 900번</span>
                <a href="tel:900" style={{ background: 'var(--danger)', color: '#fff', padding: '6px 12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <PhoneCall size={14} /> 즉시 통보
                </a>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div className="detail-subheading">인원별 초기 행동 요령</div>
              <div style={{ background: 'var(--surface-raised)', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', lineHeight: 1.6 }}>
                <div><strong>• 1인 근무:</strong> 최초 발견자가 "00호실 불났어요!" 구두 전파 ➔ 내선 900 통보 및 발신기 누름 ➔ 소화기 초기진화</div>
                <div><strong>• 2인 근무:</strong> 1명(선임간호사: 통보 및 방송의뢰) ➔ 1명(보조간호인력: 소화기 진화 및 피난 유도)</div>
                <div><strong>• 3인 이상:</strong> 1명(통보/방송의뢰) ➔ 1명(피난 유도 및 방화문 폐쇄) ➔ 1명(소화기/소화전 초기진화)</div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div className="detail-subheading">환자 유형별 대피 우선순위 (C ➔ B ➔ A)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 6, textAlign: 'center' }}>
                <div style={{ background: 'var(--primary-light)', padding: '10px 6px', borderRadius: '8px', border: '1px solid var(--primary)' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '14px' }}>1순위: C급</div>
                  <div style={{ fontSize: '11px', marginTop: 2 }}>독립보행 환자<br />계단 이용 대피</div>
                </div>
                <div style={{ background: 'var(--warning-light)', padding: '10px 6px', borderRadius: '8px', border: '1px solid var(--warning)' }}>
                  <div style={{ color: 'var(--warning)', fontWeight: 900, fontSize: '14px' }}>2순위: B급</div>
                  <div style={{ fontSize: '11px', marginTop: 2 }}>부축 보행 환자<br />직원 부축 대피</div>
                </div>
                <div style={{ background: 'var(--danger-light)', padding: '10px 6px', borderRadius: '8px', border: '1px solid var(--danger)' }}>
                  <div style={{ color: 'var(--danger)', fontWeight: 900, fontSize: '14px' }}>3순위: A급</div>
                  <div style={{ fontSize: '11px', marginTop: 2 }}>침상안정/휠체어<br />수평이동 후 대피</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, background: 'var(--surface-raised)', padding: '10px 12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800 }}>📍 최종 옥외 집결지: <span style={{ color: 'var(--danger)' }}>병원 앞 공터</span></div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>대피 시 승강기(엘리베이터) 탑승 절대 금지! 방화문 닫으며 계단 이동.</div>
            </div>
          </div>
        )}

        {/* 2. CPR & AED Content */}
        {currentType === 'cpr' && (
          <div>
            <div className="quick-answer-banner" style={{ background: 'hsl(45, 100%, 94%)', borderColor: 'hsl(40, 95%, 50%)' }}>
              <div style={{ color: 'hsl(30, 95%, 40%)', fontWeight: 800, marginBottom: 4 }}>⚡ CPR 비상방송 요청</div>
              <div style={{ fontSize: '15px', fontWeight: 800, lineHeight: 1.5 }}>
                내선 <strong>900번</strong> 통보 ➔ <strong>"CPR + 발생장소"</strong> 순서로 2회 원내 방송 요청
              </div>
            </div>

            {/* Golden Time 3-4min Countdown Timer */}
            <div className="countdown-box">
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Clock size={14} /> 조사위원 실사 항목 (3.2.1 ME.4) 제세동기 3~4분 타임어택
              </div>
              <div className="countdown-digits">{formatTimer(secondsLeft)}</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 6 }}>
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  style={{ background: timerRunning ? 'var(--text-muted)' : 'var(--danger)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                >
                  {timerRunning ? '일시정지' : '3분 타이머 시작'}
                </button>
                <button
                  onClick={() => { setSecondsLeft(180); setTimerRunning(false); }}
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
                  리셋
                </button>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="detail-subheading">원내 제세동기(AED) 보관 위치</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: 'var(--surface-raised)', padding: '10px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ fontWeight: 800, fontSize: '13px' }}>1층 ~ 4층 관할</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--primary)', marginTop: 2 }}>3병동 간호스테이션 앞</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>내선: 300번</div>
                </div>
                <div style={{ background: 'var(--surface-raised)', padding: '10px', borderRadius: '8px', borderLeft: '4px solid var(--secondary)' }}>
                  <div style={{ fontWeight: 800, fontSize: '13px' }}>5층 ~ 8층 관할</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--secondary)', marginTop: 2 }}>6병동 간호스테이션 앞</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>내선: 600번</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: '12px', background: 'var(--surface-raised)', padding: '10px', borderRadius: '8px' }}>
              <strong>가슴압박:</strong> 분당 100~120회, 깊이 5cm, 압박:인공호흡 = 30:2 (Ambu-bag 사용)
            </div>
          </div>
        )}

        {/* 3. Spill Kit Content */}
        {currentType === 'spill' && (
          <div>
            <div className="quick-answer-banner" style={{ background: 'hsl(270, 70%, 95%)', borderColor: 'hsl(270, 60%, 60%)' }}>
              <div style={{ color: 'hsl(270, 60%, 45%)', fontWeight: 800, marginBottom: 4 }}>🧪 혈액 및 체액 Spill Kit 처리 5단계</div>
              <div style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.5 }}>
                1. Spill Kit 비치 장소에서 가져오기 ➔ 2. 보호구(장갑, 마스크, 가운) 착용 ➔ 3. 종이타월 덮고 <strong>5,000 ppm 락스</strong> 붓기 ➔ 4. 주황색 의료폐기물 봉투 밀봉 폐기 ➔ 5. 손위생
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="detail-subheading">소독액 희석 비율 (조사위원 단골 질문!)</div>
              <div style={{ background: 'var(--surface-raised)', padding: '10px 12px', borderRadius: '8px', fontSize: '13px' }}>
                <div style={{ marginBottom: 6 }}>
                  <strong>• 혈액·체액 유출 (Spill Kit):</strong><br />
                  <span style={{ color: 'var(--danger)', fontWeight: 800 }}>물 900ml + 락스 100ml = 5,000 ppm (1:10 희석, 당일 사용)</span>
                </div>
                <div>
                  <strong>• 일상 환경·바닥 소독:</strong><br />
                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>물 1L + 락스 10ml = 500 ppm (1:100 희석, 10분 침적)</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: '12px', color: 'var(--text-muted)' }}>
              ⚠️ 주의: 분무 금지, 산성세제/암모니아와 혼합 금지, 반드시 환기 상태에서 시행.
            </div>
          </div>
        )}

        {/* 4. Security Content */}
        {currentType === 'security' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ background: 'var(--surface-raised)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid var(--secondary)' }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--secondary)' }}>폭력 및 진료방해/난동</div>
                <div style={{ fontSize: '13px', marginTop: 4 }}>원무과장(내선 901) 보고 ➔ 직원 분리 및 피해자 보호 ➔ 112 경찰 신고</div>
              </div>

              <div style={{ background: 'var(--surface-raised)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid hsl(30, 95%, 45%)' }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: 'hsl(30, 95%, 45%)' }}>도난 사고</div>
                <div style={{ fontSize: '13px', marginTop: 4 }}>시설팀장(내선 923) 통보 ➔ 행정부장 보고 ➔ 원내 방송 및 CCTV 확인</div>
              </div>

              <div style={{ background: 'var(--surface-raised)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid var(--danger)' }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--danger)' }}>인지저하 환자 무단외출 (이탈)</div>
                <div style={{ fontSize: '13px', marginTop: 4 }}>목격 즉시 원무과장(내선 901) 연락 ➔ 전 직원 비상 순찰 방송 ➔ 관할 대왕파출소(02-3411-0323, 112) 및 보호자 즉시 연락</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
