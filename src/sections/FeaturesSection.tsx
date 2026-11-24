import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionShell from '../components/ScrollSections'
import GlassPanel from '../components/GlassPanel'
import { FEATURES, FEATURES_TITLE } from '../lib/content'
import { modal } from '../lib/modal'
import { Icon } from '../components/Icons'
import { scrollToSection } from '../lib/scroll'

/**
 * Features: a numbered index on the left and one rich detail card on the right.
 * The middle is intentionally clear so the 3D classroom behind stays visible.
 */
export default function FeaturesSection() {
  const [sel, setSel] = useState(0)
  const f = FEATURES[sel]

  return (
    <SectionShell id="features" vh={1.8}>
      <div className="grid items-center gap-6 lg:grid-cols-[400px_1fr_520px]">
        <div>
          <GlassPanel className="mb-3 px-5 py-4">
            <span className="eyebrow">Features</span>
            <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-[1.7rem]">
              Intelligent Features for <span className="text-sun">Smarter Schools</span>
            </h2>
          </GlassPanel>
          <ul className="grid gap-2" aria-label={FEATURES_TITLE}>
            {FEATURES.map((x, i) => {
              const on = sel === i
              return (
                <li key={x.key}>
                  <button
                    onClick={() => setSel(i)}
                    onMouseEnter={() => setSel(i)}
                    onFocus={() => setSel(i)}
                    aria-pressed={on}
                    className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border bg-white px-3 py-2.5 text-left text-ink transition duration-300 ${
                      on ? 'border-sun shadow-xl' : 'border-ink/10 hover:-translate-y-0.5 hover:shadow-lg'
                    }`}
                  >
                    <span className={`absolute inset-y-0 left-0 w-1.5 transition ${on ? 'bg-sun' : 'bg-transparent'}`} />
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-base font-bold transition ${
                        on ? 'bg-sun text-white' : 'bg-sky-zeda text-ink'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-bold leading-tight">{x.title}</span>
                      <span className="block truncate text-[11.5px] text-ink/60">{x.short}</span>
                    </span>
                    <span className={`shrink-0 transition ${on ? "text-sun" : "text-ink/55"}`}><Icon name={x.icon} size={22} /></span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="hidden lg:block" aria-hidden />

        <div>
          <AnimatePresence mode="wait">
            <motion.article
              key={f.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden rounded-xl bg-white text-ink shadow-2xl"
            >
              <header className="relative bg-gradient-to-br from-[#0e7c86] to-[#0b5d68] p-6 text-white">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#fbaf22]/25" />
                <div className="absolute -bottom-12 right-10 h-28 w-28 rounded-full bg-[#ee5a48]/25" />
                <div className="relative flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-xl bg-white text-[#0b5d68] shadow-lg"><Icon name={f.icon} size={30} stroke={1.7} /></span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffd36e]">
                      Feature {String(sel + 1).padStart(2, '0')} / {String(FEATURES.length).padStart(2, '0')}
                    </p>
                    <h3 className="font-display text-xl font-extrabold leading-tight sm:text-2xl">{f.title}</h3>
                  </div>
                </div>
              </header>
              <div className="p-6">
                <p className="text-[14.5px] leading-relaxed text-ink/80">{f.body}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {f.chips.map((c) => (
                    <li key={c} className="rounded-full bg-sky-zeda px-3 py-1 text-xs font-semibold text-ink">
                      {c}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button className="btn btn-primary" onClick={() => modal.open('demo')}>
                    Experience Medav.ai <span aria-hidden>→</span>
                  </button>
                  <button className="btn btn-ghost" onClick={() => scrollToSection('why')}>
                    Explore Features
                  </button>
                </div>
                <div className="mt-5 flex gap-1.5" aria-hidden>
                  {FEATURES.map((x, i) => (
                    <span key={x.key} className={`h-1.5 flex-1 rounded-full ${i === sel ? 'bg-sun' : 'bg-ink/10'}`} />
                  ))}
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </SectionShell>
  )
}
