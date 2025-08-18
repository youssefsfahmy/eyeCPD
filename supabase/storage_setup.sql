-- Create storage bucket for activity evidence files
INSERT INTO
    storage.buckets (id, name, public)
VALUES
    ('activity-evidence', 'activity-evidence', true);

-- Set up RLS policies for the activity-evidence bucket
CREATE POLICY "Users can upload evidence files" ON storage.objects FOR
INSERT
    WITH CHECK (
        bucket_id = 'activity-evidence'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name)) [1] = auth.uid() :: text
    );

CREATE POLICY "Users can view their evidence files" ON storage.objects FOR
SELECT
    USING (
        bucket_id = 'activity-evidence'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name)) [1] = auth.uid() :: text
    );

CREATE POLICY "Users can update their evidence files" ON storage.objects FOR
UPDATE
    USING (
        bucket_id = 'activity-evidence'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name)) [1] = auth.uid() :: text
    );

CREATE POLICY "Users can delete their evidence files" ON storage.objects FOR DELETE USING (
    bucket_id = 'activity-evidence'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name)) [1] = auth.uid() :: text
);