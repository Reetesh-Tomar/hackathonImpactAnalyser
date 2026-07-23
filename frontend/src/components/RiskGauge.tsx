import React from 'react'

interface RiskGaugeProps {
  score: number
  level: string
  confidence: number
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, confidence }) => {
  // Backend riskScore is a 0-1 float; render it as a bank-report-style X/100 score.
  const scoreOutOf100 = Math.round(Math.min(Math.max(score * 100, 0), 100))
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (scoreOutOf100 / 100) * circumference

  const getColor = () => {
    switch (level) {
      case 'critical': return '#ef4444'
      case 'high': return '#f59e0b'
      case 'medium': return '#3b82f6'
      case 'low': return '#10b981'
      default: return '#1d4ed8'
    }
  }

  const getLevelLabel = () => {
    switch (level) {
      case 'critical': return 'CRITICAL RISK'
      case 'high': return 'HIGH RISK'
      case 'medium': return 'MEDIUM RISK'
      case 'low': return 'LOW RISK'
      default: return 'UNKNOWN RISK'
    }
  }

  const color = getColor()

  return (
    <div className="risk-gauge">
      <div className="risk-gauge-ring-wrap">
        <svg width="150" height="150" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--bg-tertiary)" strokeWidth="9" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 6px ${color}66)` }}
          />
        </svg>
        <div className="risk-gauge-center">
          <span className="risk-gauge-score" style={{ color }}>{scoreOutOf100}</span>
          <span className="risk-gauge-max">/100</span>
        </div>
      </div>
      <div className="risk-gauge-info">
        <span className="risk-level-pill" style={{ color, background: `${color}22`, borderColor: `${color}55` }}>
          {getLevelLabel()}
        </span>
        <span className="risk-confidence">Confidence {(confidence * 100).toFixed(0)}%</span>
      </div>

      <style>{`
        .risk-gauge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .risk-gauge-ring-wrap {
          position: relative;
          width: 150px;
          height: 150px;
        }
        .risk-gauge-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .risk-gauge-score {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1;
          font-family: 'Inter', sans-serif;
        }
        .risk-gauge-max {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
          margin-top: 2px;
        }
        .risk-gauge-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .risk-level-pill {
          padding: 5px 14px;
          border-radius: 999px;
          border: 1px solid;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .risk-confidence {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}

export default RiskGauge
