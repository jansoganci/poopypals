import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
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

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  rewardAmount: integer("reward_amount").notNull(),
  type: text("type").notNull(), // 'daily', 'streak', 'achievement'
  conditionType: text("condition_type").notNull(), // 'logCount', 'consistentTime', 'ratingAchieved', 'streakReached'
  conditionTarget: integer("condition_target").notNull(),
  conditionTimeframe: integer("condition_timeframe"), // in days, optional
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  challengeId: integer("challenge_id").notNull(),
  progress: integer("progress").default(0).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
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

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  title: true,
  description: true,
  rewardAmount: true,
  type: true,
  conditionType: true,
  conditionTarget: true,
  conditionTimeframe: true,
  isActive: true,
});

export const insertUserChallengeSchema = createInsertSchema(userChallenges).pick({
  userId: true,
  challengeId: true,
  progress: true,
  isCompleted: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type InsertUserChallenge = z.infer<typeof insertUserChallengeSchema>;

export type User = typeof users.$inferSelect;
export type PoopLog = typeof poopLogs.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type UserChallenge = typeof userChallenges.$inferSelect;
