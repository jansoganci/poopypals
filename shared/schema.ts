import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  streakCount: integer("streak_count").default(0).notNull(),
  totalLogs: integer("total_logs").default(0).notNull(),
  flushFunds: integer("flush_funds").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const poopLogs = pgTable("poop_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  dateTime: timestamp("date_time").defaultNow().notNull(),
  duration: integer("duration").notNull(),
  rating: text("rating").notNull(),
  consistency: integer("consistency").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPoopLogSchema = createInsertSchema(poopLogs).pick({
  userId: true,
  dateTime: true,
  duration: true,
  rating: true,
  consistency: true,
  notes: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  userId: true,
  type: true,
  name: true,
  description: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type PoopLog = typeof poopLogs.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
