import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Image metadata
export const alt = 'DOOR Protocol - DeFi Fixed Income';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function OGImage() {
  // Read the logo file and convert to base64
  const logoPath = join(process.cwd(), 'public', 'door-logo.webp');
  const logoBuffer = await readFile(logoPath);
  const logoBase64 = logoBuffer.toString('base64');
  const logoDataUrl = `data:image/webp;base64,${logoBase64}`;

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2563EB 0%, #EA580C 100%)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: '140px',
            height: '140px',
            background: 'rgba(255,255,255,0.98)',
            borderRadius: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
          }}
        >
          <img src={logoDataUrl} width="100" height="100" alt="DOOR Logo" />
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              textAlign: 'center',
              letterSpacing: '-0.02em',
            }}
          >
            DOOR Protocol
          </h1>
          <p
            style={{
              fontSize: '32px',
              color: 'rgba(255,255,255,0.9)',
              margin: 0,
              textAlign: 'center',
              fontWeight: '500',
            }}
          >
            Opening the Door to DeFi Fixed Income
          </p>
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            marginTop: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'white',
              fontSize: '24px',
            }}
          >
            <span>🛡️</span>
            <span>5.5% Senior APY</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'white',
              fontSize: '24px',
            }}
          >
            <span>⚔️</span>
            <span>15-30% Junior APY</span>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
