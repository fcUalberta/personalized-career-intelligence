/**
 * JSearch estimated-salary API integration.
 * Endpoint: GET /estimated-salary
 * Source: Glassdoor via JSearch (RapidAPI)
 * Cache: 24 hours per role+location pair (conserves the 200 req/month free quota)
 */

export interface LiveCompBand {
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  currency: string;
  source: string;
  confidence: string;
  sampleSize: number;
}

interface JSearchSalaryResult {
  location: string;
  job_title: string;
  min_salary: number;
  max_salary: number;
  median_salary: number;
  salary_currency: string;
  salary_count: number;
  confidence: string;
  publisher_name: string;
}

// Map years of experience → JSearch enum
function yearsToEnum(years: number): string {
  if (years < 1) return "LESS_THAN_ONE";
  if (years <= 3) return "ONE_TO_THREE";
  if (years <= 6) return "FOUR_TO_SIX";
  if (years <= 9) return "SEVEN_TO_NINE";
  if (years <= 14) return "TEN_TO_FOURTEEN";
  return "ABOVE_FIFTEEN";
}

// Approximate percentile bands from min/median/max
function buildBand(min: number, median: number, max: number): Omit<LiveCompBand, "currency" | "source" | "confidence" | "sampleSize"> {
  // min ≈ p10-p25, median = p50, max ≈ p75-p90
  const p25 = Math.round((min + median) / 2);
  const p50 = Math.round(median);
  const p75 = Math.round((median + max) / 2);
  const p90 = Math.round(max * 1.08); // slight extrapolation
  return { p25, p50, p75, p90 };
}

// In-memory cache: key → { band, expiresAt }
const cache = new Map<string, { band: LiveCompBand; expiresAt: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function fetchLiveCompBand(
  role: string,
  location: string,
  yearsExperience: number
): Promise<LiveCompBand | null> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return null;

  // Extract city from "Toronto, ON" → "Toronto"
  const city = location.split(",")[0]?.trim() ?? location;
  const expEnum = yearsToEnum(yearsExperience);
  const cacheKey = `${role.toLowerCase()}|${city.toLowerCase()}|${expEnum}`;

  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.band;
  }

  const url = new URL("https://jsearch.p.rapidapi.com/estimated-salary");
  url.searchParams.set("job_title", role);
  url.searchParams.set("location", city);
  url.searchParams.set("location_type", "ANY");
  url.searchParams.set("years_of_experience", expEnum);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });

    if (!res.ok) {
      console.error(`Salary API ${res.status}: ${await res.text()}`);
      return null;
    }

    const json = await res.json() as { status: string; data?: JSearchSalaryResult[] };
    if (json.status !== "OK" || !json.data?.length) return null;

    const d = json.data[0]!;
    const bandParts = buildBand(d.min_salary, d.median_salary, d.max_salary);
    const band: LiveCompBand = {
      ...bandParts,
      currency: d.salary_currency,
      source: d.publisher_name,
      confidence: d.confidence,
      sampleSize: d.salary_count,
    };

    cache.set(cacheKey, { band, expiresAt: Date.now() + CACHE_TTL_MS });
    console.log(`Salary API: ${role} in ${city} — median $${Math.round(d.median_salary).toLocaleString()} (${d.salary_count} samples)`);
    return band;
  } catch (err) {
    console.error("Salary API fetch failed:", err);
    return null;
  }
}
