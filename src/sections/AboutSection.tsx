import { motion } from 'framer-motion'
import SectionShell from '../components/ScrollSections'
import GlassPanel from '../components/GlassPanel'

const NODES = [
  { icon: '🏫', t: 'Administrators', d: 'Run admissions, fees, exams and reports from one command centre.' },
  { icon: '🧑‍🏫', t: 'Teachers', d: 'Attendance, marks and communication in a couple of taps.' },
  { icon: '🎒', t: 'Students', d: 'Timetables, homework, results and resources on their phone.' },
  { icon: '👨‍👩‍👧', t: 'Parents', d: 'Real-time visibility into attendance, fees and progress.' },
]

export default function AboutSection() {
  return (
    <SectionShell id="about" vh={1.5}>
      <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
        <GlassPanel className="p-7 sm:p-10">
          <span className="eyebrow">About ZEDA</span>
          <h2 className="text-shadow mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Education Deserves a <span className="text-sun">Smarter Ecosystem.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/85 sm:text-lg">
            ZEDA — Zaltix Education Digital Access — connects the complete school community through digital technology.
            Every gate, classroom and office shares one live source of truth, so information flows instead of getting
            stuck in registers, spreadsheets and chat groups.
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            {[
              ['1', 'platform'],
              ['3', 'mobile apps'],
              ['4', 'connected communities'],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-3xl font-extrabold text-sun">{n}</div>
                <div className="text-ink/70">{l}</div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <div className="grid gap-4 sm:grid-cols-2">
          {NODES.map((n, i) => (
            <motion.div
              key={n.t}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-10%' }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className={i % 2 ? 'sm:translate-y-8' : ''}
            >
              <GlassPanel float className="h-full p-5" style={{ animationDelay: `${i * 0.7}s` }}>
                <div className="mb-3 grid h-11 w-11 place-items-center rounded-none bg-sky-zeda text-2xl">{n.icon}</div>
                <h3 className="text-lg font-bold">{n.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/75">{n.d}</p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
