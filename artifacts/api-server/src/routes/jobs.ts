import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, profilesTable, targetRolesTable } from "@workspace/db";
import {
  SearchJobsQueryParams,
  SearchJobsResponse,
  GetJobMatchesQueryParams,
} from "@workspace/api-zod";
import { getJobsByRoleAndLocation, getAllJobs, scoreMatch } from "../lib/jobData.js";

const router: IRouter = Router();

router.get("/jobs/search", async (req, res): Promise<void> => {
  const params = SearchJobsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { role, location, page } = params.data;
  const result = await getJobsByRoleAndLocation(role, location, page ?? 1);

  res.json(
    SearchJobsResponse.parse({
      jobs: result.jobs.map((j) => ({
        ...j,
        salary: j.salary ?? null,
        salaryMax: j.salaryMax ?? null,
      })),
      total: result.total,
      page: result.page,
    })
  );
});

router.get("/jobs/matches", async (req, res): Promise<void> => {
  const params = GetJobMatchesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [profile] = await db.select().from(profilesTable).limit(1);
  const userSkills = profile?.skills ?? [];

  let jobs = await getAllJobs();

  // If targetRoleId is provided, filter by matching role name
  if (params.data.targetRoleId != null) {
    const roleIdNum = Number(params.data.targetRoleId);
    const [targetRole] = await db
      .select()
      .from(targetRolesTable)
      .where(eq(targetRolesTable.id, roleIdNum));
    if (targetRole) {
      const lowerRole = targetRole.roleName.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(lowerRole.split(" ").slice(-1)[0] ?? "") ||
          lowerRole.includes(j.title.toLowerCase().split(" ").slice(-1)[0] ?? "")
      );
    }
  }

  const matched = jobs
    .map((job) => {
      const { matchScore, matchedSkills, missingSkills } = scoreMatch(userSkills, job.skills);
      return {
        job: {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          salaryMax: job.salaryMax,
          description: job.description,
          postedAt: job.postedAt,
          source: job.source,
          url: job.url,
        },
        matchScore,
        matchedSkills,
        missingSkills,
      };
    })
    .filter((m) => m.matchScore >= (params.data.minMatch ?? 0))
    .sort((a, b) => b.matchScore - a.matchScore);

  res.json(matched);
});

export default router;
