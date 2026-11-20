import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionShell from '../components/ScrollSections'
import GlassPanel from '../components/GlassPanel'
import PhoneMockup from '../components/PhoneMockup'
import { APPS } from '../lib/appData'
import { useDevice } from '../hooks/useDevice'

export default function ApplicationsSection() {
  const [appIdx, setAppIdx] = useState(0)
  const [screens, setScreens] = useState([0, 0, 0])
  const { isMobile, isTablet } = useDevice()
  const app = APPS[appIdx]

  const setScreen = (i: number) => setScreens((s) => s.map((v, k) => (k === appIdx ? i : v)))
  const order = [(appIdx + 2) % 3, appIdx, (appIdx + 1) % 3] // active phone in the centre

  return (
    <SectionShell id="applications" vh={1.8}>
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
        <GlassPanel className="p-6 sm:p-9">
          <span className="eyebrow">Three Applications</span>
          <h2 className="text-shadow mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.7rem]">
            One Platform. <span className="text-sun">Three Powerful Applications.</span>
          </h2>

          <div className="mt-6 flex gap-1.5 bg-sky-zeda p-1" role="tablist" aria-label="Application">
            {APPS.map((a, i) => (
              <button
                key={a.id}
                role="tab"
                aria-selected={appIdx === i}
                onClick={() => setAppIdx(i)}
                className={`relative flex-1 px-3 py-2 text-sm font-semibold transition ${
                  appIdx === i ? 'text-white' : 'text-ink/80 hover:text-ink'
                }`}
              >
                {appIdx === i && (
                  <motion.span layoutId="app-pill" className="absolute inset-0 bg-sun" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <span className="relative">{a.name.replace(' App', '')}</span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-ink/80">{app.tagline}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {app.screens.map((s, i) => {
              const on = screens[appIdx] === i
              return (
                <li key={s.feature}>
                  <button
                    onClick={() => setScreen(i)}
                    onMouseEnter={() => setScreen(i)}
                    className={`flex w-full items-center gap-2.5 rounded-none border px-3.5 py-2.5 text-left text-sm font-medium transition ${
                      on ? 'border-sun bg-orange-50 text-ink' : 'border-ink/15 bg-white text-ink/80 hover:bg-sky-zeda'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${on ? 'bg-sun' : 'bg-ink/30'}`} />
                    {s.feature}
                  </button>
                </li>
              )
            })}
          </ul>
        </GlassPanel>

        {/* phones float in the foreground */}
        <div className="relative flex h-[520px] items-center justify-center sm:h-[560px]">
          {isMobile ? (
            <PhoneMockup app={app} screenIndex={screens[appIdx]} active scale={0.92} />
          ) : (
            order.map((ai, pos) => {
              const a = APPS[ai]
              const centre = pos === 1
              const dx = (pos - 1) * (isTablet ? 150 : 205)
              return (
                <motion.div
                  key={a.id}
                  className="absolute cursor-pointer"
                  animate={{
                    x: dx,
                    y: centre ? 0 : 34,
                    scale: centre ? 1 : 0.78,
                    rotateZ: (pos - 1) * 6,
                    zIndex: centre ? 3 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  onClick={() => setAppIdx(ai)}
                >
                  <PhoneMockup app={a} screenIndex={screens[ai]} active={centre} />
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </SectionShell>
  )
}
