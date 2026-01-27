import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Generate a URL for uploading files directly to Convex Storage (admin only)
export const generateUploadUrl = mutation({
  args: { admin_email: v.string() },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can upload files");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// Get a public URL for a storage ID
export const getStorageUrl = mutation({
  args: { storage_id: v.string() },
  async handler(ctx, args) {
    return await ctx.storage.getUrl(args.storage_id);
  },
});
