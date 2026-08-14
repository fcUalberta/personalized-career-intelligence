import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, targetRolesTable } from "@workspace/db";
import {
  CreateTargetRoleBody,
  CreateTargetRoleResponse,
  DeleteTargetRoleParams,
  ListTargetRolesResponseItem,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/target-roles", async (_req, res): Promise<void> => {
  const roles = await db
    .select()
    .from(targetRolesTable)
    .orderBy(targetRolesTable.createdAt);

  const items = roles.map((r) =>
    ListTargetRolesResponseItem.parse({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })
  );

  res.json(items);
});

router.post("/target-roles", async (req, res): Promise<void> => {
  const parsed = CreateTargetRoleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [role] = await db
    .insert(targetRolesTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(
    CreateTargetRoleResponse.parse({
      ...role,
      createdAt: role!.createdAt.toISOString(),
    })
  );
});

router.delete("/target-roles/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteTargetRoleParams.safeParse({ id: Number(raw) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(targetRolesTable)
    .where(eq(targetRolesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Target role not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
