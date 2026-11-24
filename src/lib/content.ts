/** Page copy for Medav.ai (kept in one place so wording can be edited without touching layout). */

export const HERO = {
  eyebrow: 'Medav.ai',
  title: 'Your AI-Native School Management Operating System.',
  subtitle:
    'Transform your school into an intelligent, connected ecosystem powered by advanced AI technology. Automate processes, discover meaningful insights and empower every decision with the intelligence of Medav.ai.',
  cta1: 'Unlock School Intelligence',
  cta2: 'Schedule Your Free Demo',
}

export const FUTURE = {
  eyebrow: 'The Future of Education is Intelligent',
  title: 'Your School Deserves More Than Just Software.',
  body: 'Experience a smarter way to manage, automate and grow your institution with AI-powered intelligence that works behind every school operation.',
  steps: [
    { n: '01', t: 'Bring It Together', d: 'One connected school ecosystem.', icon: 'link' },
    { n: '02', t: 'Automate Everything', d: 'AI handles repetitive workflows.', icon: 'cog' },
    { n: '03', t: 'Think Smarter', d: 'Turn school data into insights.', icon: 'bulb' },
    { n: '04', t: 'Move Forward', d: 'Make confident decisions.', icon: 'rocket' },
  ],
}

export interface FeatureItem {
  key: string
  icon: string
  title: string
  short: string
  body: string
  chips: string[]
}

export const FEATURES_TITLE = 'Intelligent Features for Smarter Schools'

export const FEATURES: FeatureItem[] = [
  {
    key: 'attendance',
    icon: 'check',
    title: 'Intelligent Attendance Management',
    short: 'AI-powered attendance tracking',
    body: 'Simplify attendance management with AI-powered attendance tracking, automated student monitoring, real-time attendance records and intelligent analytics. Identify attendance patterns and manage school attendance efficiently with smart school management software.',
    chips: ['AI-powered tracking', 'Automated monitoring', 'Real-time records', 'Intelligent analytics'],
  },
  {
    key: 'homework',
    icon: 'book',
    title: 'Homework Management',
    short: 'Digital homework sharing',
    body: 'Simplify homework management with digital homework sharing and real-time student progress tracking. Keep teachers organised and students connected through one intelligent platform.',
    chips: ['Digital homework sharing', 'Real-time progress tracking', 'Teachers organised', 'Students connected'],
  },
  {
    key: 'bus',
    icon: 'bus',
    title: 'Smart Bus Monitoring',
    short: 'Real-time GPS bus tracking',
    body: 'Ensure safer school transportation with real-time GPS bus tracking, live route monitoring and automated travel updates. Keep school administrators and parents informed about bus locations and journey status through one intelligent platform.',
    chips: ['Real-time GPS tracking', 'Live route monitoring', 'Automated travel updates', 'Admins & parents informed'],
  },
  {
    key: 'fees',
    icon: 'card',
    title: 'Fee Management',
    short: 'Automated payment tracking',
    body: "Simplify school fee management with automated payment tracking, timely fee reminders and real-time collection insights. Monitor paid and pending fees, maintain accurate financial records and streamline your school's fee operations with ease.",
    chips: ['Automated payment tracking', 'Timely fee reminders', 'Real-time collection insights', 'Accurate records'],
  },
  {
    key: 'exams',
    icon: 'clipboard',
    title: 'Examination Management',
    short: 'Smart exam scheduling',
    body: 'Streamline school examinations with smart exam scheduling, automated result processing and academic performance tracking. Simplify examination workflows and gain clear insights into student progress through one intelligent platform.',
    chips: ['Smart exam scheduling', 'Automated result processing', 'Performance tracking', 'Clear progress insights'],
  },
  {
    key: 'reportcards',
    icon: 'cap',
    title: 'Report Card Management',
    short: 'Automated report cards',
    body: 'Generate detailed student report cards with automated result processing, academic performance tracking and progress insights. Simplify report generation and keep student records accurate, organised and accessible through one intelligent platform.',
    chips: ['Automated result processing', 'Performance tracking', 'Progress insights', 'Accurate, organised records'],
  },
]

export const WHY = {
  eyebrow: 'Why Choose Medav?',
  title: 'Not Just School Management. The Intelligence to Transform Your School.',
  body: 'Medav.ai combines intelligent technology, smart automation and complete school management into one unified platform. From everyday academic activities to administrative operations, empower your school with real-time visibility, connected workflows and AI-driven insights that make school management simpler, smarter and more efficient.',
  listTitle: '6 Reasons to Choose Medav',
  reasons: [
    {
      n: '01',
      t: 'AI-Driven School Intelligence',
      d: 'Go beyond traditional school management with AI-powered insights, intelligent assistance and smarter workflows that help schools make informed decisions.',
    },
    {
      n: '02',
      t: 'One Platform. Every School Operation.',
      d: 'Bring attendance, homework, transportation, fee management, examinations and academic records together in one unified school management platform.',
    },
    {
      n: '03',
      t: 'Smarter Automation. Less Manual Work.',
      d: 'Eliminate repetitive administrative tasks, streamline everyday processes and give your school team more time to focus on what matters most.',
    },
    {
      n: '04',
      t: 'Real-Time School Insights',
      d: 'Turn school data into meaningful insights with real-time reports, performance tracking and clear operational visibility to support better decisions.',
    },
    {
      n: '05',
      t: 'Seamless School-Wide Connectivity',
      d: 'Connect school administrators, teachers, students and parents through one intelligent ecosystem that keeps everyone informed and engaged.',
    },
    {
      n: '06',
      t: 'Secure, Centralised Data Management',
      d: 'Keep essential school information organised in one centralised platform with controlled access, reliable data management and secure information handling.',
    },
  ],
}

export const CLIENTS = {
  eyebrow: 'Our Clients',
  title: 'Schools That Choose a Smarter Future.',
  body: 'Connecting schools with intelligent technology for simpler operations, better visibility and smarter management.',
}

export const CLIENT_SCHOOLS = [
  'Geetham Integrated Academy School',
  'St Alphonsa Grammar School',
  'Bavishya Techno School',
  'Sri Vidhya High School',
]

export const TESTIMONIALS = {
  eyebrow: 'Testimonials',
  title: 'What Our School Partners Say',
  body: 'Discover how schools are making everyday management easier, improving communication and creating better experiences with Medav.',
  items: [
    {
      q: 'Medav makes managing our school activities much easier. From student attendance to fee management, everything is organised in one place. It saves time and helps us manage our school more efficiently.',
      name: 'Dr. [Principal Name]',
      role: 'Principal',
      school: '[School Name] | [City]',
    },
    {
      q: 'Managing students, teachers and daily school activities has become more convenient with Medav. The platform helps us stay organised and keeps parents informed about important updates.',
      name: '[Principal Name]',
      role: 'School Principal',
      school: '[School Name] | [City]',
    },
    {
      q: 'Medav provides a simple way to manage school operations. Its features help teachers, parents and administrators stay connected and make everyday tasks easier.',
      name: '[Director Name]',
      role: 'School Director',
      school: '[School Name] | [City]',
    },
  ],
  join: {
    title: 'Join Our Growing Family of Smart Schools!',
    body: 'Make school management simpler, keep everyone connected and take your institution towards a smarter future with Medav.',
    cta: 'Book Your Free Medav Demo Today!',
  },
}

export const CONTACT = {
  eyebrow: 'Contact Us',
  title: "Ready to Make Your School Smarter? Let's Connect!",
  body1:
    "Discover how Medav.ai can simplify your school's daily operations with intelligent technology. From student management and attendance to fee tracking and parent communication, bring everything together on one easy-to-use platform.",
  body2: "Let's discuss your school's needs and find the right solution for your institution.",
  cta: 'Book Your Free Medav.ai Demo Today!',
}
