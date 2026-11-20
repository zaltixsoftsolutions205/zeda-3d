export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="ZEDA">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1F6B4E" />
          <stop offset="1" stopColor="#0F3D2E" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#lg)" />
      <rect x="1" y="1" width="62" height="62" rx="15" fill="none" stroke="#CFEBDD" strokeOpacity=".35" />
      <path d="M16 18h32v7L27 41h21v7H16v-7l21-16H16z" fill="#F28C28" />
      <circle cx="49" cy="16" r="3.5" fill="#CFEBDD" />
    </svg>
  )
}

export default function Logo({ size = 36, text = true, dark = false }: { size?: number; text?: boolean; dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      {text && (
        <span className={`font-display text-xl font-extrabold tracking-tight ${dark ? 'text-ink' : 'text-white'}`}>
          ZEDA
        </span>
      )}
    </span>
  )
}
