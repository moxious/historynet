/**
 * GraphLegend component - Compact legend showing node type colors and emojis
 * 
 * Positioned in the bottom-left corner of the graph view to help users
 * understand what the different node colors and symbols mean.
 */

import type { NodeType } from '@types';
import { getNodeColor, getNodeTypeEmoji } from '@utils';
import './GraphLegend.css';

/**
 * Node type configuration for the legend
 */
interface NodeTypeConfig {
  type: NodeType;
  label: string;
}

const NODE_TYPES: NodeTypeConfig[] = [
  { type: 'person', label: 'Person' },
  { type: 'object', label: 'Object' },
  { type: 'location', label: 'Location' },
  { type: 'entity', label: 'Entity' },
];

interface GraphLegendProps {
  className?: string;
}

export function GraphLegend({ className = '' }: GraphLegendProps) {
  return (
    <div className={`graph-legend ${className}`} aria-label="Graph legend">
      <div className="graph-legend__items">
        {NODE_TYPES.map(({ type, label }) => (
          <div key={type} className="graph-legend__item">
            <span
              className="graph-legend__color"
              style={{ backgroundColor: getNodeColor(type) }}
              aria-hidden="true"
            />
            <span className="graph-legend__emoji" aria-hidden="true">
              {getNodeTypeEmoji(type)}
            </span>
            <span className="graph-legend__label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GraphLegend;
