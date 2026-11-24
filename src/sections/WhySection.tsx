import { motion } from 'framer-motion'
import SectionShell from '../components/ScrollSections'
import GlassPanel from '../components/GlassPanel'
import { WHY } from '../lib/content'

export default function WhySection() {
  return (
    <SectionShell id="why" vh={1.7}>
      <div className="grid items-start gap-6 lg:grid-cols-[400px_1fr]">
        <GlassPanel className="p-6">
          <span className="eyebrow">{WHY.eyebrow}</span>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight sm:text-[1.7rem]">
            Not Just School Management. <span className="text-sun">The Intelligence to Transform Your School.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink/75">{WHY.body}</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink">
            <span className="h-2 w-2 rounded-full bg-sun" />
            {WHY.listTitle}
          </p>
        </GlassPanel>

        <div className="grid gap-3 sm:grid-cols-2">
          {WHY.reasons.map((r, i) => (
            <motion.div
              key={r.n}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: '-8%' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <GlassPanel className="h-full p-4 transition hover:-translate-y-1">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sun text-sm font-extrabold text-white">
                    {r.n}
                  </span>
                  <div>
                    <h3 className="text-[14.5px] font-bold leading-snug">{r.t}</h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink/75">{r.d}</p>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
