import { FormEvent, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { modal, useModal } from '../lib/modal'

export default function DemoModal() {
  const mode = useModal()
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!mode) return
    setSent(false)
    const on = (e: KeyboardEvent) => e.key === 'Escape' && modal.close()
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [mode])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true) // frontend only: no backend wired
  }

  const field =
    'w-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none transition focus:border-sun focus:bg-white/15'

  return (
    <AnimatePresence>
      {mode && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-indigo-deep/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => modal.close()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={mode === 'demo' ? 'Book a demo' : 'Contact us'}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 30, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="panel-dark w-full max-w-md p-7"
          >
            {sent ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-sun text-2xl text-white">✓</div>
                <h3 className="text-2xl font-bold">Thank you!</h3>
                <p className="mt-2 text-white/75">The ZEDA team will get in touch shortly.</p>
                <button className="btn btn-primary mt-6" onClick={() => modal.close()}>
                  Back to the campus
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{mode === 'demo' ? 'Book a Demo' : 'Contact ZEDA'}</h3>
                    <p className="mt-1 text-sm text-white/70">
                      {mode === 'demo' ? 'See ZEDA run your school, live.' : 'Tell us about your school.'}
                    </p>
                  </div>
                  <button type="button" onClick={() => modal.close()} aria-label="Close" className="rounded-full bg-white/10 px-3 py-1 text-lg">
                    ×
                  </button>
                </div>
                <input required className={field} placeholder="Your name" autoComplete="name" />
                <input required className={field} placeholder="School name" />
                <input required type="email" className={field} placeholder="Work email" autoComplete="email" />
                <input className={field} placeholder="Phone (optional)" autoComplete="tel" />
                <textarea className={`${field} min-h-[80px]`} placeholder="Number of students / message" />
                <button className="btn btn-primary w-full">{mode === 'demo' ? 'Request my demo' : 'Send message'}</button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
