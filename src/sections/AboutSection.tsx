import { motion } from 'framer-motion'
import SectionShell from '../components/ScrollSections'
import GlassPanel from '../components/GlassPanel'
import { FUTURE } from '../lib/content'
import { Icon } from '../components/Icons'

export default function AboutSection() {
  return (
    <SectionShell id="about" vh={1.5}>
      <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
        <GlassPanel className="p-7 sm:p-10">
          <span className="eyebrow">{FUTURE.eyebrow}</span>
          <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.6rem]">
            Your School Deserves More Than <span className="text-sun">Just Software.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/80 sm:text-lg">{FUTURE.body}</p>
        </GlassPanel>

        <div className="grid gap-4 sm:grid-cols-2">
          {FUTURE.steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, margin: '-10%' }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
            >
              <GlassPanel className="h-full p-5">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-extrabold text-sun">{s.n}</span>
                  <span className="grid h-11 w-11 place-items-center rounded-xl border-[1.5px] border-[#0b5d68]/25 bg-sky-zeda text-ink"><Icon name={s.icon} size={24} /></span>
                </div>
                <h3 className="mt-3 text-lg font-bold">{s.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/75">{s.d}</p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
