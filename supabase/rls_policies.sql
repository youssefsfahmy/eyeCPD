-- ============================================
-- RLS POLICIES FOR CPD APPLICATION
-- ============================================
-- This file contains Row Level Security policies for all tables
-- Rules:
-- - Users can only see their own data
-- - Admins can see all data
-- - Public tables (none in this case)
-- ============================================
-- HELPER FUNCTION: Check if user is admin
-- ============================================
CREATE
OR REPLACE FUNCTION is_user_admin(user_id uuid) RETURNS boolean AS $ $ BEGIN RETURN EXISTS (
    SELECT
        1
    FROM
        public.profiles
    WHERE
        profiles.user_id = $ 1
        AND 'admin' = ANY(profiles.roles)
);

END;

$ $ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PROFILES TABLE POLICIES
-- ============================================
ALTER TABLE
    public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow insert for new user registration (trigger runs as SECURITY DEFINER, but direct inserts need this)
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR
INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles FOR
SELECT
    USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR
SELECT
    USING (is_user_admin(auth.uid()));

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles FOR
UPDATE
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" ON public.profiles FOR
UPDATE
    USING (is_user_admin(auth.uid())) WITH CHECK (is_user_admin(auth.uid()));

-- Users can delete their own profile (cascades via FK)
CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE USING (auth.uid() = user_id);

-- Admins can delete any profile
CREATE POLICY "Admins can delete any profile" ON public.profiles FOR DELETE USING (is_user_admin(auth.uid()));

-- ============================================
-- SUBSCRIPTIONS TABLE POLICIES
-- ============================================
ALTER TABLE
    public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view their own subscription" ON public.subscriptions FOR
SELECT
    USING (auth.uid() = user_id);

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions FOR
SELECT
    USING (is_user_admin(auth.uid()));

-- Users can update their own subscription
CREATE POLICY "Users can update their own subscription" ON public.subscriptions FOR
UPDATE
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Admins can update any subscription
CREATE POLICY "Admins can update any subscription" ON public.subscriptions FOR
UPDATE
    USING (is_user_admin(auth.uid())) WITH CHECK (is_user_admin(auth.uid()));

-- ============================================
-- ACTIVITY_RECORD TABLE POLICIES
-- ============================================
ALTER TABLE
    public.activity_record ENABLE ROW LEVEL SECURITY;

-- Users can view their own activity records
CREATE POLICY "Users can view their own activities" ON public.activity_record FOR
SELECT
    USING (auth.uid() = user_id);

-- Admins can view all activity records
CREATE POLICY "Admins can view all activities" ON public.activity_record FOR
SELECT
    USING (is_user_admin(auth.uid()));

-- Users can insert their own activity records
CREATE POLICY "Users can insert their own activities" ON public.activity_record FOR
INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own activity records
CREATE POLICY "Users can update their own activities" ON public.activity_record FOR
UPDATE
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Admins can update any activity
CREATE POLICY "Admins can update any activity" ON public.activity_record FOR
UPDATE
    USING (is_user_admin(auth.uid())) WITH CHECK (is_user_admin(auth.uid()));

-- Users can delete their own activity records
CREATE POLICY "Users can delete their own activities" ON public.activity_record FOR DELETE USING (auth.uid() = user_id);

-- Admins can delete any activity
CREATE POLICY "Admins can delete any activity" ON public.activity_record FOR DELETE USING (is_user_admin(auth.uid()));

-- ============================================
-- GOALS TABLE POLICIES
-- ============================================
ALTER TABLE
    public.goals ENABLE ROW LEVEL SECURITY;

-- Users can view their own goals
CREATE POLICY "Users can view their own goals" ON public.goals FOR
SELECT
    USING (auth.uid() = user_id);

-- Admins can view all goals
CREATE POLICY "Admins can view all goals" ON public.goals FOR
SELECT
    USING (is_user_admin(auth.uid()));

-- Users can insert their own goals
CREATE POLICY "Users can insert their own goals" ON public.goals FOR
INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own goals
CREATE POLICY "Users can update their own goals" ON public.goals FOR
UPDATE
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Admins can update any goal
CREATE POLICY "Admins can update any goal" ON public.goals FOR
UPDATE
    USING (is_user_admin(auth.uid())) WITH CHECK (is_user_admin(auth.uid()));

-- Users can delete their own goals
CREATE POLICY "Users can delete their own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- Admins can delete any goal
CREATE POLICY "Admins can delete any goal" ON public.goals FOR DELETE USING (is_user_admin(auth.uid()));

-- ============================================
-- TAGS TABLE POLICIES
-- ============================================
ALTER TABLE
    public.tags ENABLE ROW LEVEL SECURITY;

-- Any user can view all tags
CREATE POLICY "Any user can view all tags" ON public.tags FOR
SELECT
    USING (true);

-- Users can insert their own tags
CREATE POLICY "Users can insert their own tags" ON public.tags FOR
INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own tags
CREATE POLICY "Users can update their own tags" ON public.tags FOR
UPDATE
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Admins can update any tag
CREATE POLICY "Admins can update any tag" ON public.tags FOR
UPDATE
    USING (is_user_admin(auth.uid())) WITH CHECK (is_user_admin(auth.uid()));

-- Users can delete their own tags
CREATE POLICY "Users can delete their own tags" ON public.tags FOR DELETE USING (auth.uid() = user_id);

-- Admins can delete any tag
CREATE POLICY "Admins can delete any tag" ON public.tags FOR DELETE USING (is_user_admin(auth.uid()));

-- ============================================
-- PROVIDERS TABLE POLICIES
-- ============================================
ALTER TABLE
    public.providers ENABLE ROW LEVEL SECURITY;

-- Any user can view all providers
CREATE POLICY "Any user can view all providers" ON public.providers FOR
SELECT
    USING (true);

-- Users can insert their own providers
CREATE POLICY "Users can insert their own providers" ON public.providers FOR
INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own providers
CREATE POLICY "Users can update their own providers" ON public.providers FOR
UPDATE
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Admins can update any provider
CREATE POLICY "Admins can update any provider" ON public.providers FOR
UPDATE
    USING (is_user_admin(auth.uid())) WITH CHECK (is_user_admin(auth.uid()));

-- Users can delete their own providers
CREATE POLICY "Users can delete their own providers" ON public.providers FOR DELETE USING (auth.uid() = user_id);

-- Admins can delete any provider
CREATE POLICY "Admins can delete any provider" ON public.providers FOR DELETE USING (is_user_admin(auth.uid()));

-- ============================================
-- FEEDBACK TABLE POLICIES
-- ============================================
ALTER TABLE
    public.feedback ENABLE ROW LEVEL SECURITY;

-- Users can view their own feedback
CREATE POLICY "Users can view their own feedback" ON public.feedback FOR
SELECT
    USING (auth.uid() = user_id);

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback" ON public.feedback FOR
SELECT
    USING (is_user_admin(auth.uid()));

-- Users can insert their own feedback
CREATE POLICY "Users can insert their own feedback" ON public.feedback FOR
INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own feedback
CREATE POLICY "Users can delete their own feedback" ON public.feedback FOR DELETE USING (auth.uid() = user_id);

-- Admins can delete any feedback
CREATE POLICY "Admins can delete any feedback" ON public.feedback FOR DELETE USING (is_user_admin(auth.uid()));

-- ============================================
-- ACTIVITY_TAG JUNCTION TABLE POLICIES
-- ============================================
ALTER TABLE
    public.activity_tag ENABLE ROW LEVEL SECURITY;

-- Users can view tags for their own activities
CREATE POLICY "Users can view tags for their own activities" ON public.activity_tag FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                public.activity_record
            WHERE
                activity_record.id = activity_tag.activity_record_id
                AND activity_record.user_id = auth.uid()
        )
    );

-- Admins can view all activity tags
CREATE POLICY "Admins can view all activity tags" ON public.activity_tag FOR
SELECT
    USING (is_user_admin(auth.uid()));

-- Users can insert tags for their own activities
CREATE POLICY "Users can insert tags for their own activities" ON public.activity_tag FOR
INSERT
    WITH CHECK (
        EXISTS (
            SELECT
                1
            FROM
                public.activity_record
            WHERE
                activity_record.id = activity_tag.activity_record_id
                AND activity_record.user_id = auth.uid()
        )
    );

-- Users can delete tags from their own activities
CREATE POLICY "Users can delete tags from their own activities" ON public.activity_tag FOR DELETE USING (
    EXISTS (
        SELECT
            1
        FROM
            public.activity_record
        WHERE
            activity_record.id = activity_tag.activity_record_id
            AND activity_record.user_id = auth.uid()
    )
);

-- Admins can delete any activity tag
CREATE POLICY "Admins can delete any activity tag" ON public.activity_tag FOR DELETE USING (is_user_admin(auth.uid()));

-- ============================================
-- GOAL_TAG JUNCTION TABLE POLICIES
-- ============================================
ALTER TABLE
    public.goal_tag ENABLE ROW LEVEL SECURITY;

-- Users can view tags for their own goals
CREATE POLICY "Users can view tags for their own goals" ON public.goal_tag FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                public.goals
            WHERE
                goals.id = goal_tag.goal_id
                AND goals.user_id = auth.uid()
        )
    );

-- Admins can view all goal tags
CREATE POLICY "Admins can view all goal tags" ON public.goal_tag FOR
SELECT
    USING (is_user_admin(auth.uid()));

-- Users can insert tags for their own goals
CREATE POLICY "Users can insert tags for their own goals" ON public.goal_tag FOR
INSERT
    WITH CHECK (
        EXISTS (
            SELECT
                1
            FROM
                public.goals
            WHERE
                goals.id = goal_tag.goal_id
                AND goals.user_id = auth.uid()
        )
    );

-- Users can delete tags from their own goals
CREATE POLICY "Users can delete tags from their own goals" ON public.goal_tag FOR DELETE USING (
    EXISTS (
        SELECT
            1
        FROM
            public.goals
        WHERE
            goals.id = goal_tag.goal_id
            AND goals.user_id = auth.uid()
    )
);

-- Admins can delete any goal tag
CREATE POLICY "Admins can delete any goal tag" ON public.goal_tag FOR DELETE USING (is_user_admin(auth.uid()));