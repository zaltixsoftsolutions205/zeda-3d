import SectionShell from '../components/ScrollSections'
import GlassPanel from '../components/GlassPanel'
import { CONTACT } from '../lib/content'
import { modal } from '../lib/modal'

export default function ContactSection() {
  return (
    <SectionShell id="contact" vh={1.2}>
      <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
        <GlassPanel className="max-w-3xl px-6 py-10 sm:px-12 sm:py-12">
          <div className="mb-5 flex justify-center">
            <img src="/medav-wordmark.png" alt="Medav" className="h-20 w-auto object-contain" loading="lazy" />
          </div>
          <span className="eyebrow">{CONTACT.eyebrow}</span>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight sm:text-4xl">
            Ready to Make Your School <span className="text-sun">Smarter?</span> Let&apos;s Connect!
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink/80 sm:text-base">{CONTACT.body1}</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink/80 sm:text-base">{CONTACT.body2}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button className="btn btn-primary" onClick={() => modal.open('demo')}>
              {CONTACT.cta}
            </button>
            <button className="btn btn-ghost" onClick={() => modal.open('contact')}>
              Contact Us
            </button>
          </div>
        </GlassPanel>
        <p className="mt-8 text-xs font-semibold text-white [text-shadow:0_2px_10px_rgba(0,0,0,.6)]">
          © {new Date().getFullYear()} Medav.ai · AI-Powered School Management Software
        </p>
      </div>
    </SectionShell>
  )
}
