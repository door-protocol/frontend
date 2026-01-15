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
export const runtime = 'nodejs';

// Image generation
export default async function OGImage() {
  // Read the logo file and convert to base64
  const logoPath = join(process.cwd(), 'public', 'door-logo.png');
  const logoBuffer = await readFile(logoPath);
  const logoBase64 = logoBuffer.toString('base64');
  const logoDataUrl = `data:image/png;base64,${logoBase64}`;

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2563EB',
        backgroundImage: 'linear-gradient(135deg, #2563EB 0%, #EA580C 100%)',
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.05)',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
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
            marginBottom: '40px',
          }}
        >
          <img src={logoDataUrl} width={100} height={100} alt="DOOR Logo" />
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
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
              marginBottom: '20px',
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
            marginTop: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              fontSize: '28px',
              marginRight: '40px',
            }}
          >
            Senior APY: 5.5%
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              fontSize: '28px',
            }}
          >
            Junior APY: 15-30%
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
