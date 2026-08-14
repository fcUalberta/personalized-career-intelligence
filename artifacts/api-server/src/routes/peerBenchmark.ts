import { Router, type IRouter } from "express";
import { db, profilesTable, targetRolesTable } from "@workspace/db";
import { buildPeerBenchmark } from "../lib/insights.js";

const router: IRouter = Router();

router.get("/peer-benchmark", async (_req, res): Promise<void> => {
  const [profile] = await db.select().from(profilesTable).limit(1);
  const [topRole] = await db.select().from(targetRolesTable).limit(1);

  const targetRole = topRole?.roleName ?? profile?.currentTitle ?? "Software Engineer";
  const skills = profile?.skills ?? [];
  const yearsExp = profile?.yearsExperience ?? 5;

  const benchmark = buildPeerBenchmark(targetRole, skills, yearsExp);

  res.json(benchmark);
});

export default router;
