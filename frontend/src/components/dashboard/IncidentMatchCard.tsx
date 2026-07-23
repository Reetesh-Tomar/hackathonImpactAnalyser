import React from 'react'
import type { IncidentMatch, IncidentMatchCardsProps } from './types'

/**
 * MODULE 6 — Historical Incident Match Cards.
 *
 * Renders the top-k "Similar Historical Outages" returned by the Module 3
 * vector search (`vector_search_incidents` tool / `IncidentVectorSearchService`)
 * along with the "Mitigation Used" for each — the exact deliverable
 * described in the RAG module of the architecture blueprint.
 */

const SEVERITY_COLOR: Record<string, string> = {
  low: '#34d399',
  medium: '#3b82f6',
  moderate: '#3b82f6',
  high: '#f59e0b',
  critical: '#ef4444',
  severe: '#ef4444',
  unknown: '#94a3b8',
}

function severityColor(severity: string): string {
  return SEVERITY_COLOR[severity.toLowerCase()] ?? SEVERITY_COLOR.unknown
}

const SingleIncidentMatchCard: React.FC<{
  incident: IncidentMatch
  rank: number
  onSelect?: (incident: IncidentMatch) => void
}> = ({ incident, rank, onSelect }) => {
  const similarityPercent = Math.round(Math.min(Math.max(incident.similarityScore, 0), 1) * 100)

  return (
    <div className="imc-card card" onClick={() => onSelect?.(incident)} role={onSelect ? 'button' : undefined}>
      <div className="imc-rank">#{rank}</div>
      <div className="imc-body">
        <div className="imc-header">
          <span className="imc-badge" style={{ borderColor: severityColor(incident.severity), color: severityColor(incident.severity) }}>
            {incident.severity.toUpperCase()}
          </span>
          <span className="imc-id">{incident.id}</span>
        </div>

        <h4 className="imc-title">{incident.title}</h4>
        <p className="imc-service">Service: {incident.service}</p>

        {incident.rootCause && <p className="imc-root-cause">Root cause: {incident.rootCause}</p>}

        <div className="imc-similarity">
          <div className="imc-similarity-track">
            <div className="imc-similarity-fill" style={{ width: `${similarityPercent}%` }} />
          </div>
          <span className="imc-similarity-label">{similarityPercent}% match</span>
        </div>

        {incident.mitigationUsed && (
          <div className="imc-mitigation">
            <span className="imc-mitigation-label">Mitigation used</span>
            <p className="imc-mitigation-text">{incident.mitigationUsed}</p>
          </div>
        )}

        {incident.occurredAt && <p className="imc-occurred-at">Occurred: {incident.occurredAt}</p>}
      </div>
    </div>
  )
}

const IncidentMatchCards: React.FC<IncidentMatchCardsProps> = ({
  incidents,
  emptyStateMessage = 'No sufficiently similar historical incidents were found.',
  onSelectIncident,
}) => {
  return (
    <div className="incident-match-cards">
      {incidents.length === 0 ? (
        <div className="imc-empty card">{emptyStateMessage}</div>
      ) : (
        incidents.map((incident, index) => (
          <SingleIncidentMatchCard
            key={incident.id}
            incident={incident}
            rank={index + 1}
            onSelect={onSelectIncident}
          />
        ))
      )}

      <style>{`
        .incident-match-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .imc-empty {
          text-align: center;
          color: #94a3b8;
          padding: 24px;
        }
        .imc-card {
          display: flex;
          gap: 12px;
          padding: 16px;
        }
        .imc-rank {
          font-size: 1.1rem;
          font-weight: 700;
          color: #475569;
          flex-shrink: 0;
          width: 28px;
        }
        .imc-body {
          flex: 1;
          min-width: 0;
        }
        .imc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .imc-badge {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 2px 8px;
          border: 1px solid;
          border-radius: 999px;
        }
        .imc-id {
          font-size: 0.72rem;
          color: #64748b;
          font-family: 'JetBrains Mono', monospace;
        }
        .imc-title {
          margin: 8px 0 4px 0;
          font-size: 0.95rem;
          color: #f1f5f9;
        }
        .imc-service, .imc-root-cause, .imc-occurred-at {
          margin: 2px 0;
          font-size: 0.82rem;
          color: #94a3b8;
        }
        .imc-similarity {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px 0;
        }
        .imc-similarity-track {
          flex: 1;
          height: 6px;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.15);
          overflow: hidden;
        }
        .imc-similarity-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #6366f1, #818cf8);
          transition: width 0.6s ease;
        }
        .imc-similarity-label {
          font-size: 0.75rem;
          color: #a5b4fc;
          white-space: nowrap;
        }
        .imc-mitigation {
          margin-top: 6px;
          padding: 8px 10px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: 8px;
        }
        .imc-mitigation-label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #34d399;
          margin-bottom: 2px;
        }
        .imc-mitigation-text {
          margin: 0;
          font-size: 0.82rem;
          color: #cbd5e1;
        }
      `}</style>
    </div>
  )
}

export default IncidentMatchCards
