import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function FluidRateCalculator() {
  const [fluidVolume, setFluidVolume] = useState('500'); // mL
  const [fluidHours, setFluidHours] = useState('8'); // hours
  const [dropFactor, setDropFactor] = useState(20); // 20 gtt or 60 gtt

  const calculateFluidRate = () => {
    const vol = parseFloat(fluidVolume) || 0;
    const hrs = parseFloat(fluidHours) || 0;
    if (vol <= 0 || hrs <= 0) {
      return { ccPerHour: 0, gttPerMin: 0, secondsPerDrop: 0 };
    }
    const ccPerHour = Math.round((vol / hrs) * 10) / 10;
    const totalMinutes = hrs * 60;
    const totalDrops = vol * dropFactor;
    const gttPerMin = Math.round(totalDrops / totalMinutes);
    const secondsPerDrop = gttPerMin > 0 ? (60 / gttPerMin).toFixed(1) : 0;
    return { ccPerHour, gttPerMin, secondsPerDrop };
  };

  const { ccPerHour, gttPerMin, secondsPerDrop } = calculateFluidRate();

  return (
    <div className="calc-card">
      <div className="calc-title"><Calculator size={18} color="var(--primary)" /> 수액 주입속도 (gtt / cc/hr) 계산기</div>
      <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: 12 }}>
        총 수액량과 주입 시간을 입력하면 시간당 주입량, 분당 방울수, 초당 방울 간격을 즉시 계산합니다.
      </p>

      <div className="calc-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="calc-label">총 수액 용량 (mL)</label>
          <div style={{ display: 'flex', gap: 4 }}>
            {['100', '250', '500', '1000'].map((vol) => (
              <button
                key={vol}
                type="button"
                onClick={() => setFluidVolume(vol)}
                style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: fluidVolume === vol ? 'var(--primary-light)' : 'var(--surface-raised)',
                  color: fluidVolume === vol ? 'var(--primary)' : 'var(--text-muted)',
                  border: '1px solid var(--border)'
                }}
              >
                {vol}mL
              </button>
            ))}
          </div>
        </div>
        <input
          type="number"
          className="calc-input"
          value={fluidVolume}
          onChange={(e) => setFluidVolume(e.target.value)}
          placeholder="예: 500"
        />
      </div>

      <div className="calc-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="calc-label">주입 예정 시간 (시간)</label>
          <div style={{ display: 'flex', gap: 4 }}>
            {['4', '8', '12', '24'].map((hr) => (
              <button
                key={hr}
                type="button"
                onClick={() => setFluidHours(hr)}
                style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: fluidHours === hr ? 'var(--primary-light)' : 'var(--surface-raised)',
                  color: fluidHours === hr ? 'var(--primary)' : 'var(--text-muted)',
                  border: '1px solid var(--border)'
                }}
              >
                {hr}시간
              </button>
            ))}
          </div>
        </div>
        <input
          type="number"
          className="calc-input"
          value={fluidHours}
          onChange={(e) => setFluidHours(e.target.value)}
          placeholder="예: 8"
        />
      </div>

      <div className="calc-group">
        <label className="calc-label">점적기 규격 (수액 세트)</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
          <button
            type="button"
            onClick={() => setDropFactor(20)}
            style={{
              padding: '10px 8px',
              borderRadius: '8px',
              border: '1.5px solid',
              borderColor: dropFactor === 20 ? 'var(--primary)' : 'var(--border)',
              background: dropFactor === 20 ? 'var(--primary-light)' : 'var(--surface-raised)',
              color: dropFactor === 20 ? 'var(--primary)' : 'var(--text-main)',
              fontWeight: dropFactor === 20 ? 800 : 600,
              fontSize: '12.5px'
            }}
          >
            일반 수액세트 (20 gtt/mL)
          </button>
          <button
            type="button"
            onClick={() => setDropFactor(60)}
            style={{
              padding: '10px 8px',
              borderRadius: '8px',
              border: '1.5px solid',
              borderColor: dropFactor === 60 ? 'var(--primary)' : 'var(--border)',
              background: dropFactor === 60 ? 'var(--primary-light)' : 'var(--surface-raised)',
              color: dropFactor === 60 ? 'var(--primary)' : 'var(--text-main)',
              fontWeight: dropFactor === 60 ? 800 : 600,
              fontSize: '12.5px'
            }}
          >
            정밀·마이크로 (60 gtt/mL)
          </button>
        </div>
      </div>

      {/* Results Summary Box */}
      <div style={{ background: 'var(--surface-raised)', padding: '16px', borderRadius: '12px', marginTop: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, textAlign: 'center', marginBottom: 12 }}>
          <div style={{ background: 'var(--surface)', padding: '12px 8px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>시간당 주입량</div>
            <strong style={{ fontSize: '20px', color: 'var(--primary)' }}>{ccPerHour}</strong>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}> cc/hr</span>
          </div>
          <div style={{ background: 'var(--surface)', padding: '12px 8px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>분당 방울수</div>
            <strong style={{ fontSize: '20px', color: 'var(--danger)' }}>{gttPerMin}</strong>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}> gtt/min</span>
          </div>
        </div>

        <div style={{ background: 'var(--primary-light)', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', color: 'var(--primary)', lineHeight: 1.5 }}>
          💡 <strong>병동 라운딩 조절 팁:</strong><br />
          {secondsPerDrop > 0 ? (
            <>약 <strong>{secondsPerDrop}초에 1방울씩</strong> 떨어지도록 챔버 유속을 조절하세요.</>
          ) : (
            <>용량과 시간을 입력해주세요.</>
          )}
        </div>
      </div>
    </div>
  );
}
