/**
 * TypeScript mirror of ai-service/app/agents/react/api_models.py
 * (the v2 ReAct pipeline's FullAnalysisResponseV2 contract).
 */

export interface MitigationStep {
  step_number: number
  action: string
  owner_team?: string | null
}

export interface RedactionEvent {
  category: string
  tag_used: string
  span_start: number
  span_end: number
  matched_length: number
  detector: string
}

export interface RedactionReport {
  total_redactions: number
  redactions_by_category: Record<string, number>
  events: RedactionEvent[]
  is_safe_for_llm: boolean
}

export interface ReactStepTrace {
  iteration: number
  thought: string
  action?: string | null
  action_input?: Record<string, unknown> | null
  observation?: Record<string, unknown> | null
  is_final_step: boolean
}

export interface AgentExecutionTrace {
  agent_name: string
  steps: ReactStepTrace[]
  hit_iteration_cap: boolean
  used_fallback: boolean
  elapsed_ms: number
}

export interface TouchedSymbol {
  symbol_name: string
  file_path: string
  change_kind: string
}

export interface ImpactedApplication {
  service_id: string
  service_name: string
  criticality: string
  relationship: string
}

export interface CodeAuditReport {
  inferred_change_type: string
  primary_component: string
  touched_symbols: TouchedSymbol[]
  impacted_applications: ImpactedApplication[]
  blast_radius_score: number
  reasoning: string[]
}

export interface SimilarOutageFinding {
  incident_id: string
  title: string
  similarity_score: number
  root_cause: string
  mitigation_used: string
}

export interface HistoricalFindingsReport {
  similar_outages: SimilarOutageFinding[]
  historical_severity_signal: string
  recurring_pattern_summary: string
  reasoning: string[]
}

export interface FullAnalysisResponseV2 {
  analysis_id: string
  risk_score: number
  risk_level: string
  top_risks: string[]
  applications_impacted: string[]
  teams_notified: string[]
  step_by_step_mitigation: MitigationStep[]
  confidence: number
  executive_summary: string
  is_fallback: boolean

  code_audit: CodeAuditReport
  historical_findings: HistoricalFindingsReport
  redaction_report: RedactionReport
  agent_traces: AgentExecutionTrace[]

  processing_time_ms: number
  mock_mode: boolean
}

export interface ChangeAnalysisRequestV2 {
  change_title: string
  change_description: string
  target_component: string
  change_type?: string
  raw_diff_text?: string
  environment?: string
  requested_by?: string
}
