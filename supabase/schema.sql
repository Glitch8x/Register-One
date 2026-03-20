-- Students Table
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  gender TEXT NOT NULL,
  matricno TEXT NOT NULL,
  password TEXT, -- For real auth, we use Supabase Auth instead, but can store extra profile data here
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Results Table
CREATE TABLE IF NOT EXISTS results (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  term TEXT NOT NULL,
  year TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT '100L',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Public read access for this prototype (optional)
CREATE POLICY "Public read students" ON students FOR SELECT USING (true);
CREATE POLICY "Public read results" ON results FOR SELECT USING (true);
