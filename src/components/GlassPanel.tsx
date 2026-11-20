import { HTMLAttributes, ReactNode } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  light?: boolean
  float?: boolean
}

/** Translucent blurred panel – the only surface used over the 3D world, so text stays readable. */
export default function GlassPanel({ children, light, float, className = '', ...rest }: Props) {
  return (
    <div
      className={`${light ? 'glass-light' : 'glass'} ${float ? 'floaty' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
