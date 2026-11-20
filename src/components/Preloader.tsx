import { AnimatePresence, motion } from 'framer-motion'
import { LogoMark } from './Logo'

export default function Preloader({ ready }: { ready: boolean }) {
  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          key="pre"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-indigo-zeda"
        >
          <div className="flex flex-col items-center gap-5">
            <div className="animate-pulse">
              <LogoMark size={72} />
            </div>
            <p className="font-display text-sm tracking-[0.3em] text-sky-zeda/80">BUILDING THE CAMPUS…</p>
            <div className="h-0.5 w-40 overflow-hidden rounded bg-white/15">
              <motion.div
                className="h-full bg-sun"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
