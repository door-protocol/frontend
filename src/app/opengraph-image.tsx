import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'DOOR Protocol - DeFi Fixed Income';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function OGImage() {
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
          <svg
            width="100"
            height="100"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 6 L7 26 L16 26 C22.5 26 26 22.5 26 16 C26 9.5 22.5 6 16 6 L7 6 Z M11 10 L16 10 C19.5 10 22 12.5 22 16 C22 19.5 19.5 22 16 22 L11 22 L11 10 Z"
              fill="#18181b"
            />
          </svg>
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
