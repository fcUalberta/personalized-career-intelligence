import { Router, type IRouter } from "express";
import { db, profilesTable, targetRolesTable } from "@workspace/db";
import { getAllJobs, scoreMatch } from "../lib/jobData.js";

const router: IRouter = Router();

router.get("/skill-analysis", async (_req, res): Promise<void> => {
  const [profile] = await db.select().from(profilesTable).limit(1);
  const userSkills = profile?.skills ?? [];

  const targetRoles = await db.select().from(targetRolesTable);

  if (targetRoles.length === 0) {
    res.json([]);
    return;
  }

  const allJobs = getAllJobs();

  const analyses = targetRoles.map((targetRole) => {
    const lowerRole = targetRole.roleName.toLowerCase();
    const roleJobs = allJobs.filter(
      (j) =>
        j.title.toLowerCase().includes(lowerRole.split(" ").pop() ?? "") ||
        lowerRole.includes(j.title.toLowerCase().split(" ").pop() ?? "")
    );
    const sampleJobs = roleJobs.slice(0, Math.min(roleJobs.length, allJobs.length));

    // Count skill frequencies across job postings
    const skillFreq: Record<string, number> = {};
    for (const job of sampleJobs.length > 0 ? sampleJobs : allJobs.slice(0, 5)) {
      for (const skill of job.skills) {
        skillFreq[skill] = (skillFreq[skill] ?? 0) + 1;
      }
    }

    const allSkillsInMarket = Object.entries(skillFreq).sort((a, b) => b[1] - a[1]);

    const userSkillsNorm = userSkills.map((s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, ""));
    const matchedSkills: string[] = [];
    const gapSkills: Array<{
      skill: string;
      inDemandCount: number;
      hasSkill: boolean;
      importance: string;
    }> = [];

    for (const [skill, count] of allSkillsInMarket) {
      const hasSkill = userSkillsNorm.includes(skill.toLowerCase().replace(/[^a-z0-9]/g, ""));
      const importance =
        count >= 4 ? "critical" : count >= 2 ? "important" : "nice-to-have";

      if (hasSkill) {
        matchedSkills.push(skill);
      } else {
        gapSkills.push({ skill, inDemandCount: count, hasSkill: false, importance });
      }
    }

    // Add user skills that aren't in market data as "has"
    for (const skill of userSkills) {
      if (!matchedSkills.includes(skill)) {
        matchedSkills.push(skill);
      }
    }

    const totalInMarket = allSkillsInMarket.length;
    const matchPercentage =
      totalInMarket === 0
        ? 0
        : Math.min(100, Math.round((matchedSkills.length / totalInMarket) * 100));

    return {
      targetRoleId: targetRole.id,
      roleName: targetRole.roleName,
      matchPercentage,
      matchedSkills,
      gapSkills: gapSkills.slice(0, 10),
      totalJobsAnalyzed: sampleJobs.length > 0 ? sampleJobs.length : allJobs.length,
    };
  });

  res.json(analyses);
});

export default router;
