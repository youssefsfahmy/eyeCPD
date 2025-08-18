# CPD Activity File Upload Feature

## Overview

This document describes the file upload functionality for CPD activities, allowing users to attach evidence files (PDF, images, documents) to their professional development activities.

## Features

### Supported File Types

- PDF documents (.pdf)
- Images (.jpg, .jpeg, .png)
- Microsoft Word documents (.doc, .docx)

### File Size Limit

- Maximum file size: 10MB per file

### Storage

- Files are stored in Supabase Storage
- Bucket name: `activity-evidence`
- File path structure: `{userId}/{timestamp}_{activityId}.{extension}`

## Implementation Details

### Frontend Components

#### ActivityForm

- File upload input with drag-and-drop interface
- File validation (type and size)
- Preview of selected files
- Replace/remove file functionality

#### ActivityCard

- Shows attachment icon when evidence file exists
- File indicator in activity list view

#### ActivityViewEdit

- Enhanced evidence file display
- "View File" button with proper styling

### Backend Implementation

#### SupabaseStorage Class (`lib/storage/supabase.ts`)

- `uploadFile()`: Upload files to Supabase Storage
- `deleteFile()`: Remove files from storage
- `moveFile()`: Rename files after activity creation
- File validation and error handling

#### Server Actions (`app/activity/actions.ts`)

- File upload handling in create/update operations
- Automatic file URL updating in database
- Error handling that doesn't break activity creation

### Database Schema

The `activityRecords` table includes:

- `evidenceFileUrl`: Text field storing the public URL of uploaded files

### Security

#### Row Level Security (RLS) Policies

- Users can only upload files to their own folder
- Users can only view/modify their own files
- Files are organized by user ID in storage

#### File Validation

- Server-side file type validation
- File size limits enforced
- Secure file naming to prevent conflicts

## Usage

### For Users

1. **Creating Activity**:

   - Click the upload area to select a file
   - Or drag and drop a file onto the upload area
   - File will be validated and uploaded when activity is saved

2. **Editing Activity**:

   - View current evidence file
   - Replace with new file using "Replace" button
   - Remove file using delete button

3. **Viewing Activity**:
   - See evidence file indicator
   - Click "View File" to open in new tab

### For Developers

#### Adding File Upload to Forms

```tsx
<input
  type="file"
  name="evidenceFile"
  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
  onChange={handleFileChange}
/>
```

#### Server Action Integration

```typescript
const evidenceFile = formData.get("evidenceFile") as File | null;
if (evidenceFile && evidenceFile.size > 0) {
  const { url } = await SupabaseStorage.uploadFile(
    evidenceFile,
    userId,
    activityId
  );
  // Update activity with file URL
}
```

## Setup Instructions

1. **Supabase Storage Setup**:

   - Run the SQL script in `supabase/storage_setup.sql`
   - This creates the bucket and RLS policies

2. **Environment Variables**:

   - Ensure Supabase URL and keys are configured
   - No additional environment variables needed

3. **Dependencies**:
   - No additional packages required
   - Uses existing Supabase client

## Error Handling

### File Upload Errors

- Invalid file type: User-friendly error message
- File too large: Size limit warning
- Upload failure: Activity still created, error logged

### File Deletion

- Old files automatically removed when replacing
- Graceful handling of missing files

## Future Enhancements

### Potential Improvements

- Multiple file upload support
- File thumbnail previews
- Progress indicators for large uploads
- File compression for images
- Virus scanning integration

### Technical Considerations

- Consider CDN integration for better performance
- Implement file retention policies
- Add file metadata tracking
- Optimize for mobile upload experience
