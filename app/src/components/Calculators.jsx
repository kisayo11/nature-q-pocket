import React, { useState } from 'react';
import { Calculator, AlertCircle, CheckCircle, Copy, Check } from 'lucide-react';

export default function Calculators() {
  const [activeCalc, setActiveCalc] = useState('morse'); // 'morse' | 'braden' | 'gtt' | 'drug' | 'cvr'

  // Morse State
  const [morseHistory, setMorseHistory] = useState(0);
  const [morseSecondary, setMorseSecondary] = useState(0);
  const [morseAid, setMorseAid] = useState(0);
  const [morseIV, setMorseIV] = useState(0);
  const [morseGait, setMorseGait] = useState(0);
  const [morseMental, setMorseMental] = useState(0);

  const morseScore = Number(morseHistory) + Number(morseSecondary) + Number(morseAid) + Number(morseIV) + Number(morseGait) + Number(morseMental);

  // Braden State
  const [bradenSensory, setBradenSensory] = useState(4);
  const [bradenMoisture, setBradenMoisture] = useState(4);
  const [bradenActivity, setBradenActivity] = useState(4);
  const [bradenMobility, setBradenMobility] = useState(4);
  const [bradenNutrition, setBradenNutrition] = useState(4);
  const [bradenFriction, setBradenFriction] = useState(3);

  const bradenScore = Number(bradenSensory) + Number(bradenMoisture) + Number(bradenActivity) + Number(bradenMobility) + Number(bradenNutrition) + Number(bradenFriction);

  // Fluid Rate (gtt / cc/hr) State
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

  // Drug Expiry State with Custom Open Date Picker
  const [drugType, setDrugType] = useState('insulin');
  const [openDate, setOpenDate] = useState(() => {
    const today = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  });
  const [copied, setCopied] = useState(false);

  const calculateExpiry = () => {
    const baseDate = openDate ? new Date(openDate) : new Date();
    const expiry = new Date(baseDate);
    let label = '';
    let days = 28;

    if (drugType === 'insulin' || drugType === 'eye') {
      days = 28;
      label = '개봉 후 28일';
    } else if (drugType === 'syrup_open' || drugType === 'ointment_open') {
      days = 180;
      label = '개봉 후 6개월';
    } else if (drugType === 'syrup_sub' || drugType === 'ointment_sub') {
      days = 30;
      label = '소분 후 30일(1개월)';
    }

    expiry.setDate(baseDate.getDate() + days);

    const pad = (n) => String(n).padStart(2, '0');
    const openDateStr = `${baseDate.getFullYear()}-${pad(baseDate.getMonth() + 1)}-${pad(baseDate.getDate())}`;
    const expiryStr = `${expiry.getFullYear()}-${pad(expiry.getMonth() + 1)}-${pad(expiry.getDate())}`;

    return { openDateStr, expiryStr, label };
  };

  const { openDateStr, expiryStr, label } = calculateExpiry();
  const labelText = `[약품라벨] 개봉일: ${openDateStr} / 폐기일: ${expiryStr} (${label})`;

  const copyLabel = () => {
    navigator.clipboard.writeText(labelText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // CVR State
  const [cvrTest, setCvrTest] = useState('k');
  const [cvrValue, setCvrValue] = useState('');

  const checkCvr = () => {
    const val = parseFloat(cvrValue);
    if (isNaN(val)) return null;

    if (cvrTest === 'hb') {
      if (val < 7.0) return { alert: true, msg: 'CVR 경고치! 급성 빈혈 및 활동성 출혈 위험 (수혈 검토). 즉시 주치의 보고!' };
    } else if (cvrTest === 'glucose') {
      if (val < 50) return { alert: true, msg: 'CVR 초응급! 저혈당 쇼크 위험. 즉시 당 공급(의식 있을 시 주스, 의식 없으면 포도당 IV) 및 주치의 보고!' };
      if (val > 400) return { alert: true, msg: 'CVR 경고치! 고혈당성 혼수 위기. 즉시 주치의 보고!' };
    } else if (cvrTest === 'k') {
      if (val < 2.8 || val > 6.0) return { alert: true, msg: 'CVR 초응급! 치명적 부정맥 및 심정지 유발 위험. 즉시 심전도 감시 및 주치의 긴급 보고!' };
    } else if (cvrTest === 'platelet') {
      if (val < 50) return { alert: true, msg: 'CVR 경고치! 자발적 출혈 및 지혈 장애 위험. 주치의 보고!' };
    }
    return { alert: false, msg: '정상 또는 일반 관리 범위입니다.' };
  };

  const cvrResult = checkCvr();

  return (
    <div>
      {/* Calculator Tab Switcher (5개 탭) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, marginBottom: 14 }}>
        {[
          { id: 'morse', label: '낙상(Morse)' },
          { id: 'braden', label: '욕창(Braden)' },
          { id: 'gtt', label: '수액속도(gtt)' },
          { id: 'drug', label: '약품유효' },
          { id: 'cvr', label: 'CVR판독' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCalc(tab.id)}
            style={{
              padding: '9px 2px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              background: activeCalc === tab.id ? 'var(--primary)' : 'var(--surface-raised)',
              color: activeCalc === tab.id ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Morse Fall Scale */}
      {activeCalc === 'morse' && (
        <div className="calc-card">
          <div className="calc-title"><Calculator size={18} color="var(--primary)" /> Morse Fall Scale 낙상 사정기</div>
          
          <div className="calc-group">
            <label className="calc-label">1. 지난 3개월간 낙상 과거력</label>
            <select className="calc-select" value={morseHistory} onChange={(e) => setMorseHistory(e.target.value)}>
              <option value="0">없음 (0점)</option>
              <option value="25">있음 (25점)</option>
            </select>
          </div>

          <div className="calc-group">
            <label className="calc-label">2. 이차 진단 (2개 이상 진단명)</label>
            <select className="calc-select" value={morseSecondary} onChange={(e) => setMorseSecondary(e.target.value)}>
              <option value="0">없음 (0점)</option>
              <option value="15">있음 (15점)</option>
            </select>
          </div>

          <div className="calc-group">
            <label className="calc-label">3. 보행 보조기구</label>
            <select className="calc-select" value={morseAid} onChange={(e) => setMorseAid(e.target.value)}>
              <option value="0">사용 안함 / 침상안정 / 휠체어 (0점)</option>
              <option value="15">목발 / 지팡이 / 보행기 (15점)</option>
              <option value="30">가구 등 잡고 보행 (30점)</option>
            </select>
          </div>

          <div className="calc-group">
            <label className="calc-label">4. 정맥수액 요법 / 헤파린 락</label>
            <select className="calc-select" value={morseIV} onChange={(e) => setMorseIV(e.target.value)}>
              <option value="0">없음 (0점)</option>
              <option value="20">투여 중 (20점)</option>
            </select>
          </div>

          <div className="calc-group">
            <label className="calc-label">5. 걸음걸이</label>
            <select className="calc-select" value={morseGait} onChange={(e) => setMorseGait(e.target.value)}>
              <option value="0">정상 / 부동 (0점)</option>
              <option value="10">허약함 (10점)</option>
              <option value="20">장애가 있음 (20점)</option>
            </select>
          </div>

          <div className="calc-group">
            <label className="calc-label">6. 정신 상태</label>
            <select className="calc-select" value={morseMental} onChange={(e) => setMorseMental(e.target.value)}>
              <option value="0">자신의 기능을 인지함 (0점)</option>
              <option value="15">자신의 기능을 과대평가/망각함 (15점)</option>
            </select>
          </div>

          <div className={`calc-result-box ${morseScore >= 51 ? 'danger' : ''}`}>
            <div className="calc-score-display">{morseScore} 점</div>
            <div style={{ fontWeight: 800, fontSize: '15px' }}>
              {morseScore <= 24 ? '🟢 정상 (낙상 위험 낮음)' : morseScore <= 50 ? '🟡 저위험군 (기본 예방활동)' : '🔴 낙상 고위험군 (집중 간호중재)'}
            </div>
            {morseScore >= 51 && (
              <div style={{ marginTop: 8, fontSize: '12px', lineHeight: 1.5, background: 'rgba(255,255,255,0.7)', padding: '8px', borderRadius: '6px' }}>
                <strong>필수 중재:</strong> 1) 손목밴드 '낙상고' 빨간 스티커 부착, 2) 침상 이름표 낙상주의 표시지, 3) EMR '고' 입력, 4) 사이드레일 고정
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Braden Scale */}
      {activeCalc === 'braden' && (
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
      )}

      {/* 3. Fluid Infusion Rate Calculator (수액 주입속도 gtt 계산기) */}
      {activeCalc === 'gtt' && (
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
      )}

      {/* 4. Drug Expiry Calculator */}
      {activeCalc === 'drug' && (
        <div className="calc-card">
          <div className="calc-title"><Calculator size={18} color="var(--primary)" /> 의약품 개봉 후 유효기간 계산기</div>

          <div className="calc-group">
            <label className="calc-label">약품 종류 선택</label>
            <select className="calc-select" value={drugType} onChange={(e) => setDrugType(e.target.value)}>
              <option value="insulin">인슐린 주사제 (개봉 후 28일)</option>
              <option value="eye">안약 / 안연고 (개봉 후 28일)</option>
              <option value="syrup_open">경구 시럽제 원제품 (개봉 후 6개월)</option>
              <option value="syrup_sub">경구 시럽제 소분병 (소분 후 1개월)</option>
              <option value="ointment_open">외용 연고 원제품 (개봉 후 6개월)</option>
              <option value="ointment_sub">외용 연고 소분통 (소분 후 30일)</option>
            </select>
          </div>

          <div className="calc-group">
            <label className="calc-label">개봉일자 직접 선택</label>
            <input
              type="date"
              className="calc-input"
              value={openDate}
              onChange={(e) => setOpenDate(e.target.value)}
            />
          </div>

          <div style={{ background: 'var(--surface-raised)', padding: '14px', borderRadius: '8px', marginTop: 12 }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>기준일로부터 자동 산출:</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary)', margin: '6px 0' }}>
              폐기일자: {expiryStr}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              개봉일: {openDateStr} ({label})
            </div>

            <button
              onClick={copyLabel}
              style={{
                marginTop: 12,
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: copied ? 'var(--success)' : 'var(--primary)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? '라벨 텍스트 복사됨!' : '라벨 텍스트 복사하기'}
            </button>
          </div>
        </div>
      )}

      {/* 4. CVR Checker */}
      {activeCalc === 'cvr' && (
        <div className="calc-card">
          <div className="calc-title"><Calculator size={18} color="var(--primary)" /> CVR (임계검사치) 즉시 판독기</div>

          <div className="calc-group">
            <label className="calc-label">검사 항목 선택</label>
            <select className="calc-select" value={cvrTest} onChange={(e) => setCvrTest(e.target.value)}>
              <option value="k">K (Potassium) - CVR: &lt;2.8 or &gt;6.0 mmol/L</option>
              <option value="glucose">Glucose - CVR: &lt;50 or &gt;400 mg/dL</option>
              <option value="hb">Hb (Hemoglobin) - CVR: &lt;7.0 g/dL</option>
              <option value="platelet">Platelet - CVR: &lt;50 10³/μL</option>
            </select>
          </div>

          <div className="calc-group">
            <label className="calc-label">측정 결과값 입력</label>
            <input
              type="number"
              step="0.1"
              className="calc-input"
              placeholder="예: 2.5 또는 450"
              value={cvrValue}
              onChange={(e) => setCvrValue(e.target.value)}
            />
          </div>

          {cvrResult && (
            <div className={`calc-result-box ${cvrResult.alert ? 'danger' : ''}`}>
              <div style={{ fontWeight: 900, fontSize: '15px' }}>
                {cvrResult.alert ? '🚨 CVR 이상치 감지!' : '✅ 일반 수치'}
              </div>
              <div style={{ fontSize: '13px', marginTop: 6, lineHeight: 1.5 }}>
                {cvrResult.msg}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
