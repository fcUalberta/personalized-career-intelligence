import { Router, type IRouter } from "express";
import { db, profilesTable, targetRolesTable } from "@workspace/db";
import { GetCompDataQueryParams } from "@workspace/api-zod";
import { buildCompData } from "../lib/insights.js";
import { fetchLiveCompBand } from "../lib/salaryApi.js";

const router: IRouter = Router();

router.get("/comp-data", async (req, res): Promise<void> => {
  const params = GetCompDataQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [[profile], [topTargetRole]] = await Promise.all([
    db.select().from(profilesTable).limit(1),
    db.select().from(targetRolesTable).limit(1),
  ]);

  const role: string =
    params.data.role ??
    topTargetRole?.roleName ??
    profile?.currentTitle ??
    "Software Engineer";
  const location: string =
    params.data.location ??
    topTargetRole?.location ??
    profile?.location ??
    "Toronto, ON";
  const years = profile?.yearsExperience ?? 5;
  const desiredComp = profile?.desiredCompMin ?? null;

  // Try live Glassdoor data first; fall back to mock model
  const liveBand = await fetchLiveCompBand(role, location, years);

  const compData = buildCompData(
    role,
    location,
    desiredComp,
    years,
    liveBand ?? undefined
  );

  res.json(compData);
});

export default router;
