import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function BradenCalculator() {
  const [bradenSensory, setBradenSensory] = useState(4);
  const [bradenMoisture, setBradenMoisture] = useState(4);
  const [bradenActivity, setBradenActivity] = useState(4);
  const [bradenMobility, setBradenMobility] = useState(4);
  const [bradenNutrition, setBradenNutrition] = useState(4);
  const [bradenFriction, setBradenFriction] = useState(3);

  const bradenScore = Number(bradenSensory) + Number(bradenMoisture) + Number(bradenActivity) + Number(bradenMobility) + Number(bradenNutrition) + Number(bradenFriction);

  return (
    <div className="calc-card">
      <div className="calc-title"><Calculator size={18} color="var(--primary)" /> Braden Scale 욕창 사정기</div>

      <div className="calc-group">
        <label className="calc-label">1. 감각 지각 (Sensory Perception)</label>
        <select className="calc-select" value={bradenSensory} onChange={(e) => setBradenSensory(e.target.value)}>
          <option value="1">1. 완전히 제한됨 (1점)</option>
          <option value="2">2. 매우 제한됨 (2점)</option>
          <option value="3">3. 약간 제한됨 (3점)</option>
          <option value="4">4. 제한 없음 (4점)</option>
        </select>
      </div>

      <div className="calc-group">
        <label className="calc-label">2. 습기 노출 (Moisture)</label>
        <select className="calc-select" value={bradenMoisture} onChange={(e) => setBradenMoisture(e.target.value)}>
          <option value="1">1. 항상 축축함 (1점)</option>
          <option value="2">2. 자주 축축함 (2점)</option>
          <option value="3">3. 가끔 축축함 (3점)</option>
          <option value="4">4. 거의 젖지 않음 (4점)</option>
        </select>
      </div>

      <div className="calc-group">
        <label className="calc-label">3. 활동 정도 (Activity)</label>
        <select className="calc-select" value={bradenActivity} onChange={(e) => setBradenActivity(e.target.value)}>
          <option value="1">1. 침상에 국한됨 (1점)</option>
          <option value="2">2. 의자에 국한됨 (2점)</option>
          <option value="3">3. 가끔 걸음 (3점)</option>
          <option value="4">4. 자주 걸음 (4점)</option>
        </select>
      </div>

      <div className="calc-group">
        <label className="calc-label">4. 움직임 (Mobility)</label>
        <select className="calc-select" value={bradenMobility} onChange={(e) => setBradenMobility(e.target.value)}>
          <option value="1">1. 완전히 움직이지 못함 (1점)</option>
          <option value="2">2. 매우 제한됨 (2점)</option>
          <option value="3">3. 약간 제한됨 (3점)</option>
          <option value="4">4. 제한 없음 (4점)</option>
        </select>
      </div>

      <div className="calc-group">
        <label className="calc-label">5. 영양 상태 (Nutrition)</label>
        <select className="calc-select" value={bradenNutrition} onChange={(e) => setBradenNutrition(e.target.value)}>
          <option value="1">1. 매우 불량함 (1점)</option>
          <option value="2">2. 약간 부족함 (2점)</option>
          <option value="3">3. 적절함 (3점)</option>
          <option value="4">4. 우수함 (4점)</option>
        </select>
      </div>

      <div className="calc-group">
        <label className="calc-label">6. 마찰력과 응전력 (Friction)</label>
        <select className="calc-select" value={bradenFriction} onChange={(e) => setBradenFriction(e.target.value)}>
          <option value="1">1. 문제 있음 (1점)</option>
          <option value="2">2. 잠재적 문제 (2점)</option>
          <option value="3">3. 문제 없음 (3점)</option>
        </select>
      </div>

      <div className={`calc-result-box ${bradenScore <= 12 ? 'danger' : ''}`}>
        <div className="calc-score-display">{bradenScore} 점</div>
        <div style={{ fontWeight: 800, fontSize: '15px' }}>
          {bradenScore <= 9 ? '🔴 최고위험군 (9점 이하)' : bradenScore <= 12 ? '🟠 고위험군 (10~12점) - 예방중재 필수' : bradenScore <= 14 ? '🟡 중등도 위험 (13~14점)' : '🟢 저위험/비위험군'}
        </div>
        {bradenScore <= 12 && (
          <div style={{ marginTop: 8, fontSize: '12px', lineHeight: 1.5, background: 'var(--surface-raised)', color: 'var(--text-main)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <strong>필수 중재:</strong> 1) 매 2시간마다 30도 측위 체위변경, 2) 매 Duty마다 욕창 예방 체크리스트 기록, 3) 베개·매트리스로 돌출부 감압
          </div>
        )}
      </div>
    </div>
  );
}
