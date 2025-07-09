-- Create profiles table
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    registration_number TEXT,
    role TEXT NOT NULL DEFAULT 'optometrist',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc' :: text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc' :: text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Create function to update updated_at timestamp
CREATE
OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $ $ BEGIN NEW.updated_at = TIMEZONE('utc' :: text, NOW());

RETURN NEW;

END;

$ $ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE
UPDATE
    ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE
    profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR
SELECT
    USING (auth.uid() = user_id);

-- Create policy for users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles FOR
INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles FOR
UPDATE
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create policy for users to delete their own profile
CREATE POLICY "Users can delete own profile" ON profiles FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX profiles_user_id_idx ON profiles(user_id);