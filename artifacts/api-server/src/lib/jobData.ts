/**
 * Job data utilities — mock job pool simulating Adzuna-style responses.
 * Replace fetchFromAdzuna with a real HTTP call once ADZUNA_APP_ID / ADZUNA_APP_KEY are set.
 */

export interface RawJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: number | null;
  salaryMax: number | null;
  description: string;
  postedAt: string;
  source: string;
  url: string;
  skills: string[]; // extracted required skills
}

const JOB_POOL: RawJob[] = [
  {
    id: "job-001",
    title: "Senior Software Engineer",
    company: "Stripe",
    location: "Toronto, ON",
    salary: 160000,
    salaryMax: 200000,
    description: "Build scalable payment infrastructure using Go, Python, and Kubernetes. Design APIs consumed by millions of developers. Strong CS fundamentals required.",
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    source: "Adzuna",
    url: "https://www.adzuna.ca/details/job-001",
    skills: ["Python", "Go", "Kubernetes", "PostgreSQL", "REST APIs", "Distributed Systems"],
  },
  {
    id: "job-002",
    title: "Staff Software Engineer",
    company: "Shopify",
    location: "Ottawa, ON",
    salary: 180000,
    salaryMax: 220000,
    description: "Lead cross-functional engineering initiatives. Own technical roadmap for Ruby on Rails monolith migration. Mentor junior engineers.",
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    source: "Adzuna",
    url: "https://www.adzuna.ca/details/job-002",
    skills: ["Ruby on Rails", "React", "TypeScript", "PostgreSQL", "Redis", "Distributed Systems"],
  },
  {
    id: "job-003",
    title: "Senior Data Scientist",
    company: "RBC",
    location: "Toronto, ON",
    salary: 140000,
    salaryMax: 170000,
    description: "Build ML models for credit risk, fraud detection, and customer segmentation using Python, PyTorch, and Spark.",
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    source: "Adzuna",
    url: "https://www.adzuna.ca/details/job-003",
    skills: ["Python", "Machine Learning", "SQL", "PyTorch", "Spark", "Statistics"],
  },
  {
    id: "job-004",
    title: "Machine Learning Engineer",
    company: "Cohere",
    location: "Toronto, ON",
    salary: 155000,
    salaryMax: 195000,
    description: "Train and deploy large language models. Work with CUDA, PyTorch, and distributed training. Research background in NLP preferred.",
    postedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    source: "Adzuna",
    url: "https://www.adzuna.ca/details/job-004",
    skills: ["Python", "PyTorch", "Machine Learning", "NLP", "CUDA", "Distributed Systems", "LLMs"],
  },
  {
    id: "job-005",
    title: "Principal Software Engineer",
    company: "Wealthsimple",
    location: "Toronto, ON",
    salary: 190000,
    salaryMax: 230000,
    description: "Set technical direction for fintech platform. Ruby, React, AWS, and PostgreSQL stack. Focus on reliability, performance, and security.",
    postedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    source: "Adzuna",
    url: "https://www.adzuna.ca/details/job-005",
    skills: ["Ruby", "React", "TypeScript", "AWS", "PostgreSQL", "System Design"],
  },
  {
    id: "job-006",
    title: "Senior Machine Learning Engineer",
    company: "Layer6 AI (TD)",
    location: "Toronto, ON",
    salary: 160000,
    salaryMax: 195000,
    description: "Build production ML systems for fraud, recommendations, and risk scoring. Python, TensorFlow, Spark, and Kafka.",
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    source: "Adzuna",
    url: "https://www.adzuna.ca/details/job-006",
    skills: ["Python", "TensorFlow", "Machine Learning", "Spark", "Kafka", "SQL", "MLOps"],
  },
  {
    id: "job-007",
    title: "Software Engineer II",
    company: "Snowflake",
    location: "San Francisco, CA",
    salary: 175000,
    salaryMax: 210000,
    description: "Build core query execution engine in Java and C++. Optimize distributed SQL queries at petabyte scale.",
    postedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    source: "Adzuna",
    url: "https://www.adzuna.com/details/job-007",
    skills: ["Java", "C++", "SQL", "Distributed Systems", "PostgreSQL", "Performance"],
  },
  {
    id: "job-008",
    title: "Senior Backend Engineer",
    company: "Clio",
    location: "Vancouver, BC",
    salary: 145000,
    salaryMax: 175000,
    description: "Scale legal practice management SaaS. Ruby on Rails, React, AWS, Elasticsearch. Strong ownership culture.",
    postedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    source: "Adzuna",
    url: "https://www.adzuna.ca/details/job-008",
    skills: ["Ruby on Rails", "React", "AWS", "Elasticsearch", "PostgreSQL", "REST APIs"],
  },
  {
    id: "job-009",
    title: "Data Engineer",
    company: "Loblaw Digital",
    location: "Toronto, ON",
    salary: 120000,
    salaryMax: 150000,
    description: "Build data pipelines for retail analytics. Python, dbt, BigQuery, Airflow. Work closely with ML and analytics teams.",
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    source: "Adzuna",
    url: "https://www.adzuna.ca/details/job-009",
    skills: ["Python", "SQL", "dbt", "BigQuery", "Airflow", "Data Pipelines"],
  },
  {
    id: "job-010",
    title: "Senior ML Platform Engineer",
    company: "Faire",
    location: "Toronto, ON",
    salary: 170000,
    salaryMax: 205000,
    description: "Build MLOps platform to serve and monitor ML models in production. Python, Kubernetes, Kubeflow, Terraform.",
    postedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    source: "Adzuna",
    url: "https://www.adzuna.ca/details/job-010",
    skills: ["Python", "Machine Learning", "Kubernetes", "MLOps", "Terraform", "Kubeflow"],
  },
  {
    id: "job-011",
    title: "Full Stack Engineer",
    company: "Ritual",
    location: "Toronto, ON",
    salary: 130000,
    salaryMax: 160000,
    description: "Build consumer-facing food ordering features with React Native, React, Node.js, and PostgreSQL.",
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    source: "Adzuna",
    url: "https://www.adzuna.ca/details/job-011",
    skills: ["React", "React Native", "Node.js", "TypeScript", "PostgreSQL", "REST APIs"],
  },
  {
    id: "job-012",
    title: "Senior Software Engineer – Platform",
    company: "Lightspeed Commerce",
    location: "Montreal, QC",
    salary: 150000,
    salaryMax: 185000,
    description: "Build platform services for point-of-sale and commerce. Go, Kubernetes, gRPC, PostgreSQL, Kafka.",
    postedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    source: "Adzuna",
    url: "https://www.adzuna.ca/details/job-012",
    skills: ["Go", "Kubernetes", "gRPC", "PostgreSQL", "Kafka", "Distributed Systems"],
  },
];

function normalizeSkill(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function scoreMatch(
  userSkills: string[],
  jobSkills: string[]
): { matchScore: number; matchedSkills: string[]; missingSkills: string[] } {
  const normalizedUserSkills = userSkills.map(normalizeSkill);
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const skill of jobSkills) {
    if (normalizedUserSkills.includes(normalizeSkill(skill))) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const matchScore =
    jobSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / jobSkills.length) * 100);

  return { matchScore, matchedSkills, missingSkills };
}

export function getJobsByRoleAndLocation(role: string, location: string, page = 1): {
  jobs: RawJob[];
  total: number;
  page: number;
} {
  const lowerRole = role.toLowerCase();
  const lowerLocation = location.toLowerCase();

  const filtered = JOB_POOL.filter((job) => {
    const titleMatch =
      job.title.toLowerCase().includes(lowerRole) ||
      lowerRole.includes(job.title.toLowerCase().split(" ")[0]?.toLowerCase() ?? "");
    const locationMatch =
      lowerLocation === "" ||
      lowerLocation === "anywhere" ||
      lowerLocation === "remote" ||
      job.location.toLowerCase().includes(lowerLocation.split(",")[0]?.trim() ?? "");
    return titleMatch || locationMatch;
  });

  const pageSize = 10;
  const start = (page - 1) * pageSize;
  return {
    jobs: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
  };
}

export function getAllJobs(): RawJob[] {
  return JOB_POOL;
}
