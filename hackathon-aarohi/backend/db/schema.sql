-- Optional: PostgreSQL schema for when you move content and user data into a database.
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firebase_uid TEXT UNIQUE NOT NULL,
  name TEXT,
  target_career TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE progress (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  item_type TEXT CHECK (item_type IN ('skill','project','task')),
  item_name TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- Wellness check-ins are private and never joined into career data or scores.
CREATE TABLE wellness_checkins (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  energy TEXT CHECK (energy IN ('good','ok','low')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
