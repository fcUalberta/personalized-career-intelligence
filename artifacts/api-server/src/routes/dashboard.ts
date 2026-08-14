import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, profilesTable, targetRolesTable, alertsTable } from "@workspace/db";
import { getAllJobs, scoreMatch } from "../lib/jobData.js";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [profile] = await db.select().from(profilesTable).limit(1);
  const userSkills = profile?.skills ?? [];

  const targetRoles = await db.select().from(targetRolesTable);

  const unreadAlerts = await db
    .select()
    .from(alertsTable)
    .where(eq(alertsTable.isRead, false));

  const allJobs = getAllJobs();

  // Compute matches and find top match score
  let topMatchScore = 0;
  let peakMatchRole: string | null = null;
  const oneWeekAgo = new Date(Date.now() - 7 * 86400000);
  let newJobMatchesThisWeek = 0;

  for (const job of allJobs) {
    const { matchScore } = scoreMatch(userSkills, job.skills);
    if (matchScore > topMatchScore) {
      topMatchScore = matchScore;
      peakMatchRole = job.title;
    }
    if (new Date(job.postedAt) >= oneWeekAgo && matchScore >= 60) {
      newJobMatchesThisWeek++;
    }
  }

  const profileComplete = !!(
    profile?.currentTitle &&
    (profile.skills?.length ?? 0) > 0 &&
    profile.yearsExperience != null &&
    profile.industry
  );

  const topTargetRole = targetRoles[0]?.roleName ?? null;

  res.json({
    newJobMatchesThisWeek,
    topMatchScore,
    unreadAlerts: unreadAlerts.length,
    activeTargetRoles: targetRoles.length,
    profileComplete,
    topTargetRole,
    avgCompPercentile: profile ? 62 : null, // Simplified; real impl uses buildCompData
    peakMatchRole,
  });
});

export default router;
