import SectionShell from '../components/ScrollSections'
import GlassPanel from '../components/GlassPanel'
import { CLIENTS, CLIENT_SCHOOLS } from '../lib/content'
import { modal } from '../lib/modal'

/** School names only (no logos supplied yet): each tile uses a monogram built from the school's initials. */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w) && !['School', 'Academy', 'High', 'Grammar', 'Integrated', 'Techno'].includes(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

const TONES = ['bg-[#0e7c86]', 'bg-[#ee5a48]', 'bg-[#fbaf22] !text-[#064e57]', 'bg-[#35bfa6] !text-[#064e57]']

export default function ClientsSection() {
  return (
    <SectionShell id="clients" vh={1.3}>
      <div className="grid items-center gap-6 lg:grid-cols-[440px_1fr]">
        <GlassPanel className="p-7">
          <span className="eyebrow">{CLIENTS.eyebrow}</span>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl">
            Schools That Choose a <span className="text-sun">Smarter Future.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink/75 sm:text-base">{CLIENTS.body}</p>
          <button className="btn btn-primary mt-6" onClick={() => modal.open('demo')}>
            Join Our Smart Schools
          </button>
        </GlassPanel>

        <ul className="grid gap-3 sm:grid-cols-2" aria-label="Our partner schools">
          {CLIENT_SCHOOLS.map((name, i) => (
            <li key={name}>
              <GlassPanel className="flex h-full items-center gap-4 p-5 transition hover:-translate-y-1">
                <span
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl font-display text-lg font-extrabold text-white ${TONES[i % TONES.length]}`}
                  aria-hidden
                >
                  {initials(name)}
                </span>
                <span>
                  <span className="block text-[15px] font-bold leading-snug">{name}</span>
                  <span className="mt-0.5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#35bfa6]" />
                    Medav.ai partner school
                  </span>
                </span>
              </GlassPanel>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  )
}
