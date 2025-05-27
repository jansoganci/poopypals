/*
  # Initial Schema Setup
  
  1. Tables
    - users
      - Basic user information and stats
    - poop_logs
      - User's bathroom visit records
    - achievements
      - User achievements tracking
    - challenges
      - Available challenges
    - user_challenges
      - User-challenge relationships and progress
    - avatar_components
      - Available avatar customization parts
    - user_avatar_components
      - User's unlocked avatar components
    - user_avatars
      - User's current avatar configuration
    - notifications
      - User notifications
    - notification_preferences
      - User notification settings
    - reminders
      - User reminders
    - notification_templates
      - Templates for system notifications

  2. Enums
    - component_type
    - reminder_frequency
    - notification_type

  3. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create enums
CREATE TYPE component_type AS ENUM ('head', 'eyes', 'mouth', 'accessory');
CREATE TYPE reminder_frequency AS ENUM ('daily', 'weekly', 'custom');
CREATE TYPE notification_type AS ENUM ('achievement', 'streak', 'reminder', 'system', 'tip');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  streak_count INTEGER NOT NULL DEFAULT 0,
  total_logs INTEGER NOT NULL DEFAULT 0,
  flush_funds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create poop_logs table
CREATE TABLE IF NOT EXISTS poop_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  date_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration INTEGER NOT NULL,
  rating TEXT NOT NULL,
  consistency INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward_amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  condition_target INTEGER NOT NULL,
  condition_timeframe INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_challenges table
CREATE TABLE IF NOT EXISTS user_challenges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  challenge_id INTEGER NOT NULL REFERENCES challenges(id),
  progress INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create avatar_components table
CREATE TABLE IF NOT EXISTS avatar_components (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type component_type NOT NULL,
  svg_path TEXT NOT NULL,
  cost INTEGER NOT NULL DEFAULT 0,
  unlock_condition TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_avatar_components table
CREATE TABLE IF NOT EXISTS user_avatar_components (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  component_id INTEGER NOT NULL REFERENCES avatar_components(id),
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_avatars table
CREATE TABLE IF NOT EXISTS user_avatars (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) UNIQUE,
  head_id INTEGER REFERENCES avatar_components(id),
  eyes_id INTEGER REFERENCES avatar_components(id),
  mouth_id INTEGER REFERENCES avatar_components(id),
  accessory_id INTEGER REFERENCES avatar_components(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  icon_path TEXT,
  action_path TEXT,
  expires_at TIMESTAMPTZ
);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  achievement_notifications BOOLEAN NOT NULL DEFAULT true,
  streak_notifications BOOLEAN NOT NULL DEFAULT true,
  reminder_notifications BOOLEAN NOT NULL DEFAULT true,
  email_notifications BOOLEAN NOT NULL DEFAULT false,
  push_notifications BOOLEAN NOT NULL DEFAULT true,
  do_not_disturb_start VARCHAR(8),
  do_not_disturb_end VARCHAR(8),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  frequency reminder_frequency NOT NULL,
  time VARCHAR(8) NOT NULL,
  days_of_week TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create notification_templates table
CREATE TABLE IF NOT EXISTS notification_templates (
  id SERIAL PRIMARY KEY,
  template_id VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  body TEXT NOT NULL,
  type notification_type NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE poop_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatar_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_avatar_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_poop_logs_user_id ON poop_logs(user_id);
CREATE INDEX idx_poop_logs_date_time ON poop_logs(date_time);
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX idx_user_challenges_challenge_id ON user_challenges(challenge_id);
CREATE INDEX idx_user_avatar_components_user_id ON user_avatar_components(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);