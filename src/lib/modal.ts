import { useSyncExternalStore } from 'react'

type Mode = 'demo' | 'contact' | null
let mode: Mode = null
const subs = new Set<() => void>()
const emit = () => subs.forEach((s) => s())

export const modal = {
  open(m: Exclude<Mode, null>) {
    mode = m
    emit()
  },
  close() {
    mode = null
    emit()
  },
}

export function useModal(): Mode {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb)
      return () => subs.delete(cb)
    },
    () => mode,
    () => null,
  )
}
