import { pgTable, text, serial, integer, boolean, timestamp, jsonb, pgEnum, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Create a component type enum
export const componentTypeEnum = pgEnum('component_type', ['head', 'eyes', 'mouth', 'accessory']);

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

// Avatar component tables
export const avatarComponents = pgTable("avatar_components", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: componentTypeEnum("type").notNull(),
  svgPath: text("svg_path").notNull(),
  cost: integer("cost").default(0).notNull(),
  unlockCondition: text("unlock_condition"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userAvatarComponents = pgTable("user_avatar_components", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  componentId: integer("component_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export const userAvatars = pgTable("user_avatars", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  headId: integer("head_id"),
  eyesId: integer("eyes_id"),
  mouthId: integer("mouth_id"),
  accessoryId: integer("accessory_id"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAvatarComponentSchema = createInsertSchema(avatarComponents).pick({
  name: true,
  type: true,
  svgPath: true,
  cost: true,
  unlockCondition: true,
});

export const insertUserAvatarComponentSchema = createInsertSchema(userAvatarComponents).pick({
  userId: true,
  componentId: true,
});

export const insertUserAvatarSchema = createInsertSchema(userAvatars).pick({
  userId: true,
  headId: true,
  eyesId: true,
  mouthId: true,
  accessoryId: true,
});

export type User = typeof users.$inferSelect;
export type PoopLog = typeof poopLogs.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type UserChallenge = typeof userChallenges.$inferSelect;
export type AvatarComponent = typeof avatarComponents.$inferSelect;
export type UserAvatarComponent = typeof userAvatarComponents.$inferSelect;
export type UserAvatar = typeof userAvatars.$inferSelect;

export type InsertAvatarComponent = z.infer<typeof insertAvatarComponentSchema>;
export type InsertUserAvatarComponent = z.infer<typeof insertUserAvatarComponentSchema>;
export type InsertUserAvatar = z.infer<typeof insertUserAvatarSchema>;

// Notification & Reminder Schema
export const reminderFrequencyEnum = pgEnum('reminder_frequency', ['daily', 'weekly', 'custom']);
export const notificationTypeEnum = pgEnum('notification_type', ['achievement', 'streak', 'reminder', 'system']);

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  iconPath: text("icon_path"),
  actionPath: text("action_path"),
  expiresAt: timestamp("expires_at")
});

export const notificationPreferences = pgTable("notification_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementNotifications: boolean("achievement_notifications").notNull().default(true),
  streakNotifications: boolean("streak_notifications").notNull().default(true),
  reminderNotifications: boolean("reminder_notifications").notNull().default(true),
  emailNotifications: boolean("email_notifications").notNull().default(false),
  pushNotifications: boolean("push_notifications").notNull().default(true),
  doNotDisturbStart: varchar("do_not_disturb_start", { length: 8 }),  // Store as HH:MM:SS
  doNotDisturbEnd: varchar("do_not_disturb_end", { length: 8 }),      // Store as HH:MM:SS
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  frequency: reminderFrequencyEnum("frequency").notNull(),
  time: varchar("time", { length: 8 }).notNull(),  // Store as HH:MM:SS
  daysOfWeek: text("days_of_week"),  // Comma-separated days for custom frequency (e.g., "1,3,5" for Mon,Wed,Fri)
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// Insert schemas
export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  message: true,
  type: true,
  isRead: true,
  iconPath: true,
  actionPath: true,
  expiresAt: true
});

export const insertNotificationPreferencesSchema = createInsertSchema(notificationPreferences, {
  achievementNotifications: z.boolean().default(true),
  streakNotifications: z.boolean().default(true),
  reminderNotifications: z.boolean().default(true),
  emailNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
  doNotDisturbStart: z.string().optional(),
  doNotDisturbEnd: z.string().optional()
}).pick({
  userId: true,
  achievementNotifications: true,
  streakNotifications: true,
  reminderNotifications: true,
  emailNotifications: true,
  pushNotifications: true,
  doNotDisturbStart: true,
  doNotDisturbEnd: true
});

export const insertReminderSchema = createInsertSchema(reminders, {
  isActive: z.boolean().default(true),
  daysOfWeek: z.string().optional()
}).pick({
  userId: true,
  title: true,
  message: true,
  frequency: true,
  time: true,
  daysOfWeek: true,
  isActive: true
});

// Types
export type Notification = typeof notifications.$inferSelect;
export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
export type Reminder = typeof reminders.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertNotificationPreferences = z.infer<typeof insertNotificationPreferencesSchema>;
export type InsertReminder = z.infer<typeof insertReminderSchema>;
