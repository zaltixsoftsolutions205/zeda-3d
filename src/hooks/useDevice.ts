import { useEffect, useState } from 'react'
import { device } from '../lib/camState'

export interface DeviceInfo {
  tier: 0 | 1 | 2
  reduced: boolean
  isMobile: boolean
  isTablet: boolean
}

function read(): DeviceInfo {
  const w = window.innerWidth
  const tier: 0 | 1 | 2 = w < 768 ? 2 : w < 1100 ? 1 : 0
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  device.tier = tier
  device.reduced = reduced
  return { tier, reduced, isMobile: tier === 2, isTablet: tier === 1 }
}

export function useDevice(): DeviceInfo {
  const [info, setInfo] = useState<DeviceInfo>(() => read())
  useEffect(() => {
    const on = () => {
      const n = read()
      setInfo((o) => (o.tier === n.tier && o.reduced === n.reduced ? o : n))
    }
    window.addEventListener('resize', on)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener?.('change', on)
    return () => {
      window.removeEventListener('resize', on)
      mq.removeEventListener?.('change', on)
    }
  }, [])
  return info
}
