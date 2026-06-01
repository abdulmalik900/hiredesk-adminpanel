export const INITIAL_EMPTY_STATE = {
  candidates: [],
  jobs: [],
  interviews: [],
  recruiters: [],
  companies: [],
  communications: [],
  settings: {
    systemName: "HireDesk CRM",
    allowSelfRegistration: true,
    notificationEmails: "hr@hiredesk.com",
    autoArchiveRejected: false,
    selectedTheme: "plum-cream"
  }
};

export const getDemoData = () => {
  const recruiters = [
    { id: "R001", name: "Sarah Connor", email: "sarah.c@hiredesk.com", role: "Lead Recruiter", activeCandidates: 8, rating: 4.8 },
    { id: "R002", name: "David Miller", email: "david.m@hiredesk.com", role: "Technical Recruiter", activeCandidates: 12, rating: 4.6 },
    { id: "R003", name: "Elena Rostova", email: "elena.r@hiredesk.com", role: "Executive Headhunter", activeCandidates: 5, rating: 4.9 },
    { id: "R004", name: "Marcus Aurelius", email: "marcus.a@hiredesk.com", role: "Talent Scout", activeCandidates: 4, rating: 4.4 }
  ];

  const jobs = [
    { id: "J001", title: "Senior React Engineer", department: "Engineering", type: "Full-time", status: "Open", location: "Remote, US", applicantsCount: 42, salary: "$130k - $160k" },
    { id: "J002", title: "UI/UX Product Designer", department: "Design", type: "Full-time", status: "Open", location: "New York, NY", applicantsCount: 28, salary: "$100k - $120k" },
    { id: "J003", title: "Technical Project Manager", department: "Operations", type: "Contract", status: "Open", location: "Hybrid, SF", applicantsCount: 15, salary: "$90/hr - $110/hr" },
    { id: "J004", title: "DevOps specialist (AWS)", department: "Infrastructure", type: "Remote", status: "Open", location: "Remote, EU", applicantsCount: 19, salary: "$120k - $140k" },
    { id: "J005", title: "Intern Frontend Developer", department: "Engineering", type: "Part-time", status: "Closed", location: "San Francisco, CA", applicantsCount: 88, salary: "$30/hr" }
  ];

  const companies = [
    { id: "C001", name: "Google Inc.", industry: "Technology", openRolesCount: 14, readyCandidatesCount: 2 },
    { id: "C002", name: "Stripe", industry: "Fintech", openRolesCount: 8, readyCandidatesCount: 1 },
    { id: "C003", name: "Airbnb", industry: "Hospitality / Tech", openRolesCount: 4, readyCandidatesCount: 1 },
    { id: "C004", name: "Spotify", industry: "Media Streaming", openRolesCount: 6, readyCandidatesCount: 1 }
  ];

  const candidates = [
    {
      id: "CAND001",
      name: "Alex Rivera",
      email: "alex.rivera@email.com",
      phone: "+1 (555) 234-5678",
      role: "Senior React Engineer",
      experience: "6 years",
      status: "ready", // Ready for Interview
      recruiterId: "R002",
      companyId: "C001", // Hooked to Google
      score: 94,
      notes: "Outstanding performance in system architecture test. Highly skilled in React 19, Redux, and Node.js.",
      appliedDate: "2026-05-12",
      resume: {
        summary: "Passionate developer focused on building interactive web frontends. Expert at optimizing performance and leading agile engineering teams.",
        skills: ["React", "TypeScript", "Next.js", "GraphQL", "Tailwind CSS"],
        history: "Senior Developer at WebFlow (3 years), Frontend Developer at StackOverflow (3 years)"
      }
    },
    {
      id: "CAND002",
      name: "Samantha Chen",
      email: "samantha.c@email.com",
      phone: "+1 (555) 987-6543",
      role: "UI/UX Product Designer",
      experience: "4 years",
      status: "ready", // Ready for Interview
      recruiterId: "R001",
      companyId: "C002", // Hooked to Stripe
      score: 89,
      notes: "Incredible design portfolio. Clear typography hierarchy and beautiful user flows. Ready for company interviews.",
      appliedDate: "2026-05-14",
      resume: {
        summary: "Creative product designer dedicated to clean interfaces. Focuses on user-centric layouts and comprehensive design systems.",
        skills: ["Figma", "Sketch", "Prototyping", "Design Systems", "HTML/CSS"],
        history: "Product Designer at Pinterest (2.5 years), Associate Designer at InVision (1.5 years)"
      }
    },
    {
      id: "CAND003",
      name: "Marcus Brody",
      email: "marcus.b@email.com",
      phone: "+1 (555) 345-6789",
      role: "DevOps specialist (AWS)",
      experience: "8 years",
      status: "hired",
      recruiterId: "R002",
      companyId: "C004", // Placed at Spotify
      score: 91,
      notes: "Great Cloud Architecture insights. Accepted Spotify's contract offer. Starting on June 15th.",
      appliedDate: "2026-04-20",
      resume: {
        summary: "Infrastructure engineer specialized in AWS, Docker, Kubernetes, and CI/CD automation pipelines.",
        skills: ["AWS", "Kubernetes", "Docker", "Terraform", "GitHub Actions"],
        history: "DevOps Team Lead at Twilio (4 years), Cloud Architect at Netlify (4 years)"
      }
    },
    {
      id: "CAND004",
      name: "Tariq Malik",
      email: "tariq.malik@email.com",
      phone: "+1 (555) 456-7890",
      role: "Senior React Engineer",
      experience: "7 years",
      status: "ready", // Ready for Interview
      recruiterId: "R002",
      companyId: "C001", // Ready for Google
      score: 95,
      notes: "Exceptional code quality. Solved complex React state problems easily. Ready for final partner interviews.",
      appliedDate: "2026-05-18",
      resume: {
        summary: "Software Engineer focusing on performant UI architecture. Active contributor to open-source libraries.",
        skills: ["React", "Web Performance", "TypeScript", "NodeJS", "Zustand"],
        history: "Tech Lead at Vercel (3 years), Software Engineer at Gatsby (4 years)"
      }
    },
    {
      id: "CAND005",
      name: "Jessica Taylor",
      email: "jessica.t@email.com",
      phone: "+1 (555) 567-8901",
      role: "Technical Project Manager",
      experience: "5 years",
      status: "interview",
      recruiterId: "R003",
      companyId: null,
      score: 83,
      notes: "Very energetic and structured communicator. Interview scheduled for May 29th.",
      appliedDate: "2026-05-22",
      resume: {
        summary: "Agile Project Manager leading high-performing cross-functional developer teams. Certified Scrum Master (CSM).",
        skills: ["Agile", "Scrum", "Jira", "Risk Management", "Stakeholder Communication"],
        history: "Project Manager at Asana (2.5 years), Agile Coach at Trello (2.5 years)"
      }
    },
    {
      id: "CAND006",
      name: "David Kim",
      email: "david.kim@email.com",
      phone: "+1 (555) 678-9012",
      role: "Senior React Engineer",
      experience: "5 years",
      status: "assessment",
      recruiterId: "R002",
      companyId: null,
      score: 79,
      notes: "Coding assessment in progress. Expressed interest in scaling challenges.",
      appliedDate: "2026-05-25",
      resume: {
        summary: "Full Stack Engineer with strong React frontends and Node/Python backends. Prefers startup environments.",
        skills: ["React", "NodeJS", "Python", "PostgreSQL", "Tailwind CSS"],
        history: "Full Stack Engineer at Retool (3 years), Software Engineer at AngelList (2 years)"
      }
    },
    {
      id: "CAND007",
      name: "Olivia Hansen",
      email: "olivia.h@email.com",
      phone: "+1 (555) 789-0123",
      role: "UI/UX Product Designer",
      experience: "6 years",
      status: "screening",
      recruiterId: "R001",
      companyId: null,
      score: 85,
      notes: "Initial phone screening went really well. Confirmed salary expectations align. Moving to assessment stage.",
      appliedDate: "2026-05-28",
      resume: {
        summary: "UX Designer specializing in research, wireframing, and creating robust interactive prototypes.",
        skills: ["UX Research", "Figma", "Wireframing", "A/B Testing", "CSS Grid"],
        history: "Interaction Designer at Mailchimp (4 years), UX Consultant at freelance (2 years)"
      }
    },
    {
      id: "CAND008",
      name: "Lucas Vanzetti",
      email: "lucas.v@email.com",
      phone: "+1 (555) 890-1234",
      role: "DevOps specialist (AWS)",
      experience: "9 years",
      status: "ready", // Ready for Interview
      recruiterId: "R002",
      companyId: "C003", // Airbnb
      score: 93,
      notes: "Strong knowledge of Kubernetes cluster security. Excellent communications skills.",
      appliedDate: "2026-05-10",
      resume: {
        summary: "DevOps Engineer focusing on containerized scalability and AWS cloud spending optimization.",
        skills: ["Terraform", "AWS", "EKS", "Prometheus", "CI/CD"],
        history: "Senior Infrastructure Engineer at HashiCorp (4 years), DevOps Engineer at Heroku (5 years)"
      }
    },
    {
      id: "CAND009",
      name: "Sophia Martinez",
      email: "sophia.m@email.com",
      phone: "+1 (555) 901-2345",
      role: "Technical Project Manager",
      experience: "7 years",
      status: "offer",
      recruiterId: "R003",
      companyId: null,
      score: 88,
      notes: "Written offer extended. Waiting for candidate signature and response.",
      appliedDate: "2026-05-08",
      resume: {
        summary: "Product-oriented Technical Project Manager with background in software architecture.",
        skills: ["Program Management", "Systems Analysis", "Product Strategy", "Confluence", "SQL"],
        history: "Technical PM at Slack (3 years), Software Developer at Yahoo (4 years)"
      }
    },
    {
      id: "CAND010",
      name: "Ethan Wright",
      email: "ethan.w@email.com",
      phone: "+1 (555) 012-3456",
      role: "Intern Frontend Developer",
      experience: "1 year",
      status: "applied",
      recruiterId: "R004",
      companyId: null,
      score: 72,
      notes: "Fresh graduate from Stanford. Shows potential. Needs screening test.",
      appliedDate: "2026-05-30",
      resume: {
        summary: "Computer Science graduate with React projects. Eager to learn frontend testing.",
        skills: ["JavaScript", "React", "HTML5", "CSS3", "Git"],
        history: "Teaching Assistant at Stanford (1 year), Engineering Intern at Stripe (3 months)"
      }
    },
    {
      id: "CAND011",
      name: "Amara Okoye",
      email: "amara.o@email.com",
      phone: "+1 (555) 123-4500",
      role: "Senior React Engineer",
      experience: "8 years",
      status: "rejected",
      recruiterId: "R002",
      companyId: null,
      score: 65,
      notes: "Rejected due to mismatch in functional programming test. Kept in database for future non-core roles.",
      appliedDate: "2026-05-02",
      resume: {
        summary: "Frontend Developer focusing on React Native and hybrid mobile setups.",
        skills: ["React Native", "Cordova", "AngularJS", "CSS Modules"],
        history: "Mobile Architect at Ionic (4 years), Developer at PhoneGap (4 years)"
      }
    },
    {
      id: "CAND012",
      name: "Liam O'Connor",
      email: "liam.oc@email.com",
      phone: "+1 (555) 234-5600",
      role: "Intern Frontend Developer",
      experience: "6 months",
      status: "applied",
      recruiterId: "R004",
      companyId: null,
      score: 80,
      notes: "Self-taught developer. Highly polished personal website. Great styling abilities.",
      appliedDate: "2026-05-31",
      resume: {
        summary: "Talented self-taught programmer focusing on clean CSS design and responsive layout strategies.",
        skills: ["CSS Grid", "React", "Figma", "HTML5", "SVG Animation"],
        history: "Freelance Web Designer (1 year)"
      }
    }
  ];

  const interviews = [
    {
      id: "INT001",
      candidateId: "CAND005",
      candidateName: "Jessica Taylor",
      jobTitle: "Technical Project Manager",
      recruiterId: "R003",
      dateTime: "2026-06-02T14:00:00",
      type: "Technical",
      status: "Scheduled"
    },
    {
      id: "INT002",
      candidateId: "CAND006",
      candidateName: "David Kim",
      jobTitle: "Senior React Engineer",
      recruiterId: "R002",
      dateTime: "2026-06-03T10:30:00",
      type: "System Design",
      status: "Scheduled"
    },
    {
      id: "INT003",
      candidateId: "CAND007",
      candidateName: "Olivia Hansen",
      jobTitle: "UI/UX Product Designer",
      recruiterId: "R001",
      dateTime: "2026-06-04T16:00:00",
      type: "HR",
      status: "Scheduled"
    },
    {
      id: "INT004",
      candidateId: "CAND001",
      candidateName: "Alex Rivera",
      jobTitle: "Senior React Engineer",
      recruiterId: "R002",
      dateTime: "2026-05-29T11:00:00",
      type: "Technical",
      status: "Completed"
    }
  ];

  const communications = [
    {
      id: "COM001",
      candidateId: "CAND001",
      candidateName: "Alex Rivera",
      subject: "HireDesk CRM: Code Assessment Passed!",
      sentDate: "2026-05-26 14:22",
      content: "Hello Alex,\n\nCongratulations! You passed our core React Coding assessment with a score of 94/100.\nWe are moving you to the 'Ready for Interview' status and recommending you to Google Inc. for their active roles.\n\nBest,\nDavid Miller",
      status: "Sent"
    },
    {
      id: "COM002",
      candidateId: "CAND005",
      candidateName: "Jessica Taylor",
      subject: "HireDesk CRM: Technical Interview Details",
      sentDate: "2026-05-29 09:15",
      content: "Hello Jessica,\n\nYour Technical interview is scheduled for Tuesday, June 2nd, at 2:00 PM EST.\nIt will be a Google Meet session with Elena Rostova.\n\nThanks,\nSarah Connor",
      status: "Sent"
    },
    {
      id: "COM003",
      candidateId: "CAND011",
      candidateName: "Amara Okoye",
      subject: "Application Update: Senior React Engineer",
      sentDate: "2026-05-02 17:00",
      content: "Hello Amara,\n\nThank you for taking the time to interview with us. Unfortunately, we will not be moving forward with your application at this time...\n\nSincerely,\nHireDesk HR Team",
      status: "Sent"
    }
  ];

  return {
    candidates,
    jobs,
    interviews,
    recruiters,
    companies,
    communications,
    settings: {
      systemName: "HireDesk CRM",
      allowSelfRegistration: true,
      notificationEmails: "hr@hiredesk.com",
      autoArchiveRejected: false,
      selectedTheme: "plum-cream"
    }
  };
};
