export interface Feature {
  key: string
  title: string
  blurb: string
  icon: string
  kpi: { label: string; value: string }[]
  rows: [string, string, string][]
}

export const FEATURES: Feature[] = [
  {
    key: 'students',
    title: 'Student Management',
    blurb: 'Admissions, profiles, houses and records in one place.',
    icon: '🎓',
    kpi: [
      { label: 'Enrolled', value: '1,284' },
      { label: 'New admissions', value: '86' },
    ],
    rows: [
      ['Aarav Sharma', '8-A', 'Active'],
      ['Diya Patel', '8-A', 'Active'],
      ['Kabir Singh', '8-B', 'Transfer'],
    ],
  },
  {
    key: 'staff',
    title: 'Staff Management',
    blurb: 'Teacher profiles, workload, payroll and documents.',
    icon: '🧑‍🏫',
    kpi: [
      { label: 'Teaching staff', value: '72' },
      { label: 'Non-teaching', value: '28' },
    ],
    rows: [
      ['Ms. Rao', 'Mathematics', 'On duty'],
      ['Mr. Iyer', 'Science', 'On duty'],
      ['Mrs. Khan', 'English', 'Leave'],
    ],
  },
  {
    key: 'attendance',
    title: 'Attendance Management',
    blurb: 'Fast daily marking with instant parent alerts.',
    icon: '✅',
    kpi: [
      { label: 'Present today', value: '94%' },
      { label: 'Alerts sent', value: '61' },
    ],
    rows: [
      ['Class 8-A', '38 / 40', 'Marked'],
      ['Class 8-B', '36 / 39', 'Marked'],
      ['Class 9-A', '—', 'Pending'],
    ],
  },
  {
    key: 'fees',
    title: 'Fee Management',
    blurb: 'Fee structures, online payments, receipts and dues.',
    icon: '💳',
    kpi: [
      { label: 'Collected', value: '₹48.2L' },
      { label: 'Pending', value: '₹6.1L' },
    ],
    rows: [
      ['Term 2 · Class 8', '₹10,000', 'Paid'],
      ['Transport · Route 4', '₹2,500', 'Due'],
      ['Term 2 · Class 9', '₹11,500', 'Paid'],
    ],
  },
  {
    key: 'exams',
    title: 'Examination Management',
    blurb: 'Schedules, marks entry, grade books and report cards.',
    icon: '📝',
    kpi: [
      { label: 'Exams this term', value: '4' },
      { label: 'Results published', value: '82%' },
    ],
    rows: [
      ['Unit Test 2', 'Class 8', 'Published'],
      ['Mid-term', 'Class 9', 'Marking'],
      ['Pre-board', 'Class 10', 'Scheduled'],
    ],
  },
  {
    key: 'timetable',
    title: 'Timetable Management',
    blurb: 'Conflict-free timetables and instant substitutions.',
    icon: '🗓️',
    kpi: [
      { label: 'Periods / week', value: '42' },
      { label: 'Substitutions', value: '3' },
    ],
    rows: [
      ['Period 1', 'Mathematics', 'Ms. Rao'],
      ['Period 2', 'Science', 'Mr. Iyer'],
      ['Period 3', 'English', 'Sub: Mr. Das'],
    ],
  },
  {
    key: 'comms',
    title: 'Communication',
    blurb: 'Circulars, notices and chats across the whole school.',
    icon: '💬',
    kpi: [
      { label: 'Messages today', value: '214' },
      { label: 'Read rate', value: '91%' },
    ],
    rows: [
      ['PTM invite', 'All parents', 'Sent'],
      ['Holiday notice', 'Everyone', 'Sent'],
      ['Sports day', 'Class 6–8', 'Draft'],
    ],
  },
  {
    key: 'reports',
    title: 'Reports & Analytics',
    blurb: 'Ready-made reports and trends, exportable in a click.',
    icon: '📊',
    kpi: [
      { label: 'Reports ready', value: '38' },
      { label: 'Scheduled', value: '6' },
    ],
    rows: [
      ['Attendance summary', 'Monthly', 'Ready'],
      ['Fee collection', 'Weekly', 'Ready'],
      ['Result analysis', 'Term', 'Running'],
    ],
  },
  {
    key: 'year',
    title: 'Academic Year Management',
    blurb: 'Set up sessions, promote classes and archive in minutes.',
    icon: '📚',
    kpi: [
      { label: 'Active session', value: '2026–27' },
      { label: 'Promotion', value: '100%' },
    ],
    rows: [
      ['Class setup', '2026–27', 'Done'],
      ['Student promotion', 'Class 1–9', 'Done'],
      ['Fee structure', '2026–27', 'Review'],
    ],
  },
  {
    key: 'leave',
    title: 'Leave Management',
    blurb: 'Digital leave requests, approvals and balances.',
    icon: '🌴',
    kpi: [
      { label: 'Pending requests', value: '5' },
      { label: 'Approved today', value: '9' },
    ],
    rows: [
      ['Ms. Rao', 'Casual · 2d', 'Approved'],
      ['Mr. Das', 'Medical · 1d', 'Pending'],
      ['Aarav S.', 'Sick · 1d', 'Approved'],
    ],
  },
]
