import SectionShell from '../components/ScrollSections'
import GlassPanel from '../components/GlassPanel'
import Logo from '../components/Logo'
import { modal } from '../lib/modal'

export default function ContactSection() {
  return (
    <SectionShell id="contact" vh={1.2}>
      <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
        <GlassPanel className="max-w-3xl px-6 py-10 sm:px-12 sm:py-14">
          <div className="mb-6 flex justify-center">
            <Logo size={64} dark />
          </div>
          <h2 className="text-shadow text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Your School's Digital Transformation <span className="text-sun">Starts With ZEDA.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-ink/85 sm:text-lg">
            Connect your entire school community with one intelligent platform.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button className="btn btn-primary" onClick={() => modal.open('demo')}>
              Book a Demo
            </button>
            <button className="btn btn-ghost" onClick={() => modal.open('contact')}>
              Contact Us
            </button>
          </div>
        </GlassPanel>
        <p className="mt-8 text-xs font-semibold text-white [text-shadow:0_2px_10px_rgba(0,0,0,.6)]">© {new Date().getFullYear()} Zaltix Education Digital Access · ZEDA</p>
      </div>
    </SectionShell>
  )
}
