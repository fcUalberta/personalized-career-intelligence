import { Router, type IRouter } from "express";
import { db, profilesTable, targetRolesTable } from "@workspace/db";
import { GetCompDataQueryParams } from "@workspace/api-zod";
import { buildCompData } from "../lib/insights.js";

const router: IRouter = Router();

router.get("/comp-data", async (req, res): Promise<void> => {
  const params = GetCompDataQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [profile] = await db.select().from(profilesTable).limit(1);

  const [topTargetRole] = await db.select().from(targetRolesTable).limit(1);

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

  const compData = buildCompData(
    role,
    location,
    profile?.desiredCompMin ?? null,
    profile?.yearsExperience ?? 5
  );

  res.json(compData);
});

export default router;
