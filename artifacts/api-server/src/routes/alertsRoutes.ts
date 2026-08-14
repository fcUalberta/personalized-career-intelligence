import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, alertsTable } from "@workspace/db";
import { MarkAlertReadParams, MarkAlertReadResponse, ListAlertsResponseItem } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/alerts", async (_req, res): Promise<void> => {
  const alerts = await db
    .select()
    .from(alertsTable)
    .orderBy(desc(alertsTable.createdAt))
    .limit(50);

  const items = alerts.map((a) =>
    ListAlertsResponseItem.parse({
      ...a,
      createdAt: a.createdAt.toISOString(),
    })
  );

  res.json(items);
});

router.patch("/alerts/:id/read", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = MarkAlertReadParams.safeParse({ id: Number(raw) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [updated] = await db
    .update(alertsTable)
    .set({ isRead: true })
    .where(eq(alertsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Alert not found" });
    return;
  }

  res.json(
    MarkAlertReadResponse.parse({
      ...updated,
      createdAt: updated.createdAt.toISOString(),
    })
  );
});

export default router;
