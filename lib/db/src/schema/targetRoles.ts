import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const targetRolesTable = pgTable("target_roles", {
  id: serial("id").primaryKey(),
  roleName: text("role_name").notNull(),
  location: text("location").notNull(),
  compFloor: integer("comp_floor").notNull().default(0),
  priority: integer("priority"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTargetRoleSchema = createInsertSchema(targetRolesTable).omit({
  id: true,
  createdAt: true,
});

export type InsertTargetRole = z.infer<typeof insertTargetRoleSchema>;
export type TargetRole = typeof targetRolesTable.$inferSelect;
