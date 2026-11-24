import { motion } from 'framer-motion'
import SectionShell from '../components/ScrollSections'
import GlassPanel from '../components/GlassPanel'
import { TESTIMONIALS } from '../lib/content'
import { modal } from '../lib/modal'
import { Icon } from '../components/Icons'

export default function TestimonialsSection() {
  const t = TESTIMONIALS
  return (
    <SectionShell id="testimonials" vh={1.6}>
      <div>
        <GlassPanel className="mb-5 inline-block max-w-3xl px-6 py-5">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
            What Our School Partners <span className="text-sun">Say</span>
          </h2>
          <p className="mt-2 text-sm text-ink/75">{t.body}</p>
        </GlassPanel>

        <div className="grid gap-4 md:grid-cols-3">
          {t.items.map((x, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: '-8%' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass flex h-full flex-col p-5"
            >
              <span className="font-display text-5xl leading-none text-sun" aria-hidden>
                “
              </span>
              <blockquote className="-mt-2 flex-1 text-[13.5px] leading-relaxed text-ink/80">{x.q}</blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-ink/10 pt-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border-[1.5px] border-[#0b5d68]/25 bg-sky-zeda text-ink"><Icon name="user" size={20} /></span>
                <span className="text-sm">
                  <b className="block text-ink">{x.name}</b>
                  <span className="text-ink/70">{x.role}</span>
                  <span className="block text-[11.5px] text-ink/55">{x.school}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="panel-dark mt-5 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <h3 className="text-xl font-extrabold sm:text-2xl">{t.join.title}</h3>
            <p className="mt-1.5 text-sm text-white/80">{t.join.body}</p>
          </div>
          <button className="btn btn-primary shrink-0" onClick={() => modal.open('demo')}>
            {t.join.cta}
          </button>
        </div>
      </div>
    </SectionShell>
  )
}
