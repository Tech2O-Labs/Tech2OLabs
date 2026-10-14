import { ImageResponse } from 'next/og'

export const alt = 'Tech2O Labs — AI-speed delivery. Engineer-grade reliability.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: '#03080f', color: '#e6f6f4' }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, color: '#00ffc6' }}>
          <svg width="64" height="64" viewBox="0 0 128 128" style={{ marginRight: 16 }}>
            <circle cx="64" cy="64" r="45" fill="none" stroke="#00ffc6" strokeWidth="10" />
            <path d="M64 40C64 40 48 61 48 73a16 16 0 0 0 32 0C80 61 64 40 64 40Z" fill="#3b8cff" />
          </svg>
          Tech2O Labs
        </div>
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 24 }}>AI-speed delivery. Engineer-grade reliability.</div>
        <div style={{ display: 'flex', fontSize: 32, marginTop: 32, opacity: 0.7 }}>Software development company</div>
      </div>
    ),
    size,
  )
}
