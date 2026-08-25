import {
  HiSpeakerphone,
  HiBriefcase,
  HiSupport,
  HiUserGroup,
  HiChartBar,
  HiCurrencyDollar,
  HiClipboardList,
  HiFolder,
} from 'react-icons/hi';

export const SECTORS = [
  {
    id: 'Marketing',
    label: 'Marketing',
    Icon: HiSpeakerphone,
    icon: '📣',
    color: 'text-pink-400',
    border: 'border-pink-500',
    bg: 'bg-pink-900/20',
    badgeBg: 'bg-pink-900/30 border-pink-500/40 text-pink-300',
    gradient: 'from-pink-900/50 to-pink-800/30',
  },
  {
    id: 'Sales & Business Development',
    label: 'Sales & BD',
    Icon: HiBriefcase,
    icon: '💼',
    color: 'text-orange-400',
    border: 'border-orange-500',
    bg: 'bg-orange-900/20',
    badgeBg: 'bg-orange-900/30 border-orange-500/40 text-orange-300',
    gradient: 'from-orange-900/50 to-orange-800/30',
  },
  {
    id: 'Customer Service',
    label: 'Customer Service',
    Icon: HiSupport,
    icon: '🎧',
    color: 'text-cyan-400',
    border: 'border-cyan-500',
    bg: 'bg-cyan-900/20',
    badgeBg: 'bg-cyan-900/30 border-cyan-500/40 text-cyan-300',
    gradient: 'from-cyan-900/50 to-cyan-800/30',
  },
  {
    id: 'Human Resources',
    label: 'Human Resources',
    Icon: HiUserGroup,
    icon: '👥',
    color: 'text-purple-400',
    border: 'border-purple-500',
    bg: 'bg-purple-900/20',
    badgeBg: 'bg-purple-900/30 border-purple-500/40 text-purple-300',
    gradient: 'from-purple-900/50 to-purple-800/30',
  },
  {
    id: 'Business Analysis',
    label: 'Business Analysis',
    Icon: HiChartBar,
    icon: '📊',
    color: 'text-blue-400',
    border: 'border-blue-500',
    bg: 'bg-blue-900/20',
    badgeBg: 'bg-blue-900/30 border-blue-500/40 text-blue-300',
    gradient: 'from-blue-900/50 to-blue-800/30',
  },
  {
    id: 'Finance & Accounting',
    label: 'Finance & Accounting',
    Icon: HiCurrencyDollar,
    icon: '💰',
    color: 'text-emerald-400',
    border: 'border-emerald-500',
    bg: 'bg-emerald-900/20',
    badgeBg: 'bg-emerald-900/30 border-emerald-500/40 text-emerald-300',
    gradient: 'from-emerald-900/50 to-emerald-800/30',
  },
  {
    id: 'Project Management',
    label: 'Project Management',
    Icon: HiClipboardList,
    icon: '📋',
    color: 'text-yellow-400',
    border: 'border-yellow-500',
    bg: 'bg-yellow-900/20',
    badgeBg: 'bg-yellow-900/30 border-yellow-500/40 text-yellow-300',
    gradient: 'from-yellow-900/50 to-yellow-800/30',
  },
  {
    id: 'Administration',
    label: 'Administration',
    Icon: HiFolder,
    icon: '🗂️',
    color: 'text-slate-400',
    border: 'border-slate-500',
    bg: 'bg-slate-900/20',
    badgeBg: 'bg-slate-900/30 border-slate-500/40 text-slate-300',
    gradient: 'from-slate-900/50 to-slate-800/30',
  },
];

export const SECTOR_IDS = SECTORS.map((s) => s.id);

export const getSectorById = (id) => SECTORS.find((s) => s.id === id);

export const isSector = (value) => SECTOR_IDS.includes(value);

export const TECH_STACKS = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
  'Python', 'Java', 'PHP', 'SQL', 'MongoDB', 'Docker', 'AWS', 'Go', 'C#',
  'Kubernetes', 'GraphQL', 'Redis', 'Spring Boot', 'Django', 'FastAPI',
];

/**
 * Level descriptions per sector — used in InterviewStart UI.
 */
export const SECTOR_LEVEL_DESCRIPTIONS = {
  'Marketing': {
    1: {
      label: 'Junior Marketing',
      topics: ['Marketing fundamentals & 4Ps', 'Target audience & personas', 'Social media basics', 'Basic SEO/SEM', 'Campaign metrics', 'Content marketing'],
      description: 'Foundational marketing concepts, channel selection, and basic campaign thinking.',
      scenario: 'A new clothing brand wants to reach university students. Which marketing channels would you recommend?',
    },
    2: {
      label: 'Mid-level Marketing',
      topics: ['Marketing strategy', 'Digital advertising', 'Conversion optimization', 'Customer segmentation', 'Marketing analytics', 'A/B testing', 'Campaign budgeting'],
      description: 'Campaign strategy, data-driven decision making, and budget management.',
      scenario: 'Your ad spend increased by 30%, but conversions stayed the same. How would you investigate this?',
    },
    3: {
      label: 'Senior Marketing',
      topics: ['Brand positioning', 'Go-to-market strategy', 'Customer lifetime value', 'Market expansion', 'Competitive strategy', 'Marketing leadership'],
      description: 'Strategic marketing leadership, brand positioning, and go-to-market thinking.',
      scenario: 'Your company is entering a new country with limited brand recognition. Build a 12-month GTM strategy.',
    },
  },
  'Sales & Business Development': {
    1: {
      label: 'Junior Sales',
      topics: ['Sales fundamentals', 'Lead qualification', 'Objection handling', 'CRM basics', 'Active listening', 'Basic negotiation'],
      description: 'The AI will act as a skeptical customer. Demonstrate your communication and objection handling.',
      scenario: 'AI as customer: "Your product seems too expensive." Respond and handle the objection.',
    },
    2: {
      label: 'Mid-level Sales',
      topics: ['Consultative selling', 'Pipeline management', 'Negotiation', 'Account management', 'B2B sales process', 'Cross-selling'],
      description: 'The AI plays a demanding client. Demonstrate advanced negotiation and closing skills.',
      scenario: 'AI as client: "Your competitor is 25% cheaper." Handle the objection and close.',
    },
    3: {
      label: 'Senior Sales / BD',
      topics: ['Sales strategy', 'Enterprise accounts', 'Revenue forecasting', 'Pricing strategy', 'Complex negotiation', 'Sales leadership'],
      description: 'Strategic sales thinking, enterprise negotiation, and revenue leadership.',
      scenario: 'Your largest client is considering leaving due to pricing. You cannot offer a major discount. What do you do?',
    },
  },
  'Customer Service': {
    1: {
      label: 'Junior Customer Service',
      topics: ['Customer empathy', 'Complaint handling', 'Active listening', 'Basic troubleshooting', 'Escalation procedures', 'Professional tone'],
      description: 'The AI plays a frustrated customer. Demonstrate patience, empathy and problem resolution.',
      scenario: 'AI as angry customer: "I\'ve been charged twice and nobody has helped me for three days!"',
    },
    2: {
      label: 'Mid-level Customer Service',
      topics: ['Complex problem resolution', 'Escalation management', 'Customer retention', 'SLA management', 'Root-cause analysis', 'Under-pressure communication'],
      description: 'The AI plays a high-value client threatening to cancel. Manage the escalation.',
      scenario: 'AI as client: "Three of my support tickets are still open. I am cancelling my subscription."',
    },
    3: {
      label: 'Senior Customer Success',
      topics: ['Customer success strategy', 'Churn prevention', 'Customer lifetime value', 'Strategic accounts', 'Team management', 'Process optimization'],
      description: 'Strategic customer success leadership — churn analysis, team management, and high-value accounts.',
      scenario: 'A top enterprise client shows declining engagement for 3 months. Design a retention strategy.',
    },
  },
  'Human Resources': {
    1: {
      label: 'Junior HR',
      topics: ['HR fundamentals', 'Recruitment basics', 'Candidate screening', 'Onboarding', 'Employee records', 'Confidentiality', 'Basic performance management'],
      description: 'HR fundamentals, recruitment, and handling everyday employee situations.',
      scenario: 'Two candidates have similar qualifications. How would you decide who moves to the next stage?',
    },
    2: {
      label: 'Mid-level HR',
      topics: ['Talent acquisition', 'Employee relations', 'Performance management', 'Retention strategies', 'HR analytics', 'Conflict resolution', 'Workforce planning'],
      description: 'Employee relations, performance management, and HR data interpretation.',
      scenario: 'A high-performer wants to leave because their manager doesn\'t recognize their work. What do you do?',
    },
    3: {
      label: 'Senior HR / HRBP',
      topics: ['HR strategy', 'Workforce planning', 'Organizational development', 'Succession planning', 'Compensation strategy', 'Change management', 'Employee engagement'],
      description: 'Strategic HR leadership, organizational development, and change management.',
      scenario: 'Your company will grow from 300 to 1,000 employees in 3 years. Build your HR strategy.',
    },
  },
  'Business Analysis': {
    1: {
      label: 'Junior Business Analyst',
      topics: ['Business fundamentals', 'Requirements gathering', 'Process mapping', 'Basic data analysis', 'KPIs', 'Stakeholder communication'],
      description: 'Analytical thinking, requirements gathering, and structured problem decomposition.',
      scenario: 'A company\'s sales have fallen 10%. What information would you gather before suggesting solutions?',
    },
    2: {
      label: 'Mid-level Business Analyst',
      topics: ['Business process analysis', 'Root-cause analysis', 'Data-driven recommendations', 'KPI design', 'Cost-benefit analysis', 'Stakeholder management'],
      description: 'Complex analysis, root-cause diagnosis, and business recommendations.',
      scenario: 'Revenue is up 20%, but profit is down 10%. Diagnose and present your recommendations.',
    },
    3: {
      label: 'Senior Business / Management',
      topics: ['Business strategy', 'Market analysis', 'Business transformation', 'Financial modeling', 'Risk management', 'Competitive strategy', 'Executive decisions'],
      description: 'Strategic business thinking, ambiguous problem-solving, and executive decisions.',
      scenario: 'Two expansion markets: one large & competitive, one small & fast-growing. Which do you choose and why?',
    },
  },
  'Finance & Accounting': {
    1: {
      label: 'Junior Finance / Accounting',
      topics: ['Accounting fundamentals', 'Financial statements', 'Debit/credit', 'Basic ratios', 'Basic budgeting', 'Numerical accuracy'],
      description: 'Core accounting principles, financial statements, and numerical reasoning.',
      scenario: 'A company has $500K revenue and $350K expenses. Calculate the operating profit and explain what it means.',
    },
    2: {
      label: 'Mid-level Finance',
      topics: ['Financial analysis', 'Budgeting & forecasting', 'Variance analysis', 'Cash-flow analysis', 'Financial modeling', 'Risk analysis'],
      description: 'Financial analysis, forecasting, and identifying financial problems in business data.',
      scenario: 'Revenue grows 15%/year but cash flow is negative. What\'s happening and what would you do?',
    },
    3: {
      label: 'Senior Finance',
      topics: ['Corporate finance', 'Capital allocation', 'Investment decisions', 'Valuation', 'Strategic budgeting', 'Risk management', 'Financial leadership'],
      description: 'Strategic financial decisions, capital allocation, and financial leadership.',
      scenario: 'The company has $10M to deploy: acquire a competitor, expand, or return capital. Walk through your decision framework.',
    },
  },
  'Project Management': {
    1: {
      label: 'Junior Project Coordinator',
      topics: ['Project lifecycle', 'Task management', 'Scheduling', 'Basic risk management', 'Documentation', 'Team coordination', 'Agile/Scrum basics'],
      description: 'Project coordination fundamentals, scheduling, and basic problem-solving.',
      scenario: 'Two team members are unavailable and an important task is due tomorrow. What do you do?',
    },
    2: {
      label: 'Mid-level Project Manager',
      topics: ['Project planning', 'Scope management', 'Risk management', 'Resource & budget management', 'Agile/Scrum', 'Stakeholder management', 'Project recovery'],
      description: 'Project planning, risk management, and stakeholder communication under pressure.',
      scenario: 'Your project is 2 weeks behind and the client won\'t move the deadline. What\'s your plan?',
    },
    3: {
      label: 'Senior Program Manager',
      topics: ['Program management', 'Portfolio thinking', 'Executive stakeholder management', 'Budget ownership', 'Change management', 'Organizational risk', 'Governance'],
      description: 'Program leadership, portfolio decisions, and executive-level stakeholder management.',
      scenario: 'Three projects need the same engineering team, but only two can be funded. How do you decide?',
    },
  },
  'Administration': {
    1: {
      label: 'Junior Administration',
      topics: ['Office procedures', 'Scheduling', 'Professional communication', 'Document management', 'Meeting coordination', 'Time management', 'Confidentiality'],
      description: 'Office operations, scheduling, and professional communication fundamentals.',
      scenario: 'Your manager needs 3 meetings scheduled, but 2 clients are only available at the same time. How do you handle it?',
    },
    2: {
      label: 'Mid-level Administration / Operations',
      topics: ['Office operations management', 'Process improvement', 'Vendor coordination', 'Budget tracking', 'Resource management', 'Complex scheduling', 'Reporting'],
      description: 'Operations management, process improvement, and administrative problem-solving.',
      scenario: 'Office operating costs rose 20% this quarter. How would you investigate and reduce them?',
    },
    3: {
      label: 'Senior Administration / Operations',
      topics: ['Operations strategy', 'Resource planning', 'Cost optimization', 'Process redesign', 'Vendor management', 'Policy development', 'Team leadership'],
      description: 'Strategic operations leadership, cost optimization, and organizational coordination.',
      scenario: 'Reduce operational costs by 20% without reducing headcount. Present your strategic plan.',
    },
  },
};
