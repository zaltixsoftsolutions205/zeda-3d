import SectionShell from '../components/ScrollSections'
import GlassPanel from '../components/GlassPanel'
import { AnalyticsDashboard } from '../components/DashboardMockup'

const ITEMS = [
  'Student Performance Analytics',
  'Attendance Trends',
  'Fee Collection Insights',
  'Academic Growth',
  'School Performance Reports',
  'AI-powered Insights',
]

export default function AnalyticsSection() {
  return (
    <SectionShell id="analytics" vh={1.8}>
      <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.25fr]">
        <GlassPanel className="p-6 sm:p-9">
          <span className="eyebrow">AI Analytics</span>
          <h2 className="text-shadow mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.6rem]">
            Make Smarter Decisions With <span className="text-sun">School Intelligence.</span>
          </h2>
          <ul className="mt-6 grid gap-2.5">
            {ITEMS.map((t, i) => (
              <li key={t} className="flex items-center gap-3 text-sm sm:text-base">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sun/20 text-xs font-bold text-sun">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ul>
        </GlassPanel>
        <AnalyticsDashboard />
      </div>
    </SectionShell>
  )
}
