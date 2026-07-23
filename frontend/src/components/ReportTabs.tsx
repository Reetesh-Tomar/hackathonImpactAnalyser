import React from 'react'
import type { TabView, ChangeImpactResponse, SimilarIncident, AgentTrace, ImpactedServiceDetail } from '../types'
import { markdownish } from '../utils/markdown'

interface ReportTabsProps {
  report: ChangeImpactResponse
  activeTab: TabView
  onTabChange: (tab: TabView) => void
  requestTitle?: string
}

const tabs: { key: TabView; label: string; count?: (r: ChangeImpactResponse) => number }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'understanding', label: 'AI Understanding' },
  { key: 'evidence', label: 'RAG Evidence', count: (r) => r.retrievedEvidence.length },
  { key: 'incidents', label: 'Similar Incidents', count: (r) => r.similarIncidents.length },
  { key: 'mitigation', label: 'Mitigation Plan' },
  { key: 'trace', label: 'Agent Trace' },
]

const ReportTabs: React.FC<ReportTabsProps> = ({ report, activeTab, onTabChange, requestTitle }) => {
  return (
    <div className="report-tabs">
      <div className="tabs-nav">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
            {tab.count && <span className="tab-count">{tab.count(report)}</span>}
          </button>
        ))}
      </div>

      {/* key={activeTab} forces React to remount this wrapper on every tab
          switch so the fadeIn/slideIn animation actually replays each time
          (a static className alone won't retrigger a CSS animation on an
          element that never left the DOM). */}
      <div key={activeTab} className="tab-content animate-fadeIn">
        {activeTab === 'overview' && <OverviewTab report={report} requestTitle={requestTitle} />}
        {activeTab === 'understanding' && <UnderstandingTab report={report} />}
        {activeTab === 'evidence' && <EvidenceTab report={report} />}
        {activeTab === 'incidents' && <IncidentsTab incidents={report.similarIncidents} />}
        {activeTab === 'mitigation' && <MitigationTab report={report} />}
        {activeTab === 'trace' && <TraceTab traces={report.agentTraces} />}
      </div>

      <style>{`
        .report-tabs {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .tabs-nav {
          display: flex;
          gap: 4px;
          background: var(--bg-secondary);
          border-radius: 12px;
          padding: 4px;
          border: 1px solid var(--border);
          overflow-x: auto;
        }
        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-family: inherit;
        }
        .tab-btn:hover {
          color: var(--text-primary);
          background: rgba(59, 130, 246, 0.1);
          transform: translateY(-1px);
        }
        .tab-btn:active {
          transform: translateY(0);
        }
        .tab-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 2px 10px rgba(29, 78, 216, 0.4);
        }
        .tab-count {
          background: rgba(255,255,255,0.18);
          padding: 1px 7px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
        }
        .tab-btn:not(.active) .tab-count {
          background: var(--bg-tertiary);
        }
        .tab-content {
          min-height: 200px;
        }
      `}</style>
    </div>
  )
}

// ============================================================
// Overview Tab — "Why the AI chose this application" + impacted services
// ============================================================
const OverviewTab: React.FC<{ report: ChangeImpactResponse; requestTitle?: string }> = ({ report, requestTitle }) => (
  <div className="tab-panel">
    <div className="card why-panel">
      <div className="card-header">
        <h3 className="card-title">🔍 Why the AI chose this application</h3>
      </div>
      <div className="why-grid">
        <div className="why-main">
          <span className="why-label">Normalized Request</span>
          <p className="why-request">{requestTitle || report.interpretedIntent.substring(0, 140)}</p>

          {report.reasoning.length > 0 && (
            <>
              <span className="why-label" style={{ marginTop: 14 }}>Reasoning</span>
              <ul className="reasoning-list">
                {report.reasoning.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="why-side">
          <div className="why-fact">
            <span className="why-fact-label">Primary Component</span>
            <span className="why-fact-value">{report.primaryComponent || 'Not resolved'}</span>
          </div>
          <div className="why-fact">
            <span className="why-fact-label">Inferred Change Type</span>
            <span className="why-fact-value">{(report.inferredChangeType || 'unknown').replace(/_/g, ' ').toUpperCase()}</span>
          </div>
          <div className="why-fact">
            <span className="why-fact-label">Data Sources Used</span>
            <div className="service-chips" style={{ marginTop: 6 }}>
              {report.dataSourcesUsed.map((src, i) => (
                <span key={i} className="service-chip src-chip">{src}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="overview-grid" style={{ marginTop: 16 }}>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Impact Summary</h3>
        </div>
        <div className="stat-list">
          <div className="stat">
            <span className="stat-label">Risk Score</span>
            <span className={`stat-value badge-${report.riskLevel}`}>
              {Math.round(report.riskScore * 100)}/100
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Confidence</span>
            <span className="stat-value">{(report.confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">Services Impacted</span>
            <span className="stat-value">{report.impactedServices.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Processing Time</span>
            <span className="stat-value">{(report.processingTimeMs / 1000).toFixed(2)}s</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Teams to Notify ({report.teamsToNotify.length})</h3>
        </div>
        <div className="team-list">
          {report.teamsToNotify.map((team, i) => (
            <span key={i} className="team-badge">{team}</span>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <h3 className="card-title" style={{ marginBottom: 8 }}>Mode</h3>
          <span className={`badge ${report.mockMode ? 'badge-medium' : 'badge-success'}`}>
            {report.mockMode ? 'Mock Mode' : 'Live Analysis'}
          </span>
        </div>
      </div>
    </div>

    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-header">
        <h3 className="card-title">Executive Summary</h3>
      </div>
      <div className="exec-summary" dangerouslySetInnerHTML={{ __html: markdownish(report.executiveSummary) }} />
    </div>

    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-header">
        <h3 className="card-title">Impacted Services ({report.impactedServicesDetailed.length || report.impactedServices.length})</h3>
      </div>
      <ImpactedServicesList services={report.impactedServicesDetailed} fallbackNames={report.impactedServices} />
    </div>

    <style>{`
      .why-panel { border-color: rgba(59, 130, 246, 0.35); }
      .why-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
      @media (max-width: 768px) { .why-grid { grid-template-columns: 1fr; } }
      .why-label {
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: var(--text-muted);
        font-weight: 700;
        display: block;
        margin-bottom: 6px;
      }
      .why-request {
        font-size: 0.95rem;
        color: var(--text-primary);
        font-weight: 600;
        line-height: 1.5;
      }
      .reasoning-list {
        margin: 0;
        padding-left: 18px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .reasoning-list li {
        font-size: 0.85rem;
        color: var(--text-secondary);
        line-height: 1.6;
      }
      .why-side { display: flex; flex-direction: column; gap: 16px; }
      .why-fact { display: flex; flex-direction: column; gap: 4px; }
      .why-fact-label {
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--text-muted);
        font-weight: 700;
      }
      .why-fact-value {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--primary-light);
        font-family: 'Courier New', monospace;
      }

      .overview-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      @media (max-width: 640px) {
        .overview-grid { grid-template-columns: 1fr; }
      }
      .stat-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .stat {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid var(--border);
      }
      .stat:last-child { border-bottom: none; }
      .stat-label { color: var(--text-secondary); font-size: 0.875rem; }
      .stat-value { font-weight: 700; font-size: 0.9rem; }
      .team-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .team-badge {
        padding: 4px 10px;
        background: rgba(59, 130, 246, 0.12);
        border: 1px solid rgba(59, 130, 246, 0.35);
        border-radius: 6px;
        color: #93c5fd;
        font-size: 0.8rem;
        font-weight: 500;
      }
      .exec-summary {
        font-size: 0.9rem;
        line-height: 1.8;
        color: var(--text-secondary);
      }
      .exec-summary strong {
        color: var(--text-primary);
      }
    `}</style>
  </div>
)

// Minimal markdown-ish renderer for the executive summary (headers/bold/bullets)
const ImpactedServicesList: React.FC<{ services: ImpactedServiceDetail[]; fallbackNames: string[] }> = ({ services, fallbackNames }) => {
  const rows: ImpactedServiceDetail[] = services.length > 0
    ? services
    : fallbackNames.map((name) => ({ name, criticality: 'unknown', owner: 'unknown', type: 'unknown', role: 'target' }))

  if (rows.length === 0) {
    return <p style={{ color: 'var(--text-muted)', padding: 12 }}>No impacted services resolved for this change.</p>
  }

  return (
    <div className="services-list">
      {rows.map((svc, i) => (
        <div key={i} className="service-row">
          <div className="service-row-accent" />
          <div className="service-row-main">
            <span className="service-row-name">{svc.name}</span>
            <span className="service-row-meta">
              Team: {svc.owner.replace('team-', '').replace(/-/g, ' ')} · Type: {svc.type}
            </span>
          </div>
          <div className="service-row-tags">
            <span className={`badge badge-${svc.criticality}`}>{svc.criticality}</span>
            <span className={`role-tag role-tag-${svc.role}`}>{svc.role}</span>
          </div>
        </div>
      ))}

      <style>{`
        .services-list { display: flex; flex-direction: column; gap: 8px; }
        .service-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 10px;
          position: relative;
          overflow: hidden;
        }
        .service-row-accent {
          width: 3px;
          align-self: stretch;
          border-radius: 3px;
          background: var(--primary);
          flex-shrink: 0;
        }
        .service-row-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .service-row-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        .service-row-meta {
          font-size: 0.78rem;
          color: var(--text-muted);
          text-transform: capitalize;
        }
        .service-row-tags {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  )
}

// ============================================================
// Understanding Tab
// ============================================================
const UnderstandingTab: React.FC<{ report: ChangeImpactResponse }> = ({ report }) => (
  <div className="tab-panel">
    <div className="card">
      <h3 className="card-title" style={{ marginBottom: 12 }}>Raw Agent Interpretation</h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
        {report.interpretedIntent}
      </p>
    </div>
    <div className="card" style={{ marginTop: 16 }}>
      <h3 className="card-title" style={{ marginBottom: 12 }}>Impacted Service Names</h3>
      <div className="service-chips">
        {report.impactedServices.map((svc, i) => (
          <span key={i} className="service-chip">{svc}</span>
        ))}
      </div>
    </div>
    <div className="card" style={{ marginTop: 16 }}>
      <h3 className="card-title" style={{ marginBottom: 12 }}>Data Sources Used</h3>
      <div className="service-chips">
        {report.dataSourcesUsed.map((src, i) => (
          <span key={i} className="service-chip src-chip">{src}</span>
        ))}
      </div>
    </div>

    <style>{`
      .service-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .service-chip {
        padding: 6px 14px;
        background: rgba(6, 182, 212, 0.1);
        border: 1px solid rgba(6, 182, 212, 0.3);
        border-radius: 6px;
        color: #22d3ee;
        font-size: 0.85rem;
      }
      .src-chip {
        background: rgba(16, 185, 129, 0.1);
        border-color: rgba(16, 185, 129, 0.3);
        color: #34d399;
      }
    `}</style>
  </div>
)

// ============================================================
// Evidence Tab
// ============================================================
const EvidenceTab: React.FC<{ report: ChangeImpactResponse }> = ({ report }) => (
  <div className="tab-panel">
    {report.retrievedEvidence.length === 0 ? (
      <div className="card">
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>
          No evidence retrieved for this change.
        </p>
      </div>
    ) : (
      <div className="evidence-list">
        {report.retrievedEvidence.slice(0, 10).map((ev, i) => (
          <div key={i} className="evidence-item card">
            <div className="evidence-meta">
              <span className={`badge badge-${(ev as any).type || 'info'}`}>
                {(ev as any).type}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Source: {(ev as any).source}
              </span>
            </div>
            <p className="evidence-content">
              {typeof (ev as any).content === 'string'
                ? (ev as any).content.substring(0, 300)
                : JSON.stringify((ev as any).content)}
            </p>
            {(ev as any).relevance !== undefined && (
              <div className="evidence-relevance">
                Relevance: {((ev as any).relevance * 100).toFixed(0)}%
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    <style>{`
      .evidence-list { display: flex; flex-direction: column; gap: 12px; }
      .evidence-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      .evidence-content {
        color: var(--text-secondary);
        font-size: 0.85rem;
        line-height: 1.6;
      }
      .evidence-relevance {
        margin-top: 8px;
        font-size: 0.8rem;
        color: var(--text-muted);
      }
    `}</style>
  </div>
)

// ============================================================
// Incidents Tab
// ============================================================
const IncidentsTab: React.FC<{ incidents: SimilarIncident[] }> = ({ incidents }) => (
  <div className="tab-panel">
    {incidents.length === 0 ? (
      <div className="card">
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>
          No similar incidents found.
        </p>
      </div>
    ) : (
      <div className="incidents-list">
        {incidents.map((inc, i) => (
          <div key={i} className="incident-item card">
            <div className="incident-header">
              <span className={`badge badge-${inc.severity}`}>{inc.severity}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{inc.id}</span>
            </div>
            <h4 style={{ margin: '8px 0', fontSize: '0.95rem' }}>{inc.title || 'Untitled incident'}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Service: {inc.service}
            </p>
            {inc.resolution && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>
                Resolution: {inc.resolution.substring(0, 150)}
              </p>
            )}
            {inc.similarity_score !== undefined && (
              <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Match: {(inc.similarity_score * 100).toFixed(0)}%
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    <style>{`
      .incidents-list { display: flex; flex-direction: column; gap: 12px; }
      .incident-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `}</style>
  </div>
)

// ============================================================
// Mitigation Tab
// ============================================================
const MitigationTab: React.FC<{ report: ChangeImpactResponse }> = ({ report }) => (
  <div className="tab-panel">
    <div className="card">
      <h3 className="card-title" style={{ marginBottom: 12 }}>Potential Risks</h3>
      <div className="list-items">
        {report.potentialRisks.map((risk, i) => (
          <div key={i} className="list-item">
            <span className="list-icon">⚠️</span>
            <span>{risk}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="card" style={{ marginTop: 16 }}>
      <h3 className="card-title" style={{ marginBottom: 12 }}>Mitigation Plan</h3>
      <div className="list-items">
        {report.mitigationPlan.map((step, i) => (
          <div key={i} className="list-item">
            <span className="list-icon">{i + 1}.</span>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="card" style={{ marginTop: 16 }}>
      <h3 className="card-title" style={{ marginBottom: 12 }}>Recommended Tests</h3>
      <div className="list-items">
        {report.recommendedTests.map((test, i) => (
          <div key={i} className="list-item">
            <span className="list-icon">🧪</span>
            <span>{test}</span>
          </div>
        ))}
      </div>
    </div>

    <style>{`
      .list-items { display: flex; flex-direction: column; gap: 8px; }
      .list-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 10px 12px;
        background: var(--bg-tertiary);
        border-radius: 8px;
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
      .list-icon {
        flex-shrink: 0;
        font-weight: 600;
        min-width: 24px;
      }
    `}</style>
  </div>
)

// ============================================================
// Agent Trace Tab
// ============================================================
const AGENT_META: Record<string, { icon: string; color: string; label: string }> = {
  intake: { icon: '🧭', color: '#60a5fa', label: 'PromptUnderstandingAgent' },
  dependency: { icon: '🔗', color: '#22d3ee', label: 'DependencyAgent' },
  knowledge: { icon: '📚', color: '#a78bfa', label: 'KnowledgeRetrievalAgent' },
  incident: { icon: '🚨', color: '#f472b6', label: 'IncidentAgent' },
  risk: { icon: '⚠️', color: '#f59e0b', label: 'RiskAgent' },
  notification: { icon: '🔔', color: '#fbbf24', label: 'NotificationAgent' },
  summary: { icon: '✅', color: '#34d399', label: 'SummaryAgent' },
}

function agentKeyOf(rawAgent: string): string {
  return String(rawAgent).replace('AgentType.', '').toLowerCase()
}

function summarizeAgentTrace(agentKey: string, outputRaw?: string): { line: string; sub?: string } {
  let data: any = null
  try {
    data = outputRaw ? JSON.parse(outputRaw) : null
  } catch {
    data = null
  }
  if (!data) {
    return { line: outputRaw ? outputRaw.substring(0, 180) : 'No output recorded for this step.' }
  }

  switch (agentKey) {
    case 'intake': {
      const services: string[] = data.primary_services || []
      return {
        line: `Resolved ${services.length} component target(s); primary component is ${services[0] || 'unknown'}.`,
        sub: `Scope: ${data.scope || 'n/a'} · Change type: ${data.change_type || 'n/a'}`,
      }
    }
    case 'dependency': {
      const target = (data.primary_services || []).length
      const all = (data.all_impacted_services || []).length
      const details = data.impacted_details || []
      const direct = details.filter((d: any) => d.role === 'direct').length
      const downstream = details.filter((d: any) => d.role === 'downstream').length
      return {
        line: `Found ${all} impacted service(s) across ${target} resolved target component(s).`,
        sub: `TARGET=${target}, DIRECT=${direct}, DOWNSTREAM=${downstream}`,
      }
    }
    case 'knowledge': {
      const evidence: any[] = data.evidence || []
      const sourceCounts: Record<string, number> = {}
      evidence.forEach((e) => { sourceCounts[e.type] = (sourceCounts[e.type] || 0) + 1 })
      const sourceStr = Object.entries(sourceCounts).map(([k, v]) => `${k}:${v}`).join(', ')
      return {
        line: `RAG retrieved ${evidence.length} evidence item(s) from ${Object.keys(sourceCounts).length} source type(s).`,
        sub: sourceStr || undefined,
      }
    }
    case 'incident': {
      const incidents: any[] = data.similar_incidents || []
      const top = incidents[0]
      return {
        line: `Found ${incidents.length} similar historical incident(s) (${data.high_severity_count || 0} high/critical severity).`,
        sub: top ? `Top match: ${top.title || top.id} (score ${Math.round((top.similarity_score || 0) * 100)}%)` : undefined,
      }
    }
    case 'risk': {
      return {
        line: `Risk Score: ${Math.round((data.risk_score || 0) * 100)}/100 (${String(data.risk_level || '').toUpperCase()}) · Confidence: ${((data.confidence || 0) * 100).toFixed(0)}%`,
        sub: `${(data.potential_risks || []).length} risk(s) identified, ${(data.mitigation_plan || []).length} mitigation step(s) generated`,
      }
    }
    case 'notification': {
      const teams: string[] = data.teams_to_notify || []
      return {
        line: `Identified ${teams.length} team(s) to notify, priority: ${data.notification_priority || 'standard'}.`,
        sub: teams.length ? `Teams: ${teams.join(', ')}` : undefined,
      }
    }
    case 'summary': {
      return {
        line: `Generated executive summary (${(data.executive_summary || '').length} chars) · Analysis ID: ${data.analysis_id || 'n/a'}`,
        sub: data.mock_mode ? 'Mode: mock' : 'Mode: live AI provider',
      }
    }
    default:
      return { line: JSON.stringify(data).substring(0, 180) }
  }
}

const TraceTab: React.FC<{ traces: AgentTrace[] }> = ({ traces }) => {
  const totalMs = traces.reduce((sum, t) => sum + (t.processingTimeMs || 0), 0)

  return (
    <div className="tab-panel">
      <div className="trace-total">Agent Execution Trace <span>Total: {totalMs}ms</span></div>
      <div className="agent-trace-list">
        {traces.map((trace, i) => {
          const key = agentKeyOf(trace.agent)
          const meta = AGENT_META[key] || { icon: '🤖', color: '#94a3b8', label: trace.agent }
          const { line, sub } = summarizeAgentTrace(key, trace.output)
          const isSuccess = trace.status === 'completed'
          return (
            <div key={i} className="agent-card" style={{ borderLeftColor: meta.color }}>
              <div className="agent-card-icon" style={{ background: `${meta.color}22`, color: meta.color }}>
                {meta.icon}
              </div>
              <div className="agent-card-body">
                <div className="agent-card-header">
                  <span className="agent-card-name">{meta.label}</span>
                  <div className="agent-card-meta">
                    <span className={`status-pill ${isSuccess ? 'status-success' : trace.status === 'failed' ? 'status-failed' : 'status-running'}`}>
                      {isSuccess ? 'SUCCESS' : trace.status.toUpperCase()}
                    </span>
                    <span className="agent-card-time">{trace.processingTimeMs}ms</span>
                  </div>
                </div>
                <p className="agent-card-line">{line}</p>
                {sub && <p className="agent-card-sub">{sub}</p>}
                {trace.error && <p className="agent-card-error">Error: {trace.error}</p>}
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .trace-total {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 14px;
        }
        .trace-total span {
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-muted);
        }
        .agent-trace-list { display: flex; flex-direction: column; gap: 10px; }
        .agent-card {
          display: flex;
          gap: 14px;
          padding: 14px 16px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-left: 4px solid;
          border-radius: 10px;
          transition: var(--transition);
        }
        .agent-card:hover {
          box-shadow: var(--shadow);
        }
        .agent-card-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .agent-card-body { flex: 1; min-width: 0; }
        .agent-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 6px;
        }
        .agent-card-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-primary);
          font-family: 'Courier New', monospace;
        }
        .agent-card-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .status-pill {
          padding: 2px 9px;
          border-radius: 999px;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.4px;
        }
        .status-success { background: rgba(16, 185, 129, 0.18); color: #6ee7b7; }
        .status-failed { background: rgba(239, 68, 68, 0.18); color: #fca5a5; }
        .status-running { background: rgba(245, 158, 11, 0.18); color: #fcd34d; }
        .agent-card-time { font-size: 0.75rem; color: var(--text-muted); }
        .agent-card-line {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .agent-card-sub {
          font-size: 0.76rem;
          color: var(--text-muted);
          margin-top: 4px;
          font-family: 'Courier New', monospace;
        }
        .agent-card-error {
          font-size: 0.8rem;
          color: #fca5a5;
          margin-top: 4px;
        }
      `}</style>
    </div>
  )
}

export default ReportTabs
