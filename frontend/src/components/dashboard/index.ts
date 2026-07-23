/**
 * MODULE 6 — Barrel export for the modular dashboard component blueprint.
 *
 * Import everything the dashboard needs from this single entry point:
 *   import { RiskGaugeMetrics, DependencyMap, IncidentMatchCards } from './components/dashboard'
 */

export { default as RiskGaugeMetrics } from './RiskGaugeMetrics'
export { default as DependencyMap } from './DependencyMap'
export { default as IncidentMatchCards } from './IncidentMatchCard'

export type {
  RiskGaugeMetricsProps,
  RiskMetric,
  DependencyMapProps,
  DependencyNode,
  DependencyEdge,
  DependencyRelationship,
  CriticalityLevel,
  RiskLevelLabel,
  IncidentMatchCardsProps,
  IncidentMatch,
} from './types'
