import React, { useMemo, useState } from 'react'
import type { DependencyMapProps, DependencyNode, CriticalityLevel } from './types'

/**
 * MODULE 6 — Interactive Dependency Mapping.
 *
 * Renders the blast-radius graph produced by the Code Auditor Agent's
 * `trace_dependency_graph` tool (see ai-service/app/agents/react/tools.py)
 * as a radial diagram: the target component at the center, direct
 * dependencies on the inner ring, and downstream cascade impacts on the
 * outer ring. Implemented with plain SVG (no charting library dependency)
 * so it stays lightweight and trivially themeable once real mockups arrive.
 */

const CRITICALITY_COLOR: Record<CriticalityLevel, string> = {
  low: '#34d399',
  medium: '#3b82f6',
  high: '#f59e0b',
  critical: '#ef4444',
}

const RELATIONSHIP_RADIUS: Record<DependencyNode['relationship'], number> = {
  target: 0,
  direct_dependency: 120,
  downstream_cascade: 210,
}

interface PositionedNode extends DependencyNode {
  x: number
  y: number
}

function layoutNodes(rootId: string, nodes: DependencyNode[]): PositionedNode[] {
  const byRelationship: Record<string, DependencyNode[]> = {
    direct_dependency: [],
    downstream_cascade: [],
  }
  let rootNode: DependencyNode | undefined

  for (const node of nodes) {
    if (node.id === rootId || node.relationship === 'target') {
      rootNode = node
      continue
    }
    byRelationship[node.relationship]?.push(node)
  }

  const positioned: PositionedNode[] = []
  if (rootNode) {
    positioned.push({ ...rootNode, x: 0, y: 0 })
  }

  for (const relationship of ['direct_dependency', 'downstream_cascade'] as const) {
    const ring = byRelationship[relationship]
    const radius = RELATIONSHIP_RADIUS[relationship]
    const angleStep = (2 * Math.PI) / Math.max(ring.length, 1)
    ring.forEach((node, index) => {
      const angle = angleStep * index - Math.PI / 2
      positioned.push({
        ...node,
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      })
    })
  }

  return positioned
}

const VIEWBOX_SIZE = 480
const CENTER = VIEWBOX_SIZE / 2

const DependencyMap: React.FC<DependencyMapProps> = ({
  rootId,
  nodes,
  onNodeSelect,
  selectedNodeId: controlledSelectedId,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null)
  const selectedId = controlledSelectedId ?? internalSelectedId

  const positioned = useMemo(() => layoutNodes(rootId, nodes), [rootId, nodes])
  const selectedNode = positioned.find((n) => n.id === selectedId) ?? null

  const handleSelect = (node: PositionedNode) => {
    setInternalSelectedId(node.id)
    onNodeSelect?.(node)
  }

  return (
    <div className="dependency-map">
      <div className="dm-canvas-wrapper">
        <svg viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`} className="dm-svg" role="img" aria-label="Dependency map">
          {positioned
            .filter((node) => node.relationship !== 'target')
            .map((node) => (
              <line
                key={`edge-${node.id}`}
                x1={CENTER}
                y1={CENTER}
                x2={CENTER + node.x}
                y2={CENTER + node.y}
                stroke="#334155"
                strokeWidth={1.5}
                strokeDasharray={node.relationship === 'downstream_cascade' ? '4 4' : undefined}
              />
            ))}

          {positioned.map((node) => {
            const isSelected = node.id === selectedId
            const radius = node.relationship === 'target' ? 34 : 26
            return (
              <g
                key={node.id}
                transform={`translate(${CENTER + node.x}, ${CENTER + node.y})`}
                onClick={() => handleSelect(node)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  r={radius}
                  fill={CRITICALITY_COLOR[node.criticality]}
                  fillOpacity={isSelected ? 0.95 : 0.75}
                  stroke={isSelected ? '#f1f5f9' : '#0f172a'}
                  strokeWidth={isSelected ? 3 : 2}
                />
                <text
                  y={radius + 16}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#e2e8f0"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.name.length > 16 ? `${node.name.slice(0, 15)}…` : node.name}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="dm-side-panel">
        <div className="dm-legend">
          {(Object.keys(CRITICALITY_COLOR) as CriticalityLevel[]).map((level) => (
            <div key={level} className="dm-legend-item">
              <span className="dm-legend-dot" style={{ background: CRITICALITY_COLOR[level] }} />
              <span>{level}</span>
            </div>
          ))}
        </div>

        {selectedNode ? (
          <div className="dm-detail card">
            <h4 className="dm-detail-title">{selectedNode.name}</h4>
            <div className="dm-detail-row">
              <span className="dm-detail-label">Criticality</span>
              <span className="dm-detail-value" style={{ color: CRITICALITY_COLOR[selectedNode.criticality] }}>
                {selectedNode.criticality.toUpperCase()}
              </span>
            </div>
            <div className="dm-detail-row">
              <span className="dm-detail-label">Relationship</span>
              <span className="dm-detail-value">{selectedNode.relationship.replace('_', ' ')}</span>
            </div>
            {selectedNode.owner && (
              <div className="dm-detail-row">
                <span className="dm-detail-label">Owner</span>
                <span className="dm-detail-value">{selectedNode.owner}</span>
              </div>
            )}
            {selectedNode.processes && selectedNode.processes.length > 0 && (
              <div className="dm-detail-row">
                <span className="dm-detail-label">Processes</span>
                <span className="dm-detail-value">{selectedNode.processes.join(', ')}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="dm-detail card dm-empty">Select a node to see its details.</div>
        )}
      </div>

      <style>{`
        .dependency-map {
          display: grid;
          grid-template-columns: 1fr 260px;
          gap: 16px;
        }
        @media (max-width: 720px) {
          .dependency-map { grid-template-columns: 1fr; }
        }
        .dm-canvas-wrapper {
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 12px;
        }
        .dm-svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .dm-side-panel {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .dm-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 0.75rem;
          color: #94a3b8;
          text-transform: capitalize;
        }
        .dm-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dm-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }
        .dm-detail-title {
          margin: 0 0 10px 0;
          font-size: 0.95rem;
        }
        .dm-detail-row {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          padding: 6px 0;
          border-bottom: 1px solid #334155;
          font-size: 0.8rem;
        }
        .dm-detail-row:last-child { border-bottom: none; }
        .dm-detail-label { color: #64748b; }
        .dm-detail-value { color: #e2e8f0; text-align: right; }
        .dm-empty {
          color: #64748b;
          font-size: 0.85rem;
          text-align: center;
          padding: 20px 12px;
        }
      `}</style>
    </div>
  )
}

export default DependencyMap
