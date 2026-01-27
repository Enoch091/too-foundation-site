import { ConvexReactClient } from "convex/react";
import { api } from "./convex-api";

/**
 * Upload a file to Convex Storage and return the storage ID
 */
export async function uploadFileToStorage(
  convex: ConvexReactClient,
  file: File,
  adminEmail: string
): Promise<string> {
  // Get a signed upload URL from Convex
  const uploadUrl = await convex.mutation(api.uploads.generateUploadUrl, {
    admin_email: adminEmail,
  });

  // Upload the file directly to storage
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload file: ${response.statusText}`);
  }

  const { storageId } = await response.json();
  return storageId;
}
