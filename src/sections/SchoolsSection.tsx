import { motion } from 'framer-motion'
import SectionShell from '../components/ScrollSections'
import GlassPanel from '../components/GlassPanel'

const WHO = [
  { icon: '🏫', t: 'School Administrators', b: ['Complete visibility across the school', 'Faster fee collection & fewer errors', 'Reports ready in a click'] },
  { icon: '🧑‍🏫', t: 'Teachers', b: ['Attendance in seconds', 'Less paperwork, more teaching', 'Simple marks & homework entry'] },
  { icon: '🎒', t: 'Students', b: ['Timetable & homework always at hand', 'Instant exam results', 'Learning resources anywhere'] },
  { icon: '👨‍👩‍👧', t: 'Parents', b: ['Live attendance updates', 'Cashless fee payments', 'Direct line to teachers'] },
]

export default function SchoolsSection() {
  return (
    <SectionShell id="schools" vh={1.4}>
      <div className="text-center">
        <GlassPanel className="mx-auto mb-8 inline-block max-w-3xl px-6 py-6 sm:px-10">
          <span className="eyebrow">For Schools</span>
          <h2 className="text-shadow mt-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Built for Schools. <span className="text-sun">Designed for Growth.</span>
          </h2>
        </GlassPanel>
        <div className="grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
          {WHO.map((w, i) => (
            <motion.div
              key={w.t}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: '-8%' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <GlassPanel className="h-full p-6 transition hover:-translate-y-1.5">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-none bg-sky-zeda text-2xl">{w.icon}</div>
                <h3 className="text-lg font-bold">{w.t}</h3>
                <ul className="mt-3 space-y-2 text-sm text-ink/80">
                  {w.b.map((x) => (
                    <li key={x} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sun" />
                      {x}
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
