import { useRef } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { AppDef } from '../lib/appData'

const TONE = { ok: '#4ade80', warn: '#fbbf24', info: '#7cc4f2' }

/** CSS-3D smartphone: tilts toward the pointer, shows a live, switchable app screen. */
export default function PhoneMockup({
  app,
  screenIndex,
  active,
  scale = 1,
}: {
  app: AppDef
  screenIndex: number
  active: boolean
  scale?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 14 })
  const sy = useSpring(my, { stiffness: 120, damping: 14 })
  const rotY = useTransform(sx, [-0.5, 0.5], [-16, 16])
  const rotX = useTransform(sy, [-0.5, 0.5], [12, -12])
  const sc = app.screens[screenIndex % app.screens.length]

  const move = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <div style={{ perspective: 1100 }} className="select-none">
      <motion.div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={() => {
          mx.set(0)
          my.set(0)
        }}
        style={{ rotateX: rotX, rotateY: rotY, scale, transformStyle: 'preserve-3d' }}
        className="relative h-[480px] w-[236px] rounded-[2.6rem] p-[9px]"
      >
        <div
          className="absolute inset-0 rounded-[2.6rem]"
          style={{
            background: 'linear-gradient(145deg,#2c7a58,#0f3d2e 60%,#051e15)',
            boxShadow: '0 40px 70px -20px rgba(8,8,40,.7), inset 0 0 0 1.5px rgba(221,243,255,.35)',
          }}
        />
        <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-[#f4f8ff] text-ink" style={{ transform: 'translateZ(14px)' }}>
          <div className="absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
          <div className="px-4 pb-2 pt-8" style={{ background: '#0F3D2E', color: '#fff' }}>
            <div className="flex items-center justify-between text-[9px] opacity-80">
              <span>{app.name}</span>
              <span>{app.who}</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.h4
                key={sc.title}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-1 font-display text-[15px] font-bold"
              >
                {sc.title}
              </motion.h4>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={app.id + sc.title}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.25 }}
              className="space-y-2.5 p-3"
            >
              <div className="rounded-2xl p-3" style={{ background: app.accent }}>
                <div className="text-[9px] font-semibold uppercase tracking-wider opacity-70">{sc.stat.label}</div>
                <div className="font-display text-2xl font-extrabold">{sc.stat.value}</div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#0F3D2E]/15">
                  <motion.div
                    className="h-full rounded-full bg-[#0F3D2E]"
                    initial={{ width: 0 }}
                    animate={{ width: `${sc.stat.pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
              {sc.rows.map((r) => (
                <div key={r.t} className="flex items-center gap-2 rounded-xl bg-white p-2.5 shadow-sm">
                  <span className="h-6 w-6 shrink-0 rounded-lg" style={{ background: TONE[r.tone ?? 'info'] + '55', border: `1.5px solid ${TONE[r.tone ?? 'info']}` }} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11px] font-semibold">{r.t}</div>
                    <div className="truncate text-[9px] opacity-60">{r.s}</div>
                  </div>
                  {r.r && <div className="text-[10px] font-bold">{r.r}</div>}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 flex justify-around border-t border-black/5 bg-white/90 py-2">
            {app.screens.map((s, i) => (
              <span
                key={s.feature}
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: i === screenIndex % app.screens.length ? '#0F3D2E' : '#0F3D2E33' }}
              />
            ))}
          </div>
          {!active && <div className="absolute inset-0 bg-indigo-deep/25" />}
        </div>
        {/* glass reflection */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[2.6rem]"
          style={{ background: 'linear-gradient(120deg, rgba(255,255,255,.22), transparent 35%)', transform: 'translateZ(30px)' }}
        />
      </motion.div>
    </div>
  )
}
