import React from 'react'
import RiskGauge from '../RiskGauge'
import type { RiskGaugeMetricsProps, RiskMetric } from './types'

/**
 * MODULE 6 — Risk Gauge Metrics panel.
 *
 * Wraps the existing circular `RiskGauge` with a modular grid of secondary
 * metric tiles (blast radius, historical severity signal, processing time,
 * etc.). Consumers supply `secondaryMetrics` so this component has zero
 * knowledge of which pipeline (v1 mock DAG or v2 ReAct) produced the data —
 * see `services/dashboardAdapters.ts` for the mapping functions.
 */
const toneColor: Record<NonNullable<RiskMetric['tone']>, string> = {
  neutral: '#94a3b8',
  positive: '#34d399',
  warning: '#f59e0b',
  critical: '#f87171',
}

const RiskGaugeMetrics: React.FC<RiskGaugeMetricsProps> = ({
  analysisId,
  primaryScore,
  riskLevel,
  confidence,
  secondaryMetrics,
  isMockMode = false,
}) => {
  return (
    <div className="risk-gauge-metrics">
      <div className="rgm-header">
        <span className="rgm-analysis-id">{analysisId}</span>
        {isMockMode && <span className="rgm-mock-badge">MOCK MODE</span>}
      </div>

      <div className="rgm-body">
        <div className="rgm-primary">
          <RiskGauge score={primaryScore / 100} level={riskLevel} confidence={confidence} />
        </div>

        <div className="rgm-secondary-grid">
          {secondaryMetrics.map((metric) => (
            <div key={metric.key} className="rgm-tile">
              <span className="rgm-tile-label">{metric.label}</span>
              <span
                className="rgm-tile-value"
                style={{ color: toneColor[metric.tone ?? 'neutral'] }}
              >
                {metric.displayValue}
              </span>
              <div className="rgm-tile-bar-track">
                <div
                  className="rgm-tile-bar-fill"
                  style={{
                    width: `${Math.min(Math.max(metric.value, 0), 100)}%`,
                    background: toneColor[metric.tone ?? 'neutral'],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .risk-gauge-metrics {
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 20px;
        }
        .rgm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .rgm-analysis-id {
          font-size: 0.75rem;
          color: #64748b;
          font-family: 'JetBrains Mono', monospace;
        }
        .rgm-mock-badge {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.4);
          color: #f59e0b;
        }
        .rgm-body {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 24px;
          align-items: center;
        }
        @media (max-width: 640px) {
          .rgm-body { grid-template-columns: 1fr; }
        }
        .rgm-secondary-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .rgm-tile {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px 12px;
          background: rgba(51, 65, 85, 0.35);
          border-radius: 8px;
        }
        .rgm-tile-label {
          font-size: 0.72rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .rgm-tile-value {
          font-size: 1rem;
          font-weight: 700;
        }
        .rgm-tile-bar-track {
          width: 100%;
          height: 4px;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.15);
          overflow: hidden;
        }
        .rgm-tile-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.6s ease;
        }
      `}</style>
    </div>
  )
}

export default RiskGaugeMetrics
