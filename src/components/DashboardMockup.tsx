import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Feature } from '../lib/featureData'
import Logo from './Logo'

function useTilt(max = 7) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 110, damping: 16 })
  const sy = useSpring(my, { stiffness: 110, damping: 16 })
  const rotY = useTransform(sx, [-0.5, 0.5], [-max, max])
  const rotX = useTransform(sy, [-0.5, 0.5], [max, -max])
  const handlers = {
    onPointerMove: (e: React.PointerEvent) => {
      const r = ref.current!.getBoundingClientRect()
      mx.set((e.clientX - r.left) / r.width - 0.5)
      my.set((e.clientY - r.top) / r.height - 0.5)
    },
    onPointerLeave: () => {
      mx.set(0)
      my.set(0)
    },
  }
  return { ref, rotX, rotY, handlers }
}

const BADGE: Record<string, string> = {
  Active: '#4ade80',
  Paid: '#4ade80',
  Done: '#4ade80',
  Ready: '#4ade80',
  Marked: '#4ade80',
  Sent: '#4ade80',
  Published: '#4ade80',
  Approved: '#4ade80',
  'On duty': '#4ade80',
  Pending: '#fbbf24',
  Due: '#fbbf24',
  Draft: '#fbbf24',
  Running: '#7cc4f2',
  Review: '#fbbf24',
  Leave: '#fbbf24',
  Transfer: '#7cc4f2',
  Marking: '#7cc4f2',
  Scheduled: '#7cc4f2',
}

/** Floating software window that previews the selected ZEDA module. */
export function ModuleWindow({ feature }: { feature: Feature }) {
  const { ref, rotX, rotY, handlers } = useTilt(6)
  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={ref}
        {...handlers}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
        className="panel-dark floaty overflow-hidden"
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-300/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          <span className="ml-3 text-[11px] text-white/60">app.zeda.school / {feature.key}</span>
        </div>
        <div className="grid grid-cols-[52px_1fr]">
          <div className="flex flex-col items-center gap-3 border-r border-white/10 bg-black/10 py-4">
            <Logo size={26} text={false} />
            {['▣', '◉', '▤', '◈'].map((s, i) => (
              <span key={i} className={`text-sm ${i === 1 ? 'text-sun' : 'text-white/40'}`}>
                {s}
              </span>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="p-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{feature.icon}</span>
                <h4 className="font-display text-base font-bold">{feature.title}</h4>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {feature.kpi.map((k) => (
                  <div key={k.label} className="rounded-none bg-white/10 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/60">{k.label}</div>
                    <div className="font-display text-xl font-extrabold text-sun">{k.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 divide-y divide-white/10 rounded-none bg-black/15">
                {feature.rows.map((r) => (
                  <div key={r[0]} className="flex items-center justify-between gap-2 px-3 py-2.5 text-xs">
                    <span className="font-semibold">{r[0]}</span>
                    <span className="text-white/60">{r[1]}</span>
                    <span className="flex items-center gap-1.5 text-white/80">
                      <i className="h-1.5 w-1.5 rounded-full" style={{ background: BADGE[r[2]] ?? '#9fdcbc' }} />
                      {r[2]}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

type Tab = 'performance' | 'attendance' | 'fees'

const SERIES: Record<Tab, { label: string; unit: string; data: number[]; insight: string }> = {
  performance: {
    label: 'Student Performance',
    unit: '%',
    data: [68, 71, 70, 74, 77, 79, 83, 86],
    insight: 'Class 8 Mathematics improved 9% after remedial sessions. 14 students flagged for early support.',
  },
  attendance: {
    label: 'Attendance Trend',
    unit: '%',
    data: [91, 93, 90, 94, 92, 95, 94, 96],
    insight: 'Mondays show the lowest attendance. A parent nudge on Sunday evening is predicted to lift it by 3%.',
  },
  fees: {
    label: 'Fee Collection',
    unit: 'L',
    data: [32, 35, 41, 38, 44, 47, 52, 56],
    insight: '₹6.1L is pending across 94 families. Auto-reminders tomorrow could recover roughly 70% within a week.',
  },
}
const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']

function LineChart({ data, color }: { data: number[]; color: string }) {
  const w = 320
  const h = 120
  const min = Math.min(...data) - 4
  const max = Math.max(...data) + 4
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / (max - min)) * h] as const)
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  return (
    <svg viewBox={`-6 -8 ${w + 12} ${h + 36}`} className="w-full" role="img" aria-label="Trend chart">
      <defs>
        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="0" x2={w} y1={(i * h) / 3} y2={(i * h) / 3} stroke="#fff" strokeOpacity=".1" />
      ))}
      <motion.path
        key={d + 'a'}
        d={`${d} L${w} ${h} L0 ${h} Z`}
        fill="url(#area)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        key={d}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 } as never}
        animate={{ pathLength: 1 } as never}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#0F3D2E" stroke={color} strokeWidth="2" />
      ))}
      {MONTHS.map((m, i) => (
        <text key={m} x={(i / 7) * w} y={h + 20} fontSize="10" fill="#fff" fillOpacity=".6" textAnchor="middle">
          {m}
        </text>
      ))}
    </svg>
  )
}

function Bars({ values, color }: { values: number[]; color: string }) {
  return (
    <div className="flex h-24 items-end gap-1.5">
      {values.map((v, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-none"
          style={{ background: i === values.length - 1 ? '#FFA24A' : color, opacity: i === values.length - 1 ? 1 : 0.55 + i * 0.05 }}
          initial={{ height: 0 }}
          animate={{ height: `${v}%` }}
          transition={{ duration: 0.7, delay: i * 0.05 }}
        />
      ))}
    </div>
  )
}

function Donut({ pct }: { pct: number }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 90 90" className="h-24 w-24" role="img" aria-label={`${pct}% collected`}>
      <circle cx="45" cy="45" r={r} fill="none" stroke="#fff" strokeOpacity=".14" strokeWidth="10" />
      <motion.circle
        cx="45"
        cy="45"
        r={r}
        fill="none"
        stroke="#FFA24A"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - pct / 100) }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        transform="rotate(-90 45 45)"
      />
      <text x="45" y="50" textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff">
        {pct}%
      </text>
    </svg>
  )
}

/** Animated analytics dashboard with switchable datasets and an "AI insight" that types itself out. */
export function AnalyticsDashboard() {
  const [tab, setTab] = useState<Tab>('performance')
  const s = SERIES[tab]
  const { ref, rotX, rotY, handlers } = useTilt(5)
  const growth = useMemo(() => Math.round(((s.data[7] - s.data[0]) / s.data[0]) * 100), [s])
  const bars = useMemo(() => s.data.map((v) => 35 + ((v - Math.min(...s.data)) / (Math.max(...s.data) - Math.min(...s.data) || 1)) * 60), [s])

  return (
    <div style={{ perspective: 1300 }}>
      <motion.div
        ref={ref}
        {...handlers}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
        className="panel-dark floaty overflow-hidden p-4 sm:p-5"
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1.5 rounded-full bg-white/10 p-1" role="tablist">
            {(Object.keys(SERIES) as Tab[]).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold capitalize transition ${
                  tab === k ? 'bg-sun text-white' : 'text-white/75 hover:text-white'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/50">Sample data</span>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.6fr_1fr]">
          <div className="rounded-none bg-black/15 p-4">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm font-semibold">{s.label}</h4>
              <span className="text-xs font-bold text-green-300">▲ {growth}% since April</span>
            </div>
            <LineChart data={s.data} color="#FFA24A" />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center gap-4 rounded-none bg-black/15 p-4">
              <Donut pct={tab === 'fees' ? 89 : tab === 'attendance' ? 96 : 84} />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-white/60">{tab === 'fees' ? 'Collected' : tab === 'attendance' ? 'Present' : 'Target met'}</div>
                <div className="font-display text-xl font-extrabold">Live</div>
              </div>
            </div>
            <div className="rounded-none bg-black/15 p-4">
              <div className="mb-2 text-[10px] uppercase tracking-wider text-white/60">Last 8 months</div>
              <Bars values={bars} color="#DDF3FF" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-3 rounded-none border border-sun/30 bg-sun/10 p-4">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sun text-sm text-white">✦</span>
          <p key={tab} className="text-[13px] leading-relaxed text-white/90">
            <b className="text-sun">AI insight · </b>
            {s.insight}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
