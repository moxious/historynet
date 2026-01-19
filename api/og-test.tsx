/**
 * Minimal OG image test endpoint
 * Tests if @vercel/og works at all with the simplest possible case
 */
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#3b82f6',
          color: 'white',
          fontSize: 80,
          fontFamily: 'sans-serif',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Test Image
      </div>
    ),
    {
      width: 400,
      height: 200,
    }
  );
}
