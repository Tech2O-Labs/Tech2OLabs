// logo mark: a ripple "O" with a water drop; the wordmark stays live text so it is crawlable and uses the site font
export default function Logo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" aria-hidden="true" focusable="false">
      <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#00ffc6" /><stop offset="1" stopColor="#3b8cff" /></linearGradient></defs>
      <circle cx="64" cy="64" r="59" fill="none" stroke="url(#lg)" strokeWidth="2.5" opacity=".35" />
      <circle cx="64" cy="64" r="45" fill="none" stroke="url(#lg)" strokeWidth="10" />
      <path d="M64 40C64 40 48 61 48 73a16 16 0 0 0 32 0C80 61 64 40 64 40Z" fill="url(#lg)" />
    </svg>
  )
}
