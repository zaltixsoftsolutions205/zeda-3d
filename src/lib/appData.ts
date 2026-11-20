export type AppId = 'student' | 'parent' | 'teacher'

export interface Screen {
  feature: string
  title: string
  stat: { label: string; value: string; pct: number }
  rows: { t: string; s: string; r?: string; tone?: 'ok' | 'warn' | 'info' }[]
}

export interface AppDef {
  id: AppId
  name: string
  tagline: string
  who: string
  accent: string
  screens: Screen[]
}

export const APPS: AppDef[] = [
  {
    id: 'student',
    name: 'Student App',
    tagline: 'Everything a student needs, in their pocket.',
    who: 'Aarav · Class 8-A',
    accent: '#FFD9AE',
    screens: [
      {
        feature: 'Attendance',
        title: 'My Attendance',
        stat: { label: 'This term', value: '94%', pct: 94 },
        rows: [
          { t: 'Today', s: 'Present · 8:42 AM', tone: 'ok' },
          { t: 'Yesterday', s: 'Present', tone: 'ok' },
          { t: 'Mon 12', s: 'Leave approved', tone: 'info' },
        ],
      },
      {
        feature: 'Timetable',
        title: "Today's Timetable",
        stat: { label: 'Next class', value: 'Maths', pct: 40 },
        rows: [
          { t: 'Mathematics', s: 'Room 8-A', r: '9:00' },
          { t: 'Science', s: 'Lab 2', r: '10:00' },
          { t: 'English', s: 'Room 8-A', r: '11:15' },
        ],
      },
      {
        feature: 'Homework',
        title: 'Homework',
        stat: { label: 'Pending', value: '3', pct: 60 },
        rows: [
          { t: 'Maths · Ex 4.2', s: 'Due tomorrow', tone: 'warn' },
          { t: 'Science worksheet', s: 'Due Friday', tone: 'info' },
          { t: 'Hindi essay', s: 'Submitted', tone: 'ok' },
        ],
      },
      {
        feature: 'Examination Results',
        title: 'Exam Results',
        stat: { label: 'Mid-term', value: '87%', pct: 87 },
        rows: [
          { t: 'Mathematics', s: 'A1', r: '92' },
          { t: 'Science', s: 'A2', r: '88' },
          { t: 'English', s: 'B1', r: '81' },
        ],
      },
      {
        feature: 'Learning Resources',
        title: 'Learning Library',
        stat: { label: 'New this week', value: '12', pct: 70 },
        rows: [
          { t: 'Algebra basics', s: 'Video · 14 min' },
          { t: 'Cell structure', s: 'PDF notes' },
          { t: 'Grammar practice', s: 'Quiz · 10 Qs' },
        ],
      },
    ],
  },
  {
    id: 'parent',
    name: 'Parent App',
    tagline: 'Stay close to your child’s school life.',
    who: 'Parent of Aarav',
    accent: '#CFEBDD',
    screens: [
      {
        feature: 'Child Attendance',
        title: 'Attendance',
        stat: { label: 'Aarav · this month', value: '96%', pct: 96 },
        rows: [
          { t: 'Today', s: 'Reached school 8:42 AM', tone: 'ok' },
          { t: 'Yesterday', s: 'Present', tone: 'ok' },
          { t: 'Last week', s: '1 leave', tone: 'info' },
        ],
      },
      {
        feature: 'Fee Payments',
        title: 'Fee Payments',
        stat: { label: 'Due by 10 Dec', value: '₹12,500', pct: 55 },
        rows: [
          { t: 'Term 2 tuition', s: 'Pending', r: '₹10,000', tone: 'warn' },
          { t: 'Transport', s: 'Pending', r: '₹2,500', tone: 'warn' },
          { t: 'Term 1', s: 'Paid · UPI', r: '₹10,000', tone: 'ok' },
        ],
      },
      {
        feature: 'Academic Progress',
        title: 'Progress',
        stat: { label: 'Overall grade', value: 'A', pct: 88 },
        rows: [
          { t: 'Mathematics', s: 'Improving', r: '↑ 6%', tone: 'ok' },
          { t: 'Science', s: 'Steady', r: '→', tone: 'info' },
          { t: 'English', s: 'Needs focus', r: '↓ 2%', tone: 'warn' },
        ],
      },
      {
        feature: 'Notifications',
        title: 'Notifications',
        stat: { label: 'Unread', value: '4', pct: 40 },
        rows: [
          { t: 'PTM on Saturday', s: '10:00 AM · School hall' },
          { t: 'Holiday notice', s: 'Diwali break' },
          { t: 'Fee reminder', s: 'Due in 5 days', tone: 'warn' },
        ],
      },
      {
        feature: 'Teacher Communication',
        title: 'Messages',
        stat: { label: 'Class teacher', value: 'Ms. Rao', pct: 100 },
        rows: [
          { t: 'Ms. Rao', s: 'Aarav did great in the quiz!', r: '2m' },
          { t: 'Maths dept.', s: 'Homework clarification', r: '1d' },
          { t: 'Admin office', s: 'Receipt shared', r: '3d' },
        ],
      },
    ],
  },
  {
    id: 'teacher',
    name: 'Teacher App',
    tagline: 'Less admin. More teaching.',
    who: 'Ms. Rao · Maths',
    accent: '#FFD9AE',
    screens: [
      {
        feature: 'Attendance',
        title: 'Mark Attendance',
        stat: { label: 'Class 8-A', value: '38/40', pct: 95 },
        rows: [
          { t: 'Aarav Sharma', s: 'Roll 01', r: 'P', tone: 'ok' },
          { t: 'Diya Patel', s: 'Roll 02', r: 'P', tone: 'ok' },
          { t: 'Kabir Singh', s: 'Roll 03', r: 'A', tone: 'warn' },
        ],
      },
      {
        feature: 'Class Management',
        title: 'My Classes',
        stat: { label: 'Today', value: '5 periods', pct: 50 },
        rows: [
          { t: '8-A Mathematics', s: '9:00 · Room 12' },
          { t: '9-B Mathematics', s: '11:15 · Room 21' },
          { t: '10-A Revision', s: '1:30 · Room 4' },
        ],
      },
      {
        feature: 'Student Records',
        title: 'Student Records',
        stat: { label: 'Students', value: '40', pct: 100 },
        rows: [
          { t: 'Aarav Sharma', s: 'Avg 87% · 96% att.', tone: 'ok' },
          { t: 'Diya Patel', s: 'Avg 91% · 98% att.', tone: 'ok' },
          { t: 'Kabir Singh', s: 'Avg 62% · 78% att.', tone: 'warn' },
        ],
      },
      {
        feature: 'Examinations',
        title: 'Exam Marks',
        stat: { label: 'Unit Test 2', value: '32/40', pct: 80 },
        rows: [
          { t: 'Entered', s: '32 students', tone: 'ok' },
          { t: 'Pending', s: '8 students', tone: 'warn' },
          { t: 'Class average', s: '74%', tone: 'info' },
        ],
      },
      {
        feature: 'Leave Management',
        title: 'Leave',
        stat: { label: 'Balance', value: '8 days', pct: 65 },
        rows: [
          { t: 'Casual leave', s: '12 – 13 Dec', r: 'Approved', tone: 'ok' },
          { t: 'Medical leave', s: '2 Nov', r: 'Approved', tone: 'ok' },
          { t: 'Apply new leave', s: 'Tap to request', tone: 'info' },
        ],
      },
    ],
  },
]
