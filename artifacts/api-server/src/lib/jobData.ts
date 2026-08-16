/**
 * Job data utilities — Adzuna live feed with mock fallback.
 * Set ADZUNA_APP_ID + ADZUNA_APP_KEY to enable live data.
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
// Skill extraction from job description text
// ---------------------------------------------------------------------------
const SKILL_KEYWORDS = [
  "Python", "TypeScript", "JavaScript", "Go", "Golang", "Rust", "Java", "Kotlin",
  "C++", "C#", "Ruby", "PHP", "Swift", "Scala", "R",
  "React", "Vue", "Angular", "Next.js", "Node.js", "Express", "FastAPI", "Django",
  "Flask", "Spring Boot", "Ruby on Rails",
  "PostgreSQL", "MySQL", "MongoDB", "DynamoDB", "Redis", "Elasticsearch",
  "Cassandra", "BigQuery", "Snowflake",
  "AWS", "GCP", "Azure", "Terraform", "Kubernetes", "Docker", "Helm",
  "Kafka", "RabbitMQ", "Spark", "Airflow", "dbt",
  "Machine Learning", "Deep Learning", "NLP", "LLMs", "PyTorch", "TensorFlow",
  "scikit-learn", "MLOps", "Kubeflow", "CUDA",
  "REST APIs", "GraphQL", "gRPC", "Microservices", "Distributed Systems",
  "System Design", "Data Pipelines", "SQL", "NoSQL",
  "React Native", "Flutter", "CI/CD", "Git",
];

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter((s) => lower.includes(s.toLowerCase()));
}

// ---------------------------------------------------------------------------
// Adzuna API
// ---------------------------------------------------------------------------
interface AdzunaJob {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  salary_min?: number;
  salary_max?: number;
  description: string;
  created: string;
  redirect_url: string;
}

function adzunaJobToRaw(j: AdzunaJob): RawJob {
  const fullText = j.description.replace(/<[^>]+>/g, "");
  // Extract skills from full description before truncating
  const skillsFromDesc = extractSkills(fullText);
  // Also infer likely skills from the job title
  const skillsFromTitle = extractSkills(j.title);
  const skills = [...new Set([...skillsFromTitle, ...skillsFromDesc])];
  return {
    id: `adzuna-${j.id}`,
    title: j.title,
    company: j.company.display_name,
    location: j.location.display_name,
    salary: j.salary_min ?? null,
    salaryMax: j.salary_max ?? null,
    description: fullText.slice(0, 400),
    postedAt: j.created,
    source: "Adzuna",
    url: j.redirect_url,
    skills,
  };
}

async function fetchFromAdzuna(
  what: string,
  where: string,
  country: "ca" | "us",
  page = 1
): Promise<RawJob[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) return [];

  const url = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`);
  url.searchParams.set("app_id", appId);
  url.searchParams.set("app_key", appKey);
  url.searchParams.set("what", what);
  if (where) url.searchParams.set("where", where);
  url.searchParams.set("results_per_page", "20");
  url.searchParams.set("content-type", "application/json");

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error(`Adzuna error ${res.status}: ${await res.text()}`);
      return [];
    }
    const json = (await res.json()) as { results?: AdzunaJob[] };
    return (json.results ?? []).map(adzunaJobToRaw);
  } catch (err) {
    console.error("Adzuna fetch failed:", err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// TTL cache — shared pool refreshed every 10 minutes
// All callers coalesce behind one in-flight request to avoid API hammering.
// ---------------------------------------------------------------------------
const CACHE_TTL_MS = 10 * 60 * 1000;
let cachedJobs: RawJob[] = [];
let cacheExpiresAt = 0;
let inflight: Promise<RawJob[]> | null = null;

function hasLiveKeys(): boolean {
  return !!(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY);
}

async function getLiveJobPool(): Promise<RawJob[]> {
  if (Date.now() < cacheExpiresAt && cachedJobs.length > 0) return cachedJobs;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      // Three simple role-title queries — Adzuna matches exact phrases in `what`
      const [eng, ml, data] = await Promise.all([
        fetchFromAdzuna("software engineer", "Canada", "ca", 1),
        fetchFromAdzuna("machine learning engineer", "Canada", "ca", 1),
        fetchFromAdzuna("data engineer", "Canada", "ca", 1),
      ]);
      // Deduplicate by id
      const seen = new Set<string>();
      const combined = [...eng, ...ml, ...data].filter((j) => {
        if (seen.has(j.id)) return false;
        seen.add(j.id);
        return true;
      });
      if (combined.length > 0) {
        cachedJobs = combined;
        cacheExpiresAt = Date.now() + CACHE_TTL_MS;
        console.log(`Adzuna: cached ${combined.length} live jobs`);
      }
      return cachedJobs.length > 0 ? cachedJobs : [];
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

// ---------------------------------------------------------------------------
// Mock pool (fallback when no API keys are set)
// ---------------------------------------------------------------------------
const MOCK_POOL: RawJob[] = [
  {
    id: "job-001", title: "Senior Software Engineer", company: "Stripe",
    location: "Toronto, ON", salary: 160000, salaryMax: 200000,
    description: "Build scalable payment infrastructure using Go, Python, and Kubernetes.",
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(), source: "Mock",
    url: "https://stripe.com/jobs",
    skills: ["Python", "Go", "Kubernetes", "PostgreSQL", "REST APIs", "Distributed Systems"],
  },
  {
    id: "job-002", title: "Staff Software Engineer", company: "Shopify",
    location: "Ottawa, ON", salary: 180000, salaryMax: 220000,
    description: "Lead cross-functional engineering. Own Rails monolith migration roadmap.",
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(), source: "Mock",
    url: "https://shopify.com/careers",
    skills: ["Ruby on Rails", "React", "TypeScript", "PostgreSQL", "Redis", "Distributed Systems"],
  },
  {
    id: "job-003", title: "Senior Data Scientist", company: "RBC",
    location: "Toronto, ON", salary: 140000, salaryMax: 170000,
    description: "Build ML models for credit risk and fraud using Python, PyTorch, and Spark.",
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(), source: "Mock",
    url: "https://rbc.com/careers",
    skills: ["Python", "Machine Learning", "SQL", "PyTorch", "Spark"],
  },
  {
    id: "job-004", title: "Machine Learning Engineer", company: "Cohere",
    location: "Toronto, ON", salary: 155000, salaryMax: 195000,
    description: "Train and deploy LLMs. PyTorch, CUDA, distributed training.",
    postedAt: new Date(Date.now() - 3 * 86400000).toISOString(), source: "Mock",
    url: "https://cohere.com/careers",
    skills: ["Python", "PyTorch", "Machine Learning", "NLP", "CUDA", "Distributed Systems", "LLMs"],
  },
  {
    id: "job-005", title: "Principal Software Engineer", company: "Wealthsimple",
    location: "Toronto, ON", salary: 190000, salaryMax: 230000,
    description: "Set technical direction. React, AWS, PostgreSQL. Reliability and performance.",
    postedAt: new Date(Date.now() - 4 * 86400000).toISOString(), source: "Mock",
    url: "https://wealthsimple.com/jobs",
    skills: ["React", "TypeScript", "AWS", "PostgreSQL", "System Design"],
  },
  {
    id: "job-006", title: "Senior ML Engineer", company: "Layer6 AI (TD)",
    location: "Toronto, ON", salary: 160000, salaryMax: 195000,
    description: "Production ML for fraud, recommendations, and risk. Python, TensorFlow, Kafka.",
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(), source: "Mock",
    url: "https://td.com/careers",
    skills: ["Python", "TensorFlow", "Machine Learning", "Spark", "Kafka", "MLOps"],
  },
  {
    id: "job-007", title: "Full Stack Engineer", company: "Ritual",
    location: "Toronto, ON", salary: 130000, salaryMax: 160000,
    description: "Consumer food ordering with React Native, React, Node.js, PostgreSQL.",
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(), source: "Mock",
    url: "https://ritual.co/careers",
    skills: ["React", "React Native", "Node.js", "TypeScript", "PostgreSQL", "REST APIs"],
  },
  {
    id: "job-008", title: "Senior Backend Engineer", company: "Clio",
    location: "Vancouver, BC", salary: 145000, salaryMax: 175000,
    description: "Scale legal SaaS. Ruby on Rails, React, AWS, Elasticsearch.",
    postedAt: new Date(Date.now() - 3 * 86400000).toISOString(), source: "Mock",
    url: "https://clio.com/careers",
    skills: ["Ruby on Rails", "React", "AWS", "Elasticsearch", "PostgreSQL", "REST APIs"],
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
  const normalizedUser = userSkills.map(normalizeSkill);
  const matched: string[] = [];
  const missing: string[] = [];
  for (const skill of jobSkills) {
    (normalizedUser.includes(normalizeSkill(skill)) ? matched : missing).push(skill);
  }
  const matchScore = jobSkills.length === 0
    ? 0
    : Math.round((matched.length / jobSkills.length) * 100);
  return { matchScore, matchedSkills: matched, missingSkills: missing };
}

export async function getJobsByRoleAndLocation(
  role: string,
  location: string,
  page = 1
): Promise<{ jobs: RawJob[]; total: number; page: number }> {
  if (hasLiveKeys()) {
    // For role-specific searches hit Adzuna directly with the user's query
    const country: "ca" | "us" = location.toLowerCase().includes("us") ||
      ["new york", "san francisco", "seattle", "chicago", "austin"].some(c =>
        location.toLowerCase().includes(c)) ? "us" : "ca";
    const jobs = await fetchFromAdzuna(role, location, country, page);
    if (jobs.length > 0) return { jobs, total: jobs.length, page };
  }

  // Fallback: filter mock pool
  const lowerRole = role.toLowerCase();
  const lowerLoc = location.toLowerCase();
  const filtered = MOCK_POOL.filter((j) => {
    const titleMatch = j.title.toLowerCase().includes(lowerRole) ||
      lowerRole.split(" ").some((w) => j.title.toLowerCase().includes(w));
    const locMatch = !lowerLoc || lowerLoc === "anywhere" || lowerLoc === "remote" ||
      j.location.toLowerCase().includes(lowerLoc.split(",")[0]?.trim() ?? "");
    return titleMatch || locMatch;
  });
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  return { jobs: filtered.slice(start, start + pageSize), total: filtered.length, page };
}

export async function getAllJobs(): Promise<RawJob[]> {
  if (hasLiveKeys()) {
    const jobs = await getLiveJobPool();
    if (jobs.length > 0) return jobs;
  }
  return MOCK_POOL;
}
