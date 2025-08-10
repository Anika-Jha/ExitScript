import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const excuses = pgTable("excuses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(), // work, family, health, transport
  tone: text("tone").notNull(), // friendly, urgent, subtle
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertExcuseSchema = createInsertSchema(excuses).pick({
  category: true,
  tone: true,
  content: true,
});

export type InsertExcuse = z.infer<typeof insertExcuseSchema>;
export type Excuse = typeof excuses.$inferSelect;

export const generateExcuseRequestSchema = z.object({
  category: z.enum(["work", "family", "health", "transport"]),
  tone: z.enum(["friendly", "urgent", "subtle"]),
});

export type GenerateExcuseRequest = z.infer<typeof generateExcuseRequestSchema>;
