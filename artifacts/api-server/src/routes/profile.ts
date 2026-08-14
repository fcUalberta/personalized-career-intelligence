import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, profilesTable } from "@workspace/db";
import {
  UpdateProfileBody,
  GetProfileResponse,
  UpdateProfileResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/profile", async (req, res): Promise<void> => {
  const [profile] = await db.select().from(profilesTable).limit(1);

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  res.json(GetProfileResponse.parse({
    ...profile,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  }));
});

router.put("/profile", async (req, res): Promise<void> => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(profilesTable).limit(1);

  let profile;
  if (existing) {
    [profile] = await db
      .update(profilesTable)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(eq(profilesTable.id, existing.id))
      .returning();
  } else {
    [profile] = await db
      .insert(profilesTable)
      .values(parsed.data)
      .returning();
  }

  res.json(UpdateProfileResponse.parse({
    ...profile,
    createdAt: profile!.createdAt.toISOString(),
    updatedAt: profile!.updatedAt.toISOString(),
  }));
});

export default router;
