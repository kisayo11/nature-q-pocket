import React, { useState } from 'react';
import MorseCalculator from './calculators/MorseCalculator';
import BradenCalculator from './calculators/BradenCalculator';
import FluidRateCalculator from './calculators/FluidRateCalculator';
import DrugExpiryCalculator from './calculators/DrugExpiryCalculator';
import CvrAnalyzer from './calculators/CvrAnalyzer';

const CALC_TABS = [
  { id: 'morse', label: '낙상(Morse)' },
  { id: 'braden', label: '욕창(Braden)' },
  { id: 'gtt', label: '수액속도(gtt)' },
  { id: 'drug', label: '약품유효' },
  { id: 'cvr', label: 'CVR판독' }
];

export default function Calculators() {
  const [activeCalc, setActiveCalc] = useState('morse');

  return (
    <div>
      {/* 5-Way Quick Calculator Switcher Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, marginBottom: 14 }}>
        {CALC_TABS.map((tab) => (
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

      {/* Render Active Sub-Calculator */}
      {activeCalc === 'morse' && <MorseCalculator />}
      {activeCalc === 'braden' && <BradenCalculator />}
      {activeCalc === 'gtt' && <FluidRateCalculator />}
      {activeCalc === 'drug' && <DrugExpiryCalculator />}
      {activeCalc === 'cvr' && <CvrAnalyzer />}
    </div>
  );
}
