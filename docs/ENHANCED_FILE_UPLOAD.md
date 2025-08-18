# Enhanced File Upload with Existence Check and Replacement

## New Features Added

### 1. File Existence Check

Added `fileExists()` method to check if a file already exists in storage before operations.

### 2. Smart File Replacement

Created `uploadActivityFile()` method that:

- **Uses activity ID as filename**: `{activityId}.{extension}` for consistent naming
- **Automatic cleanup**: Deletes old files if they have different names/extensions
- **Upsert behavior**: Replaces existing files with same name automatically
- **Validation built-in**: File type and size validation included

### 3. Updated API Routes

#### Create Route (`/api/activity/create`)

- Uses `SupabaseStorage.uploadActivityFile()` for cleaner code
- Automatic file validation and error handling
- Better error messages passed through from validation

#### Update Route (`/api/activity/[id]/update`)

- Passes old file URL for proper cleanup
- Automatically removes old files with different extensions
- Cleaner validation handling

## File Management Strategy

### File Naming Convention

- **Pattern**: `{activityId}.{fileExtension}`
- **Example**: `123.pdf`, `456.docx`, `789.jpg`

### Replacement Logic

1. **Same extension**: File is replaced using `upsert: true`
2. **Different extension**: Old file is deleted, new file uploaded
3. **No previous file**: New file uploaded directly

### Error Handling

- File validation errors are properly propagated
- Activity cleanup if file upload fails (create only)
- Detailed error messages for debugging

## Benefits

✅ **Consistent naming** using activity IDs  
✅ **Automatic cleanup** of old files  
✅ **Proper replacement** regardless of file type changes  
✅ **Built-in validation** with clear error messages  
✅ **Cleaner API code** with centralized file handling  
✅ **Better error handling** throughout the flow

## Usage Examples

### Creating Activity with File

```typescript
// File automatically named: {newActivityId}.{extension}
const result = await SupabaseStorage.uploadActivityFile(file, activityId);
```

### Updating Activity with New File

```typescript
// Old file cleaned up, new file uploaded
const result = await SupabaseStorage.uploadActivityFile(
  newFile,
  activityId,
  oldFileUrl // For cleanup
);
```

The implementation now provides robust file management with automatic cleanup and consistent naming!
