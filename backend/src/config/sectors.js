/**
 * Business / Non-Tech Sector Definitions
 * Single source of truth for AI prompts, level specs, scoring criteria.
 */

const SECTORS = [
  'Marketing',
  'Sales & Business Development',
  'Customer Service',
  'Human Resources',
  'Business Analysis',
  'Finance & Accounting',
  'Project Management',
  'Administration',
];

/**
 * Sector-level specifications.
 * Structure: SECTOR_LEVEL_SPECS[sectorName][level] = { name, description, topics, scenarios, questionCount, passMark, estimatedMinutes, aiRole }
 *
 * aiRole: how the AI should behave in an AI Agent interview for this sector.
 *   'interviewer' = standard Q&A style
 *   'customer'    = AI plays a difficult/typical customer (Sales, CS)
 *   'manager'     = AI plays a senior manager posing business problems
 */
const SECTOR_LEVEL_SPECS = {
  'Marketing': {
    1: {
      name: 'Junior Marketing',
      description: 'Marketing fundamentals, target audience identification, basic channel selection, and simple campaign planning.',
      topics: [
        'Marketing fundamentals & 4Ps',
        'Target audience & customer personas',
        'Social media basics',
        'Basic SEO/SEM concepts',
        'Content marketing basics',
        'Basic campaign metrics',
        'Customer journey',
        'Basic market research',
      ],
      scenarios: [
        'A new clothing brand wants to reach university students. Which marketing channels would you recommend and why?',
      ],
      questionCount: 6,
      passMark: 60,
      estimatedMinutes: '12–18',
      aiRole: 'interviewer',
      isCodingInterview: false,
    },
    2: {
      name: 'Mid-level Marketing',
      description: 'Marketing strategy, data-driven decisions, campaign budgeting, A/B testing, and conversion optimization.',
      topics: [
        'Marketing strategy',
        'Digital advertising (PPC/Social)',
        'SEO/SEM strategy',
        'Conversion optimization',
        'Customer segmentation',
        'Marketing analytics & attribution',
        'A/B testing',
        'Lead generation & CRM',
        'Campaign budgeting',
      ],
      scenarios: [
        'Your advertising spend increased by 30%, but conversions stayed the same. How would you investigate the problem?',
      ],
      questionCount: 7,
      passMark: 65,
      estimatedMinutes: '15–22',
      aiRole: 'interviewer',
      isCodingInterview: false,
    },
    3: {
      name: 'Senior Marketing',
      description: 'Strategic marketing leadership, brand positioning, go-to-market strategy, and cross-functional decision-making.',
      topics: [
        'Marketing strategy & brand positioning',
        'Growth & go-to-market strategy',
        'Marketing attribution',
        'Customer lifetime value',
        'Acquisition economics',
        'Budget/resource allocation',
        'Market expansion & competitive strategy',
        'Marketing leadership',
      ],
      scenarios: [
        'Your company is entering a new country with limited brand recognition. Develop a 12-month go-to-market strategy.',
      ],
      questionCount: 8,
      passMark: 70,
      estimatedMinutes: '20–30',
      aiRole: 'interviewer',
      isCodingInterview: false,
    },
  },

  'Sales & Business Development': {
    1: {
      name: 'Junior Sales',
      description: 'Sales fundamentals, prospecting, basic objection handling, and customer communication skills tested via real conversation.',
      topics: [
        'Sales fundamentals & funnel',
        'Product/service knowledge',
        'Prospecting & lead qualification',
        'Customer needs identification',
        'Basic objection handling',
        'Basic negotiation',
        'CRM basics',
        'Active listening',
      ],
      scenarios: [
        'The candidate is selling a SaaS product. The AI will act as a skeptical prospect objecting to price.',
      ],
      questionCount: 6,
      passMark: 60,
      estimatedMinutes: '12–18',
      aiRole: 'customer',
      isCodingInterview: false,
    },
    2: {
      name: 'Mid-level Sales',
      description: 'Consultative selling, pipeline management, negotiation, and handling competitive objections tested via roleplay.',
      topics: [
        'Consultative selling',
        'Pipeline management & forecasting',
        'Negotiation & persuasion',
        'Objection handling (advanced)',
        'Account management',
        'Cross-selling / upselling',
        'B2B sales process',
        'Sales metrics analysis',
      ],
      scenarios: [
        'The client likes your product but says your competitor is 25% cheaper. The AI plays the client — handle the objection.',
      ],
      questionCount: 7,
      passMark: 65,
      estimatedMinutes: '15–22',
      aiRole: 'customer',
      isCodingInterview: false,
    },
    3: {
      name: 'Senior Sales / Business Development',
      description: 'Strategic sales leadership, enterprise negotiation, revenue strategy, and complex stakeholder management.',
      topics: [
        'Sales strategy & territory planning',
        'Enterprise / strategic accounts',
        'Revenue forecasting',
        'Pricing strategy',
        'Complex negotiation',
        'Partnership development',
        'Sales leadership',
        'Market expansion',
      ],
      scenarios: [
        'Your largest client is considering leaving because of pricing. You cannot offer a major discount. How would you retain them?',
      ],
      questionCount: 8,
      passMark: 70,
      estimatedMinutes: '20–30',
      aiRole: 'customer',
      isCodingInterview: false,
    },
  },

  'Customer Service': {
    1: {
      name: 'Junior Customer Service',
      description: 'Customer service fundamentals, empathy, complaint handling, and professionalism tested via live roleplay with an AI customer.',
      topics: [
        'Customer service fundamentals',
        'Active listening & empathy',
        'Complaint handling',
        'Basic troubleshooting',
        'Escalation procedures',
        'Professional communication',
        'Basic CRM/ticketing',
      ],
      scenarios: [
        'A frustrated customer calls claiming they were charged twice and nobody has helped them for three days. The AI plays the customer.',
      ],
      questionCount: 6,
      passMark: 60,
      estimatedMinutes: '12–18',
      aiRole: 'customer',
      isCodingInterview: false,
    },
    2: {
      name: 'Mid-level Customer Service',
      description: 'Complex problem resolution, escalation management, customer retention, and handling difficult customers under pressure.',
      topics: [
        'Complex problem resolution',
        'Escalation management',
        'Customer retention strategies',
        'SLA management',
        'Root-cause analysis',
        'Customer satisfaction metrics',
        'Cross-team coordination',
        'Communication under pressure',
      ],
      scenarios: [
        'A major client is threatening to cancel because three separate support tickets remain unresolved. The AI plays the client.',
      ],
      questionCount: 7,
      passMark: 65,
      estimatedMinutes: '15–22',
      aiRole: 'customer',
      isCodingInterview: false,
    },
    3: {
      name: 'Senior Customer Success',
      description: 'Customer success strategy, churn reduction, strategic account management, and team leadership.',
      topics: [
        'Customer success strategy',
        'Churn analysis & prevention',
        'Customer lifetime value',
        'Strategic account management',
        'Support operations strategy',
        'SLA strategy',
        'Team management',
        'Customer experience design',
        'Process optimization',
      ],
      scenarios: [
        'Your top-tier enterprise client has been showing declining engagement metrics for 3 months. Design a strategy to reverse churn.',
      ],
      questionCount: 8,
      passMark: 70,
      estimatedMinutes: '20–30',
      aiRole: 'interviewer',
      isCodingInterview: false,
    },
  },

  'Human Resources': {
    1: {
      name: 'Junior HR',
      description: 'HR fundamentals, recruitment basics, candidate screening, onboarding, and basic employee situations.',
      topics: [
        'HR fundamentals & policies',
        'Recruitment & job descriptions',
        'Candidate screening & interview basics',
        'Onboarding procedures',
        'Employee records management',
        'Basic performance management',
        'Professional confidentiality',
        'Workplace communication',
      ],
      scenarios: [
        'Two candidates have similar qualifications. How would you decide who should move to the next stage?',
      ],
      questionCount: 6,
      passMark: 60,
      estimatedMinutes: '12–18',
      aiRole: 'interviewer',
      isCodingInterview: false,
    },
    2: {
      name: 'Mid-level HR',
      description: 'Recruitment strategy, employee relations, performance management, conflict resolution, and HR data interpretation.',
      topics: [
        'Recruitment strategy & talent acquisition',
        'Employee relations & conflict resolution',
        'Performance management',
        'Employee retention strategies',
        'Compensation basics',
        'HR analytics',
        'Training & development',
        'Workforce planning',
        'Policy application',
      ],
      scenarios: [
        'A high-performing employee wants to leave because they feel their manager does not recognize their work. What would you do?',
      ],
      questionCount: 7,
      passMark: 65,
      estimatedMinutes: '15–22',
      aiRole: 'interviewer',
      isCodingInterview: false,
    },
    3: {
      name: 'Senior HR / HR Business Partner',
      description: 'HR strategy, workforce planning, organizational development, talent management, and change management.',
      topics: [
        'HR strategy & business alignment',
        'Workforce planning',
        'Organizational development',
        'Leadership development',
        'Compensation strategy',
        'Succession planning',
        'Employee engagement strategy',
        'HR analytics (advanced)',
        'Change management',
      ],
      scenarios: [
        'Your company is growing from 300 to 1,000 employees in three years. What HR strategy would you build?',
      ],
      questionCount: 8,
      passMark: 70,
      estimatedMinutes: '20–30',
      aiRole: 'interviewer',
      isCodingInterview: false,
    },
  },

  'Business Analysis': {
    1: {
      name: 'Junior Business Analyst',
      description: 'Business fundamentals, problem-solving, requirements gathering, basic data analysis, and structured reasoning.',
      topics: [
        'Business fundamentals',
        'Problem-solving framework',
        'Requirements gathering',
        'Process mapping',
        'Basic data analysis & KPIs',
        'Business requirements documentation',
        'Stakeholder communication',
        'Basic Excel/reporting',
      ],
      scenarios: [
        "A company's sales have fallen 10%. What information would you ask for before suggesting a solution?",
      ],
      questionCount: 6,
      passMark: 60,
      estimatedMinutes: '12–18',
      aiRole: 'manager',
      isCodingInterview: false,
    },
    2: {
      name: 'Mid-level Business Analyst',
      description: 'Business process analysis, root-cause analysis, data-driven recommendations, and stakeholder management.',
      topics: [
        'Business process analysis',
        'Requirements engineering',
        'Advanced data analysis',
        'KPI design',
        'Root-cause analysis',
        'Process optimization',
        'Stakeholder management',
        'Cost-benefit analysis',
        'Data-driven decision making',
      ],
      scenarios: [
        'Revenue increased 20%, but profit decreased 10%. Diagnose the possible causes and present your recommendations.',
      ],
      questionCount: 7,
      passMark: 65,
      estimatedMinutes: '15–22',
      aiRole: 'manager',
      isCodingInterview: false,
    },
    3: {
      name: 'Senior Business / Management',
      description: 'Business strategy, market analysis, transformation leadership, financial modeling, and executive decision-making.',
      topics: [
        'Business strategy & strategic planning',
        'Market analysis',
        'Business transformation',
        'Financial/business modeling',
        'Risk management',
        'Organizational strategy',
        'Competitive strategy',
        'Executive decision-making',
        'Leadership',
      ],
      scenarios: [
        'A profitable company has two possible expansion markets: one large and highly competitive, one smaller but growing rapidly. Which would you choose and why?',
      ],
      questionCount: 8,
      passMark: 70,
      estimatedMinutes: '20–30',
      aiRole: 'manager',
      isCodingInterview: false,
    },
  },

  'Finance & Accounting': {
    1: {
      name: 'Junior Finance / Accounting',
      description: 'Accounting fundamentals, financial statements, basic financial ratios, and numerical accuracy.',
      topics: [
        'Accounting fundamentals (debit/credit)',
        'Journal entries',
        'Financial statements (P&L, Balance Sheet, Cash Flow)',
        'Revenue, expenses, assets & liabilities',
        'Basic budgeting',
        'Basic financial ratios',
        'Basic financial analysis',
        'Attention to numerical detail',
      ],
      scenarios: [
        'A company has $500,000 in revenue and $350,000 in expenses. What is its operating profit and what does this tell you?',
      ],
      questionCount: 6,
      passMark: 60,
      estimatedMinutes: '12–18',
      aiRole: 'interviewer',
      isCodingInterview: false,
    },
    2: {
      name: 'Mid-level Finance / Accounting',
      description: 'Financial analysis, forecasting, variance analysis, cash-flow analysis, and business interpretation.',
      topics: [
        'Financial analysis',
        'Budgeting & forecasting',
        'Variance analysis',
        'Cash-flow analysis',
        'Financial ratios (advanced)',
        'Cost analysis',
        'Financial reporting',
        'Risk analysis',
        'Financial modeling basics',
      ],
      scenarios: [
        'Revenue is growing 15% every year, but cash flow has become negative. What could be causing this and what would you do?',
      ],
      questionCount: 7,
      passMark: 65,
      estimatedMinutes: '15–22',
      aiRole: 'interviewer',
      isCodingInterview: false,
    },
    3: {
      name: 'Senior Finance',
      description: 'Corporate finance strategy, capital allocation, investment decisions, valuation, and financial leadership.',
      topics: [
        'Financial strategy',
        'Corporate finance',
        'Investment decisions & capital allocation',
        'Financial forecasting (advanced)',
        'Risk management',
        'Valuation methods',
        'Strategic budgeting',
        'Financial leadership',
        'Business strategy alignment',
      ],
      scenarios: [
        'The company has $10M available. Should it acquire a competitor, invest in expansion, or return capital to shareholders? Walk through your decision framework.',
      ],
      questionCount: 8,
      passMark: 70,
      estimatedMinutes: '20–30',
      aiRole: 'interviewer',
      isCodingInterview: false,
    },
  },

  'Project Management': {
    1: {
      name: 'Junior Project Coordinator',
      description: 'Project management fundamentals, scheduling, task management, and basic problem-solving in project contexts.',
      topics: [
        'Project management fundamentals',
        'Project lifecycle',
        'Task management & scheduling',
        'Basic risk management',
        'Documentation',
        'Stakeholder communication',
        'Team coordination',
        'Basic Agile/Scrum concepts',
      ],
      scenarios: [
        'Two team members are unavailable and an important task is due tomorrow. What would you do?',
      ],
      questionCount: 6,
      passMark: 60,
      estimatedMinutes: '12–18',
      aiRole: 'manager',
      isCodingInterview: false,
    },
    2: {
      name: 'Mid-level Project Manager',
      description: 'Project planning, scope management, risk management, resource allocation, and client stakeholder management.',
      topics: [
        'Project planning & scope management',
        'Risk management',
        'Resource & budget management',
        'Stakeholder management',
        'Agile/Scrum',
        'Project metrics & KPIs',
        'Dependency management',
        'Conflict resolution',
        'Project recovery',
      ],
      scenarios: [
        'Your project is two weeks behind schedule and the client refuses to move the deadline. What do you do?',
      ],
      questionCount: 7,
      passMark: 65,
      estimatedMinutes: '15–22',
      aiRole: 'manager',
      isCodingInterview: false,
    },
    3: {
      name: 'Senior Project / Program Manager',
      description: 'Program management, portfolio thinking, executive stakeholder management, budget ownership, and strategic leadership.',
      topics: [
        'Program management',
        'Portfolio thinking',
        'Strategic planning',
        'Resource allocation (organizational)',
        'Organizational risk management',
        'Executive stakeholder management',
        'Budget ownership',
        'Change management',
        'Governance & leadership',
      ],
      scenarios: [
        'Three major projects need the same engineering team, but the company can only fund two. How would you decide which to proceed with?',
      ],
      questionCount: 8,
      passMark: 70,
      estimatedMinutes: '20–30',
      aiRole: 'manager',
      isCodingInterview: false,
    },
  },

  'Administration': {
    1: {
      name: 'Junior Administration',
      description: 'Office procedures, scheduling, communication, document management, and professional conduct.',
      topics: [
        'Office procedures & scheduling',
        'Email & professional communication',
        'Document management',
        'Meeting coordination',
        'Data entry & basic spreadsheets',
        'Customer/visitor handling',
        'Confidentiality',
        'Time management & prioritization',
      ],
      scenarios: [
        'Your manager has asked you to schedule three meetings, but two clients are only available at the same time. How would you handle it?',
      ],
      questionCount: 6,
      passMark: 60,
      estimatedMinutes: '12–18',
      aiRole: 'manager',
      isCodingInterview: false,
    },
    2: {
      name: 'Mid-level Administration / Operations',
      description: 'Office operations management, process improvement, vendor coordination, and administrative problem-solving.',
      topics: [
        'Office operations management',
        'Process improvement',
        'Vendor coordination',
        'Budget tracking',
        'Resource management',
        'Team coordination',
        'Complex scheduling',
        'Reporting & administrative analytics',
        'Stakeholder communication',
      ],
      scenarios: [
        'Your office operating costs increased 20% this quarter. How would you investigate and propose reductions?',
      ],
      questionCount: 7,
      passMark: 65,
      estimatedMinutes: '15–22',
      aiRole: 'manager',
      isCodingInterview: false,
    },
    3: {
      name: 'Senior Administration / Operations',
      description: 'Operations strategy, resource planning, cost optimization, process redesign, and organizational leadership.',
      topics: [
        'Operations strategy',
        'Resource planning',
        'Budget management',
        'Process optimization & redesign',
        'Vendor management',
        'Organizational coordination',
        'Risk management',
        'Policy development',
        'Team leadership',
        'Operational performance management',
      ],
      scenarios: [
        'The organization wants to reduce operational costs by 20% without reducing headcount. Present your strategic plan.',
      ],
      questionCount: 8,
      passMark: 70,
      estimatedMinutes: '20–30',
      aiRole: 'manager',
      isCodingInterview: false,
    },
  },
};

/**
 * Returns true if the given stack/sector value is a business sector (not a tech stack).
 */
const isSector = (value) => SECTORS.includes(value);

/**
 * Get the level spec for a sector (or fall back to generic if not found).
 */
const getSectorLevelSpec = (sector, level) => {
  const sectorSpec = SECTOR_LEVEL_SPECS[sector];
  if (!sectorSpec) return null;
  return sectorSpec[level] || sectorSpec[1];
};

module.exports = { SECTORS, SECTOR_LEVEL_SPECS, isSector, getSectorLevelSpec };
