import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profilesTable = pgTable("profiles", {
  id: serial("id").primaryKey(),
  currentTitle: text("current_title").notNull(),
  skills: text("skills").array().notNull().default([]),
  yearsExperience: integer("years_experience").notNull().default(0),
  industry: text("industry").notNull(),
  location: text("location"),
  linkedinUrl: text("linkedin_url"),
  bio: text("bio"),
  desiredCompMin: integer("desired_comp_min"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProfileSchema = createInsertSchema(profilesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profilesTable.$inferSelect;
