import { motion } from 'framer-motion'
import SectionShell from '../components/ScrollSections'
import GlassPanel from '../components/GlassPanel'
import { modal } from '../lib/modal'
import { HERO } from '../lib/content'

export default function HomeSection() {
  return (
    <SectionShell id="home" vh={1.5}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
        <GlassPanel className="max-w-2xl p-7 sm:p-10">
          <span className="eyebrow">{HERO.eyebrow}</span>
          <h1 className="mt-5 text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-[2.9rem]">
            Your <span className="text-sun">AI-Native</span> School Management Operating System.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/80">{HERO.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => modal.open('demo')}>
              {HERO.cta1}
            </button>
            <button className="btn btn-ghost" onClick={() => modal.open('demo')}>
              {HERO.cta2}
            </button>
          </div>
        </GlassPanel>
      </motion.div>
    </SectionShell>
  )
}
