/**
 * Job data utilities — JSearch (RapidAPI) live feed with mock fallback.
 * Set RAPIDAPI_KEY to enable live data; omit to use the mock pool.
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
  skills: string[];
}

// ---------------------------------------------------------------------------
// Skill extraction — infer required skills from job description text
// ---------------------------------------------------------------------------
const SKILL_KEYWORDS = [
  "Python", "TypeScript", "JavaScript", "Go", "Golang", "Rust", "Java", "Kotlin",
  "C++", "C#", "Ruby", "PHP", "Swift", "Scala", "R",
  "React", "Vue", "Angular", "Next.js", "Node.js", "Express", "FastAPI", "Django",
  "Flask", "Spring Boot", "Ruby on Rails", "Rails",
  "PostgreSQL", "MySQL", "SQLite", "MongoDB", "DynamoDB", "Redis", "Elasticsearch",
  "Cassandra", "BigQuery", "Snowflake",
  "AWS", "GCP", "Azure", "Terraform", "Kubernetes", "Docker", "Helm", "Pulumi",
  "Kafka", "RabbitMQ", "Spark", "Airflow", "dbt", "Flink",
  "Machine Learning", "Deep Learning", "NLP", "LLMs", "PyTorch", "TensorFlow",
  "scikit-learn", "MLOps", "Kubeflow", "CUDA",
  "REST APIs", "GraphQL", "gRPC", "Microservices", "Distributed Systems",
  "System Design", "Data Pipelines", "SQL", "NoSQL", "Statistics",
  "React Native", "Expo", "Flutter",
  "Git", "CI/CD", "Agile", "Scrum",
];

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter((skill) =>
    lower.includes(skill.toLowerCase())
  );
}

// ---------------------------------------------------------------------------
// JSearch API
// ---------------------------------------------------------------------------
interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city: string | null;
  job_state: string | null;
  job_country: string | null;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_description: string;
  job_posted_at_datetime_utc: string | null;
  job_apply_link: string;
  job_required_skills: string[] | null;
}

function jsearchJobToRaw(j: JSearchJob): RawJob {
  const city = j.job_city ?? "";
  const state = j.job_state ?? j.job_country ?? "";
  const location = city && state ? `${city}, ${state}` : city || state || "Unknown";

  const skills =
    j.job_required_skills && j.job_required_skills.length > 0
      ? j.job_required_skills
      : extractSkills(j.job_description);

  return {
    id: j.job_id,
    title: j.job_title,
    company: j.employer_name,
    location,
    salary: j.job_min_salary ?? null,
    salaryMax: j.job_max_salary ?? null,
    description: j.job_description.slice(0, 400),
    postedAt: j.job_posted_at_datetime_utc ?? new Date().toISOString(),
    source: "JSearch",
    url: j.job_apply_link,
    skills,
  };
}

async function fetchFromJSearch(query: string, page = 1): Promise<RawJob[]> {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) return [];

  const url = new URL("https://jsearch.p.rapidapi.com/search");
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("num_pages", "1");
  url.searchParams.set("date_posted", "week");

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "X-RapidAPI-Key": key,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });

    if (!res.ok) {
      console.error(`JSearch error ${res.status}: ${await res.text()}`);
      return [];
    }

    const json = await res.json() as { data?: JSearchJob[] };
    return (json.data ?? []).map(jsearchJobToRaw);
  } catch (err) {
    console.error("JSearch fetch failed:", err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Mock pool (fallback when no API key is set)
// ---------------------------------------------------------------------------
const MOCK_POOL: RawJob[] = [
  {
    id: "job-001",
    title: "Senior Software Engineer",
    company: "Stripe",
    location: "Toronto, ON",
    salary: 160000,
    salaryMax: 200000,
    description: "Build scalable payment infrastructure using Go, Python, and Kubernetes. Design APIs consumed by millions of developers.",
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    source: "Mock",
    url: "https://stripe.com/jobs",
    skills: ["Python", "Go", "Kubernetes", "PostgreSQL", "REST APIs", "Distributed Systems"],
  },
  {
    id: "job-002",
    title: "Staff Software Engineer",
    company: "Shopify",
    location: "Ottawa, ON",
    salary: 180000,
    salaryMax: 220000,
    description: "Lead cross-functional engineering initiatives. Own technical roadmap for Ruby on Rails monolith migration.",
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    source: "Mock",
    url: "https://shopify.com/careers",
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
    source: "Mock",
    url: "https://rbc.com/careers",
    skills: ["Python", "Machine Learning", "SQL", "PyTorch", "Spark", "Statistics"],
  },
  {
    id: "job-004",
    title: "Machine Learning Engineer",
    company: "Cohere",
    location: "Toronto, ON",
    salary: 155000,
    salaryMax: 195000,
    description: "Train and deploy large language models. Work with CUDA, PyTorch, and distributed training.",
    postedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    source: "Mock",
    url: "https://cohere.com/careers",
    skills: ["Python", "PyTorch", "Machine Learning", "NLP", "CUDA", "Distributed Systems", "LLMs"],
  },
  {
    id: "job-005",
    title: "Principal Software Engineer",
    company: "Wealthsimple",
    location: "Toronto, ON",
    salary: 190000,
    salaryMax: 230000,
    description: "Set technical direction for fintech platform. React, AWS, and PostgreSQL stack. Focus on reliability, performance, and security.",
    postedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    source: "Mock",
    url: "https://wealthsimple.com/jobs",
    skills: ["React", "TypeScript", "AWS", "PostgreSQL", "System Design"],
  },
  {
    id: "job-006",
    title: "Senior ML Engineer",
    company: "Layer6 AI (TD)",
    location: "Toronto, ON",
    salary: 160000,
    salaryMax: 195000,
    description: "Build production ML systems for fraud, recommendations, and risk scoring. Python, TensorFlow, Spark, and Kafka.",
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    source: "Mock",
    url: "https://td.com/careers",
    skills: ["Python", "TensorFlow", "Machine Learning", "Spark", "Kafka", "SQL", "MLOps"],
  },
  {
    id: "job-007",
    title: "Software Engineer II",
    company: "Snowflake",
    location: "San Francisco, CA",
    salary: 175000,
    salaryMax: 210000,
    description: "Build core query execution engine. Optimize distributed SQL queries at petabyte scale.",
    postedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    source: "Mock",
    url: "https://snowflake.com/careers",
    skills: ["Java", "C++", "SQL", "Distributed Systems", "PostgreSQL"],
  },
  {
    id: "job-008",
    title: "Senior Backend Engineer",
    company: "Clio",
    location: "Vancouver, BC",
    salary: 145000,
    salaryMax: 175000,
    description: "Scale legal practice management SaaS. Ruby on Rails, React, AWS, Elasticsearch.",
    postedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    source: "Mock",
    url: "https://clio.com/careers",
    skills: ["Ruby on Rails", "React", "AWS", "Elasticsearch", "PostgreSQL", "REST APIs"],
  },
  {
    id: "job-009",
    title: "Data Engineer",
    company: "Loblaw Digital",
    location: "Toronto, ON",
    salary: 120000,
    salaryMax: 150000,
    description: "Build data pipelines for retail analytics. Python, dbt, BigQuery, Airflow.",
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    source: "Mock",
    url: "https://loblaw.ca/careers",
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
    source: "Mock",
    url: "https://faire.com/careers",
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
    source: "Mock",
    url: "https://ritual.co/careers",
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
    source: "Mock",
    url: "https://lightspeedhq.com/careers",
    skills: ["Go", "Kubernetes", "gRPC", "PostgreSQL", "Kafka", "Distributed Systems"],
  },
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

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

export async function getJobsByRoleAndLocation(
  role: string,
  location: string,
  page = 1
): Promise<{ jobs: RawJob[]; total: number; page: number }> {
  if (process.env.RAPIDAPI_KEY) {
    const query = location
      ? `${role} in ${location}`
      : role;
    const jobs = await fetchFromJSearch(query, page);
    if (jobs.length > 0) {
      return { jobs, total: jobs.length, page };
    }
  }

  // Fallback to mock
  const lowerRole = role.toLowerCase();
  const lowerLocation = location.toLowerCase();
  const filtered = MOCK_POOL.filter((job) => {
    const titleMatch =
      job.title.toLowerCase().includes(lowerRole) ||
      lowerRole.includes(job.title.toLowerCase().split(" ")[0]?.toLowerCase() ?? "");
    const locationMatch =
      !lowerLocation ||
      lowerLocation === "anywhere" ||
      lowerLocation === "remote" ||
      job.location.toLowerCase().includes(lowerLocation.split(",")[0]?.trim() ?? "");
    return titleMatch || locationMatch;
  });
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  return { jobs: filtered.slice(start, start + pageSize), total: filtered.length, page };
}

export async function getAllJobs(): Promise<RawJob[]> {
  if (process.env.RAPIDAPI_KEY) {
    const [ca, us] = await Promise.all([
      fetchFromJSearch("software engineer developer Canada", 1),
      fetchFromJSearch("software engineer developer United States", 1),
    ]);
    const combined = [...ca, ...us];
    if (combined.length > 0) return combined;
  }
  return MOCK_POOL;
}
