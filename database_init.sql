-- ============================================================================
-- FormForge Database Initialization Script
-- ============================================================================
-- Complete end-to-end PostgreSQL schema creation.
-- Run this script to generate all required tables, constraints, and indexes.
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    role TEXT NOT NULL DEFAULT 'user', -- user | creator | admin | superadmin
    preferences JSONB DEFAULT '{}'::jsonb,
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_firebase_uid_idx ON users (firebase_uid);
CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);

-- ============================================================================
-- 2. THEMES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    colors JSONB NOT NULL DEFAULT '{}'::jsonb,
    typography JSONB NOT NULL DEFAULT '{}'::jsonb,
    spacing JSONB NOT NULL DEFAULT '{}'::jsonb,
    animations JSONB NOT NULL DEFAULT '{}'::jsonb,
    texture TEXT NOT NULL DEFAULT 'none',
    background_image TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    is_marketplace BOOLEAN NOT NULL DEFAULT FALSE,
    is_built_in BOOLEAN NOT NULL DEFAULT FALSE,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    downloads INTEGER NOT NULL DEFAULT 0,
    rating REAL NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS themes_creator_id_idx ON themes (creator_id);
CREATE INDEX IF NOT EXISTS themes_is_marketplace_idx ON themes (is_marketplace);
CREATE INDEX IF NOT EXISTS themes_is_built_in_idx ON themes (is_built_in);

-- ============================================================================
-- 3. FORMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'draft', -- draft | published | archived | closed
    theme_id UUID REFERENCES themes(id) ON DELETE SET NULL,
    settings JSONB DEFAULT '{}'::jsonb,
    logic_rules JSONB DEFAULT '[]'::jsonb,
    layout_type TEXT NOT NULL DEFAULT 'single_page',
    cover_image TEXT,
    views INTEGER NOT NULL DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS forms_user_id_idx ON forms (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS forms_slug_idx ON forms (slug);
CREATE INDEX IF NOT EXISTS forms_status_idx ON forms (status);

-- ============================================================================
-- 4. FORM FIELDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS form_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    required BOOLEAN NOT NULL DEFAULT FALSE,
    config JSONB DEFAULT '{}'::jsonb,
    validation JSONB DEFAULT '{}'::jsonb,
    conditional_logic JSONB,
    section TEXT,
    width TEXT NOT NULL DEFAULT 'full',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS form_fields_form_id_idx ON form_fields (form_id);
CREATE INDEX IF NOT EXISTS form_fields_order_idx ON form_fields (form_id, "order");

-- ============================================================================
-- 5. SUBMISSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'completed', -- in_progress | completed | abandoned
    device_type TEXT NOT NULL DEFAULT 'Desktop',
    metadata JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS submissions_form_id_idx ON submissions (form_id);
CREATE INDEX IF NOT EXISTS submissions_status_idx ON submissions (status);
CREATE INDEX IF NOT EXISTS submissions_completed_at_idx ON submissions (completed_at);

-- ============================================================================
-- 6. FORM ANALYTICS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS form_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    views INTEGER NOT NULL DEFAULT 0,
    starts INTEGER NOT NULL DEFAULT 0,
    completions INTEGER NOT NULL DEFAULT 0,
    device_stats JSONB DEFAULT '{}'::jsonb,
    country_stats JSONB DEFAULT '{}'::jsonb,
    field_dropoff JSONB DEFAULT '{}'::jsonb,
    date DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS form_analytics_form_id_idx ON form_analytics (form_id);
CREATE INDEX IF NOT EXISTS form_analytics_date_idx ON form_analytics (date);
CREATE UNIQUE INDEX IF NOT EXISTS form_analytics_form_date_idx ON form_analytics (form_id, date);

-- ============================================================================
-- 7. BADGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_type TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    earned_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS badges_user_id_idx ON badges (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS badges_user_type_idx ON badges (user_id, badge_type);

-- ============================================================================
-- 8. USER FOLLOWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_follows (
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS user_follows_follower_idx ON user_follows (follower_id);
CREATE INDEX IF NOT EXISTS user_follows_following_idx ON user_follows (following_id);

-- ============================================================================
-- 9. LIKES TABLE (Polymorphic: form | theme | comment)
-- ============================================================================
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS likes_user_id_idx ON likes (user_id);
CREATE INDEX IF NOT EXISTS likes_target_idx ON likes (target_type, target_id);
CREATE UNIQUE INDEX IF NOT EXISTS likes_user_target_idx ON likes (user_id, target_type, target_id);

-- ============================================================================
-- 10. COMMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL, -- form | theme
    target_id UUID NOT NULL,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- self-referencing for replies
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS comments_target_idx ON comments (target_type, target_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON comments (user_id);
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON comments (parent_id);

-- ============================================================================
-- 11. QR PRESETS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS qr_presets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    category TEXT NOT NULL, -- sketch | neon | corporate | gaming | wedding
    is_built_in BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 12. RPC FUNCTIONS
-- ============================================================================
CREATE OR REPLACE FUNCTION increment_form_views(form_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE forms SET views = views + 1 WHERE slug = form_slug;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMP
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_themes
BEFORE UPDATE ON themes
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_forms
BEFORE UPDATE ON forms
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_form_fields
BEFORE UPDATE ON form_fields
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_comments
BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- NOTE: Since you are using Firebase Auth, Supabase sees all requests as 'anon'.
-- To allow your application to work, we must enable public access to these tables.
-- DO NOT RUN THESE if you switch to Supabase Auth in the future.

ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public ALL access for forms" ON forms FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public ALL access for form_fields" ON form_fields FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public ALL access for submissions" ON submissions FOR ALL USING (true) WITH CHECK (true);
