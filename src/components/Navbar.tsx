import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'
import { modal } from '../lib/modal'
import { scrollToSection } from '../lib/scroll'
import { sectionCenter } from '../lib/scroll'
import { SECTION_IDS } from '../lib/camState'

const LINKS = [
  ['home', 'Home'],
  ['about', 'About'],
  ['applications', 'Applications'],
  ['features', 'Features'],
  ['analytics', 'AI Analytics'],
  ['schools', 'For Schools'],
  ['contact', 'Contact'],
] as const

export default function Navbar() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 40)
        let best = 0
        let bd = Infinity
        SECTION_IDS.forEach((id, i) => {
          const el = document.getElementById(id)
          if (!el) return
          const d = Math.abs(sectionCenter(el) - y)
          if (d < bd) {
            bd = d
            best = i
          }
        })
        setActive(best)
      })
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [])

  const go = (id: string) => {
    setOpen(false)
    scrollToSection(id)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav
        className={`panel-dark mx-auto flex max-w-6xl items-center justify-between py-2 pl-4 pr-2 transition-all duration-500 ${
          scrolled ? 'shadow-2xl' : ''
        }`}
        aria-label="Primary"
      >
        <button onClick={() => go('home')} aria-label="ZEDA – back to top" className="rounded-full">
          <Logo size={34} />
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map(([id, label], i) => (
            <li key={id}>
              <button
                onClick={() => go(id)}
                aria-current={active === i ? 'true' : undefined}
                className={`relative rounded-full px-3.5 py-2 text-[13px] font-medium transition ${
                  active === i ? 'text-white' : 'text-white/80 hover:text-white'
                }`}
              >
                {active === i && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-sun"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button className="btn btn-primary !px-5 !py-2.5" onClick={() => modal.open('demo')}>
            Book a Demo
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 lg:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-5 bg-white transition ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
              <span className={`absolute bottom-0 left-0 h-0.5 w-5 bg-white transition ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="panel-dark mx-auto mt-2 max-w-6xl p-3 lg:hidden"
          >
            {LINKS.map(([id, label], i) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`block w-full px-4 py-3 text-left text-sm font-medium ${
                  active === i ? 'bg-sun text-white' : 'text-white/90'
                }`}
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
