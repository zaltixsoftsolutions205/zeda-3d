import { ReactNode, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useDevice } from '../hooks/useDevice'

interface Props {
  id: string
  /** Section height in viewport heights on desktop (taller = longer camera dwell / pinned storytelling). */
  vh?: number
  align?: 'left' | 'right' | 'center'
  children: ReactNode
}

/**
 * Transparent overlay section. On desktop the content is `sticky` (pinned) while the camera travels,
 * then fades out as the next location takes over. On small screens it flows naturally.
 */
export default function SectionShell({ id, vh = 1.5, children }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { isMobile, reduced } = useDevice()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.8, 1], [0, 0, -50])

  return (
    <section
      ref={ref}
      id={id}
      data-section
      className="relative md:!h-[var(--sh)]"
      style={{ ['--sh' as string]: `${vh * 100}vh` }}
    >
      <motion.div
        style={reduced || isMobile ? undefined : { opacity, y }}
        className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-24 sm:px-8 md:sticky md:top-0 md:h-screen md:min-h-0 md:py-0"
      >
        <div className="w-full">{children}</div>
      </motion.div>
    </section>
  )
}
