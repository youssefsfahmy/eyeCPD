import { createClient } from "@/app/lib/supabase/server";

export class SupabaseStorage {
  static readonly BUCKET_NAME = "activity-evidence";
  static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  static readonly ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  /**
   * Upload a file to Supabase storage
   */
  static async uploadFile(
    file: File,
    userId: string,
    activityId?: number
  ): Promise<{ url: string; path: string }> {
    const supabase = await createClient();

    // Validate file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error(
        "Invalid file type. Only PDF, JPG, PNG, DOC, and DOCX files are allowed."
      );
    }

    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error("File size must be less than 10MB.");
    }

    // Generate unique file path
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `${userId}/${timestamp}_${
      activityId || "temp"
    }.${fileExtension}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file: " + error.message);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  }

  /**
   * Delete a file from Supabase storage
   */
  static async deleteFile(filePath: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error("Error deleting file:", error);
      throw new Error("Failed to delete file: " + error.message);
    }
  }

  /**
   * Update file name after activity creation (for temp files)
   */
  static async moveFile(
    oldPath: string,
    userId: string,
    activityId: number
  ): Promise<{ url: string; path: string }> {
    const supabase = await createClient();

    // Generate new path with activity ID
    const timestamp = Date.now();
    const fileExtension = oldPath.split(".").pop();
    const newPath = `${userId}/${timestamp}_${activityId}.${fileExtension}`;

    // Move file
    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .move(oldPath, newPath);

    if (error) {
      console.error("Error moving file:", error);
      throw new Error("Failed to move file: " + error.message);
    }

    // Get new public URL
    const { data: urlData } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(newPath);

    return {
      url: urlData.publicUrl,
      path: newPath,
    };
  }

  /**
   * Get file information
   */
  static getFileInfo(file: File): {
    name: string;
    size: number;
    type: string;
    sizeFormatted: string;
  } {
    const formatBytes = (bytes: number, decimals = 2) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    return {
      name: file.name,
      size: file.size,
      type: file.type,
      sizeFormatted: formatBytes(file.size),
    };
  }

  /**
   * Check if a file exists in storage
   */
  static async fileExists(filePath: string): Promise<boolean> {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .list(filePath.split("/").slice(0, -1).join("/") || "", {
        search: filePath.split("/").pop(),
      });

    if (error) {
      console.error("Error checking file existence:", error);
      return false;
    }

    return data && data.length > 0;
  }

  /**
   * Upload file with automatic replacement if it exists
   * Uses activity ID as the file name for consistent naming
   */
  static async uploadActivityFile(
    file: File,
    activityId: number,
    oldFilePath?: string
  ): Promise<{ url: string; path: string }> {
    const supabase = await createClient();

    // Validate file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error(
        "Invalid file type. Only PDF, JPG, PNG, DOC, and DOCX files are allowed."
      );
    }

    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error("File size must be less than 10MB.");
    }

    // Generate file name using activity ID + extension
    const fileExtension = file.name.split(".").pop();
    const fileName = `${activityId}.${fileExtension}`;

    // If there's an old file path, extract the old file name from the URL
    if (oldFilePath) {
      try {
        // Extract the file name from the URL (last part after the last slash)
        const oldFileName = oldFilePath.split("/").pop();

        // Only delete if the old file has a different name (different extension)
        if (oldFileName && oldFileName !== fileName) {
          await this.deleteFile(oldFileName);
        }
        // If same fileName, upsert will handle the replacement
      } catch (error) {
        console.warn("Could not delete old file:", error);
        // Don't fail the upload if old file deletion fails
      }
    }

    // Upload file with upsert to replace if exists with same name
    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true, // This will replace the file if it exists with same name
      });

    if (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file: " + error.message);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  }
}
