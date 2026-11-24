/** Round Medav emblem (the "ED" play-button circle). Used where only a small mark fits. */
export function LogoMark({ size = 36 }: { size?: number }) {
  return <img src="/medav-mark.png" width={size} height={size} alt="Medav" draggable={false} className="select-none" />
}

/** Full Medav wordmark. It sits on a white pill so the teal lettering stays readable on dark bars. */
export default function Logo({ size = 36, text = true }: { size?: number; text?: boolean; dark?: boolean }) {
  if (!text) return <LogoMark size={size} />
  return (
    <span className="inline-flex items-center">
      <img
        src="/medav-wordmark.png"
        alt="Medav"
        height={size}
        style={{ height: size, width: 'auto' }}
        draggable={false}
        className="select-none"
      />
    </span>
  )
}
