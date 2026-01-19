/** @jsxImportSource react */
/**
 * Dynamic OG Image Generation API
 *
 * Generates Open Graph images for social sharing using @vercel/og.
 * Supports datasets, nodes, and edges with appropriate visual design.
 *
 * @endpoint GET /api/og
 * @query dataset - Dataset ID (optional)
 * @query node - Node ID for node-specific images (optional)
 * @query sourceId - Source node ID for edge images (optional)
 * @query targetId - Target node ID for edge images (optional)
 *
 * Part of M33: Social Sharing & Dynamic OG
 */
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

// Production base URL for fetching dataset files
const PRODUCTION_BASE_URL = 'https://scenius-seven.vercel.app';

/**
 * Get the base URL for fetching dataset files.
 * In production, uses the production domain.
 * In development, uses the request origin to allow local testing.
 */
function getBaseUrl(requestUrl: string): string {
  try {
    const url = new URL(requestUrl);
    // In production on Vercel, use the request origin
    // In local dev, also use request origin (e.g., http://localhost:3002)
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      return url.origin;
    }
    // In production, use the production domain for consistent caching
    return PRODUCTION_BASE_URL;
  } catch {
    return PRODUCTION_BASE_URL;
  }
}

// OG Image dimensions (standard: 1200×630)
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Types for dataset files
interface DatasetManifest {
  id: string;
  name: string;
  description: string;
  bannerEmoji?: string;
  temporalScope?: string;
  nodeCount?: number;
  edgeCount?: number;
}

interface DatasetNode {
  id: string;
  type: 'person' | 'object' | 'location' | 'entity';
  title: string;
  shortDescription?: string;
  biography?: string;
  dateStart?: string;
  dateEnd?: string;
}

interface DatasetEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  evidence?: string;
}

// Color scheme matching the app's theme
const COLORS = {
  background: '#1a1f2e',
  backgroundGradientEnd: '#0f1219',
  text: '#e5e7eb',
  textMuted: '#9ca3af',
  accent: '#6366f1',
  accentLight: '#818cf8',
  person: '#60a5fa',
  object: '#f472b6',
  location: '#34d399',
  entity: '#fbbf24',
};

/**
 * Fetch JSON from a URL with error handling
 */
async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }
    return await response.json() as T;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

/**
 * Get type-specific color for nodes
 */
function getTypeColor(type: string): string {
  switch (type) {
    case 'person':
      return COLORS.person;
    case 'object':
      return COLORS.object;
    case 'location':
      return COLORS.location;
    case 'entity':
      return COLORS.entity;
    default:
      return COLORS.text;
  }
}

/**
 * Get type label for display
 */
function getTypeLabel(type: string): string {
  switch (type) {
    case 'person':
      return 'Person';
    case 'object':
      return 'Work';
    case 'location':
      return 'Location';
    case 'entity':
      return 'Organization';
    default:
      return type;
  }
}

/**
 * Truncate text to a maximum length
 */
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Generate the default/homepage OG image
 */
function generateDefaultImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${COLORS.background} 0%, ${COLORS.backgroundGradientEnd} 100%)`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Network decoration */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            opacity: 0.15,
          }}
        >
          {/* Decorative circles representing nodes */}
          <div style={{ position: 'absolute', top: 80, left: 120, width: 60, height: 60, borderRadius: '50%', background: COLORS.person, display: 'flex' }} />
          <div style={{ position: 'absolute', top: 200, left: 200, width: 40, height: 40, borderRadius: '50%', background: COLORS.object, display: 'flex' }} />
          <div style={{ position: 'absolute', top: 120, right: 180, width: 50, height: 50, borderRadius: '50%', background: COLORS.location, display: 'flex' }} />
          <div style={{ position: 'absolute', bottom: 150, left: 150, width: 45, height: 45, borderRadius: '50%', background: COLORS.entity, display: 'flex' }} />
          <div style={{ position: 'absolute', bottom: 100, right: 200, width: 55, height: 55, borderRadius: '50%', background: COLORS.person, display: 'flex' }} />
          <div style={{ position: 'absolute', top: 280, right: 100, width: 35, height: 35, borderRadius: '50%', background: COLORS.object, display: 'flex' }} />
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            textAlign: 'center',
          }}
        >
          {/* Logo/Brand mark */}
          <div
            style={{
              fontSize: 72,
              marginBottom: 24,
              display: 'flex',
            }}
          >
            🌐
          </div>

          {/* App name */}
          <h1
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: COLORS.text,
              margin: 0,
              marginBottom: 16,
              display: 'flex',
            }}
          >
            Scenius
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontSize: 32,
              color: COLORS.textMuted,
              margin: 0,
              display: 'flex',
            }}
          >
            Mapping Collective Genius
          </p>

          {/* Description */}
          <p
            style={{
              fontSize: 24,
              color: COLORS.textMuted,
              margin: 0,
              marginTop: 32,
              maxWidth: 800,
              display: 'flex',
            }}
          >
            Explore historical networks of collaboration and influence
          </p>
        </div>
      </div>
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
    }
  );
}

/**
 * Generate OG image for a dataset
 */
function generateDatasetImage(manifest: DatasetManifest): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, ${COLORS.background} 0%, ${COLORS.backgroundGradientEnd} 100%)`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: 60,
        }}
      >
        {/* Header with Scenius branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <span style={{ fontSize: 32, marginRight: 12, display: 'flex' }}>🌐</span>
          <span
            style={{
              fontSize: 28,
              color: COLORS.textMuted,
              display: 'flex',
            }}
          >
            Scenius
          </span>
        </div>

        {/* Dataset emoji */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 24,
            display: 'flex',
          }}
        >
          {manifest.bannerEmoji || '📚'}
        </div>

        {/* Dataset name */}
        <h1
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.text,
            margin: 0,
            marginBottom: 16,
            display: 'flex',
          }}
        >
          {manifest.name}
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: 26,
            color: COLORS.textMuted,
            margin: 0,
            marginBottom: 32,
            maxWidth: 900,
            lineHeight: 1.4,
            display: 'flex',
          }}
        >
          {truncate(manifest.description, 150)}
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            marginTop: 'auto',
          }}
        >
          {manifest.temporalScope && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                background: 'rgba(99, 102, 241, 0.2)',
                borderRadius: 12,
              }}
            >
              <span style={{ fontSize: 24, color: COLORS.accentLight, display: 'flex' }}>
                📅 {manifest.temporalScope}
              </span>
            </div>
          )}
          {manifest.nodeCount && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                background: 'rgba(99, 102, 241, 0.2)',
                borderRadius: 12,
              }}
            >
              <span style={{ fontSize: 24, color: COLORS.accentLight, display: 'flex' }}>
                {manifest.nodeCount} nodes
              </span>
            </div>
          )}
          {manifest.edgeCount && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                background: 'rgba(99, 102, 241, 0.2)',
                borderRadius: 12,
              }}
            >
              <span style={{ fontSize: 24, color: COLORS.accentLight, display: 'flex' }}>
                {manifest.edgeCount} connections
              </span>
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
    }
  );
}

/**
 * Generate OG image for a node
 */
function generateNodeImage(
  manifest: DatasetManifest,
  node: DatasetNode
): ImageResponse {
  const typeColor = getTypeColor(node.type);
  const typeLabel = getTypeLabel(node.type);
  const description = node.shortDescription || node.biography || '';

  // Format date range
  let dateRange = '';
  if (node.dateStart) {
    const startYear = node.dateStart.slice(0, 4);
    if (node.dateEnd) {
      const endYear = node.dateEnd.slice(0, 4);
      dateRange = `${startYear} – ${endYear}`;
    } else {
      dateRange = node.type === 'person' ? `b. ${startYear}` : startYear;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, ${COLORS.background} 0%, ${COLORS.backgroundGradientEnd} 100%)`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: 60,
        }}
      >
        {/* Header with Scenius branding and dataset */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <span style={{ fontSize: 28, marginRight: 12, display: 'flex' }}>🌐</span>
          <span
            style={{
              fontSize: 24,
              color: COLORS.textMuted,
              display: 'flex',
            }}
          >
            Scenius
          </span>
          <span
            style={{
              fontSize: 24,
              color: COLORS.textMuted,
              margin: '0 16px',
              display: 'flex',
            }}
          >
            /
          </span>
          <span
            style={{
              fontSize: 24,
              color: COLORS.textMuted,
              display: 'flex',
            }}
          >
            {manifest.name}
          </span>
        </div>

        {/* Type badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              padding: '8px 20px',
              background: typeColor,
              borderRadius: 8,
              display: 'flex',
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: 1,
                display: 'flex',
              }}
            >
              {typeLabel}
            </span>
          </div>
        </div>

        {/* Node title */}
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.text,
            margin: 0,
            marginBottom: 16,
            display: 'flex',
          }}
        >
          {truncate(node.title, 50)}
        </h1>

        {/* Date range */}
        {dateRange && (
          <p
            style={{
              fontSize: 28,
              color: typeColor,
              margin: 0,
              marginBottom: 24,
              display: 'flex',
            }}
          >
            {dateRange}
          </p>
        )}

        {/* Description */}
        <p
          style={{
            fontSize: 26,
            color: COLORS.textMuted,
            margin: 0,
            maxWidth: 900,
            lineHeight: 1.4,
            display: 'flex',
          }}
        >
          {truncate(description, 180)}
        </p>

        {/* Footer decoration */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginTop: 'auto',
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: typeColor,
              display: 'flex',
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: typeColor,
              opacity: 0.6,
              display: 'flex',
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: typeColor,
              opacity: 0.3,
              display: 'flex',
            }}
          />
        </div>
      </div>
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
    }
  );
}

/**
 * Generate OG image for an edge (relationship between nodes)
 */
function generateEdgeImage(
  manifest: DatasetManifest,
  sourceNode: DatasetNode,
  targetNode: DatasetNode,
  edge: DatasetEdge
): ImageResponse {
  const sourceColor = getTypeColor(sourceNode.type);
  const targetColor = getTypeColor(targetNode.type);

  // Format relationship for display
  const relationship = edge.relationship.replace(/_/g, ' ');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, ${COLORS.background} 0%, ${COLORS.backgroundGradientEnd} 100%)`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: 60,
        }}
      >
        {/* Header with Scenius branding and dataset */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <span style={{ fontSize: 28, marginRight: 12, display: 'flex' }}>🌐</span>
          <span
            style={{
              fontSize: 24,
              color: COLORS.textMuted,
              display: 'flex',
            }}
          >
            Scenius
          </span>
          <span
            style={{
              fontSize: 24,
              color: COLORS.textMuted,
              margin: '0 16px',
              display: 'flex',
            }}
          >
            /
          </span>
          <span
            style={{
              fontSize: 24,
              color: COLORS.textMuted,
              display: 'flex',
            }}
          >
            {manifest.name}
          </span>
        </div>

        {/* Connection visualization */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            gap: 40,
          }}
        >
          {/* Source node */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: 350,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: sourceColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 36, color: '#fff', display: 'flex' }}>
                {sourceNode.title[0]}
              </span>
            </div>
            <p
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: COLORS.text,
                margin: 0,
                textAlign: 'center',
                display: 'flex',
              }}
            >
              {truncate(sourceNode.title, 25)}
            </p>
            <p
              style={{
                fontSize: 20,
                color: sourceColor,
                margin: 0,
                marginTop: 8,
                textTransform: 'uppercase',
                letterSpacing: 1,
                display: 'flex',
              }}
            >
              {getTypeLabel(sourceNode.type)}
            </p>
          </div>

          {/* Relationship arrow */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 32px',
                background: 'rgba(99, 102, 241, 0.2)',
                borderRadius: 12,
              }}
            >
              <span
                style={{
                  fontSize: 24,
                  color: COLORS.accentLight,
                  display: 'flex',
                }}
              >
                {relationship}
              </span>
            </div>
            <div
              style={{
                fontSize: 32,
                color: COLORS.accent,
                marginTop: 8,
                display: 'flex',
              }}
            >
              →
            </div>
          </div>

          {/* Target node */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: 350,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: targetColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 36, color: '#fff', display: 'flex' }}>
                {targetNode.title[0]}
              </span>
            </div>
            <p
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: COLORS.text,
                margin: 0,
                textAlign: 'center',
                display: 'flex',
              }}
            >
              {truncate(targetNode.title, 25)}
            </p>
            <p
              style={{
                fontSize: 20,
                color: targetColor,
                margin: 0,
                marginTop: 8,
                textTransform: 'uppercase',
                letterSpacing: 1,
                display: 'flex',
              }}
            >
              {getTypeLabel(targetNode.type)}
            </p>
          </div>
        </div>

        {/* Evidence footer */}
        {edge.evidence && (
          <p
            style={{
              fontSize: 20,
              color: COLORS.textMuted,
              margin: 0,
              marginTop: 20,
              fontStyle: 'italic',
              display: 'flex',
            }}
          >
            "{truncate(edge.evidence, 100)}"
          </p>
        )}
      </div>
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
    }
  );
}

/**
 * Main handler for OG image generation
 */
export default async function handler(request: Request): Promise<ImageResponse> {
  try {
    // Parse query parameters
    // SECURITY: constructed URL with URL API (F3)
    const url = new URL(request.url);
    const dataset = url.searchParams.get('dataset');
    const nodeId = url.searchParams.get('node');
    const sourceId = url.searchParams.get('sourceId');
    const targetId = url.searchParams.get('targetId');

    // No dataset specified - return default image
    if (!dataset) {
      return generateDefaultImage();
    }

    // Get base URL for fetching (respects local dev environment)
    const baseUrl = getBaseUrl(request.url);

    // Fetch manifest
    const manifestUrl = new URL(`/datasets/${dataset}/manifest.json`, baseUrl);
    const manifest = await fetchJson<DatasetManifest>(manifestUrl.toString());

    if (!manifest) {
      // Dataset not found - return default image
      return generateDefaultImage();
    }

    // Edge image (both sourceId and targetId provided)
    if (sourceId && targetId) {
      const nodesUrl = new URL(`/datasets/${dataset}/nodes.json`, baseUrl);
      const edgesUrl = new URL(`/datasets/${dataset}/edges.json`, baseUrl);

      const [nodes, edges] = await Promise.all([
        fetchJson<DatasetNode[]>(nodesUrl.toString()),
        fetchJson<DatasetEdge[]>(edgesUrl.toString()),
      ]);

      if (!nodes || !edges) {
        return generateDatasetImage(manifest);
      }

      const sourceNode = nodes.find((n) => n.id === sourceId);
      const targetNode = nodes.find((n) => n.id === targetId);
      const edge = edges.find(
        (e) =>
          (e.source === sourceId && e.target === targetId) ||
          (e.source === targetId && e.target === sourceId)
      );

      if (!sourceNode || !targetNode || !edge) {
        return generateDatasetImage(manifest);
      }

      return generateEdgeImage(manifest, sourceNode, targetNode, edge);
    }

    // Node image (nodeId provided)
    if (nodeId) {
      const nodesUrl = new URL(`/datasets/${dataset}/nodes.json`, baseUrl);
      const nodes = await fetchJson<DatasetNode[]>(nodesUrl.toString());

      if (!nodes) {
        return generateDatasetImage(manifest);
      }

      const node = nodes.find((n) => n.id === nodeId);

      if (!node) {
        return generateDatasetImage(manifest);
      }

      return generateNodeImage(manifest, node);
    }

    // Dataset-only image
    return generateDatasetImage(manifest);
  } catch (error) {
    console.error('OG image generation error:', error);
    return generateDefaultImage();
  }
}
