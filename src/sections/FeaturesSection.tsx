import { useState } from 'react'
import SectionShell from '../components/ScrollSections'
import GlassPanel from '../components/GlassPanel'
import { ModuleWindow } from '../components/DashboardMockup'
import { FEATURES } from '../lib/featureData'

export default function FeaturesSection() {
  const [sel, setSel] = useState(0)
  return (
    <SectionShell id="features" vh={1.8}>
      <div className="grid items-center gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <GlassPanel className="mb-4 px-6 py-5 sm:px-8">
            <span className="eyebrow">Features</span>
            <h2 className="text-shadow mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              Everything Your School Needs. <span className="text-sun">In One Place.</span>
            </h2>
          </GlassPanel>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-5">
            {FEATURES.map((f, i) => (
              <button
                key={f.key}
                onClick={() => setSel(i)}
                onMouseEnter={() => setSel(i)}
                onFocus={() => setSel(i)}
                aria-pressed={sel === i}
                className={`group glass rounded-none p-3.5 text-left transition duration-300 hover:-translate-y-1 ${
                  sel === i ? '!bg-orange-50 !border-t-sun shadow-xl' : ''
                }`}
              >
                <span className="text-xl">{f.icon}</span>
                <h3 className="mt-1.5 text-[13px] font-bold leading-tight">{f.title}</h3>
                <p className="mt-1 hidden text-[11px] leading-snug text-ink/65 xl:block">{f.blurb}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2 lg:mt-0">
          <ModuleWindow feature={FEATURES[sel]} />
          <p className="mt-3 bg-white px-4 py-2.5 text-center text-sm font-semibold text-ink lg:text-left">{FEATURES[sel].blurb}</p>
        </div>
      </div>
    </SectionShell>
  )
}
