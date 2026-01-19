/**
 * Health Check API Endpoint
 *
 * Verifies that the serverless function infrastructure is working.
 * Returns JSON with status, timestamp, and environment info.
 *
 * @endpoint GET /api/health
 * @returns {object} { status: 'ok', timestamp: string, environment: string }
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Set CORS headers for cross-origin requests.
 * All Scenius API endpoints are public—data is not sensitive.
 */
function setCorsHeaders(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default function handler(
  req: VercelRequest,
  res: VercelResponse
): VercelResponse | void {
  setCorsHeaders(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check response
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || 'development',
  });
}
