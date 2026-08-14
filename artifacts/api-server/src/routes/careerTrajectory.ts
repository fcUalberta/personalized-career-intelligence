import { Router, type IRouter } from "express";
import { db, profilesTable } from "@workspace/db";
import { buildCareerTrajectory } from "../lib/insights.js";

const router: IRouter = Router();

router.get("/career-trajectory", async (_req, res): Promise<void> => {
  const [profile] = await db.select().from(profilesTable).limit(1);

  const currentTitle = profile?.currentTitle ?? "Software Engineer";
  const skills = profile?.skills ?? [];

  const trajectory = buildCareerTrajectory(currentTitle, skills);

  res.json(trajectory);
});

export default router;
