import { motion } from 'framer-motion'
import SectionShell from '../components/ScrollSections'
import GlassPanel from '../components/GlassPanel'
import { modal } from '../lib/modal'
import { scrollToSection } from '../lib/scroll'

export default function HomeSection() {
  return (
    <SectionShell id="home" vh={1.5}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
        <GlassPanel className="max-w-2xl p-7 sm:p-10">
          <span className="eyebrow">Zaltix Education Digital Access</span>
          <h1 className="text-shadow mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            Every School. <span className="text-sun">One Smart Ecosystem.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/85 sm:text-lg">
            Transform the way your school operates with one intelligent platform connecting administrators, teachers,
            students and parents.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => modal.open('demo')}>
              Book a Demo
            </button>
            <button className="btn btn-ghost" onClick={() => scrollToSection('about')}>
              Explore ZEDA <span aria-hidden>→</span>
            </button>
          </div>
        </GlassPanel>
        <div className="mt-8 hidden items-center gap-3 pl-2 text-xs font-bold uppercase tracking-[0.25em] text-white [text-shadow:0_2px_10px_rgba(0,0,0,.6)] md:flex">
          <span className="h-9 w-5 rounded-full border border-white p-1">
            <span className="block h-2 w-full animate-bounce rounded-full bg-sun" />
          </span>
          Scroll to enter the campus
        </div>
      </motion.div>
    </SectionShell>
  )
}
