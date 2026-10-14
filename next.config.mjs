// basic security headers for every route (no CSP: the JSON-LD and Next inline scripts would need nonces)
const headers = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

export default { async headers() { return [{ source: '/:path*', headers }] } }
