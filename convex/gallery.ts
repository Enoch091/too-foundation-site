import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new gallery collection (admin only)
export const createGalleryCollection = mutation({
  args: {
    admin_email: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    images: v.array(
      v.object({
        url: v.string(),
        alt_text: v.string(),
      })
    ),
    featured: v.boolean(),
  },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can create gallery collections");
    }

    const galleryId = await ctx.db.insert("gallery", {
      title: args.title,
      description: args.description,
      images: args.images.map((img) => ({
        ...img,
        storage_id: undefined,
      })),
      category: args.category,
      featured: args.featured,
      created_by: user._id,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    return await ctx.db.get(galleryId);
  },
});

// Update gallery collection (admin only)
export const updateGalleryCollection = mutation({
  args: {
    admin_email: v.string(),
    gallery_id: v.id("gallery"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    images: v.optional(
      v.array(
        v.object({
          url: v.string(),
          alt_text: v.string(),
        })
      )
    ),
    featured: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can update gallery collections");
    }

    const gallery = await ctx.db.get(args.gallery_id);
    if (!gallery) {
      throw new Error("Gallery collection not found");
    }

    const updates: any = {
      updated_at: Date.now(),
    };

    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.category !== undefined) updates.category = args.category;
    if (args.featured !== undefined) updates.featured = args.featured;
    if (args.images !== undefined) {
      updates.images = args.images.map((img) => ({
        ...img,
        storage_id: undefined,
      }));
    }

    await ctx.db.patch(args.gallery_id, updates);
    return await ctx.db.get(args.gallery_id);
  },
});

// Delete gallery collection (admin only)
export const deleteGalleryCollection = mutation({
  args: {
    admin_email: v.string(),
    gallery_id: v.id("gallery"),
  },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can delete gallery collections");
    }

    const gallery = await ctx.db.get(args.gallery_id);
    if (!gallery) {
      throw new Error("Gallery collection not found");
    }

    await ctx.db.delete(args.gallery_id);
    return { success: true, deletedId: args.gallery_id };
  },
});

// Get all featured gallery collections (public)
export const getFeaturedGallery = query({
  async handler(ctx) {
    return await ctx.db
      .query("gallery")
      .filter((q) => q.eq(q.field("featured"), true))
      .collect();
  },
});

// Get gallery by category (public)
export const getGalleryByCategory = query({
  args: { category: v.string() },
  async handler(ctx, args) {
    return await ctx.db
      .query("gallery")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Get all gallery collections (admin only)
export const getAllGalleryCollections = query({
  args: { admin_email: v.string() },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can view all gallery collections");
    }

    return await ctx.db.query("gallery").collect();
  },
});

// Add image to gallery collection (admin only)
export const addImageToGallery = mutation({
  args: {
    admin_email: v.string(),
    gallery_id: v.id("gallery"),
    url: v.string(),
    alt_text: v.string(),
  },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can add images to gallery");
    }

    const gallery = await ctx.db.get(args.gallery_id);
    if (!gallery) {
      throw new Error("Gallery collection not found");
    }

    const newImages = [
      ...gallery.images,
      {
        url: args.url,
        alt_text: args.alt_text,
        storage_id: undefined,
      },
    ];

    await ctx.db.patch(args.gallery_id, {
      images: newImages,
      updated_at: Date.now(),
    });

    return await ctx.db.get(args.gallery_id);
  },
});

// Remove image from gallery (admin only)
export const removeImageFromGallery = mutation({
  args: {
    admin_email: v.string(),
    gallery_id: v.id("gallery"),
    image_index: v.number(),
  },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can remove images from gallery");
    }

    const gallery = await ctx.db.get(args.gallery_id);
    if (!gallery) {
      throw new Error("Gallery collection not found");
    }

    if (args.image_index < 0 || args.image_index >= gallery.images.length) {
      throw new Error("Invalid image index");
    }

    const newImages = gallery.images.filter((_, i) => i !== args.image_index);

    await ctx.db.patch(args.gallery_id, {
      images: newImages,
      updated_at: Date.now(),
    });

    return await ctx.db.get(args.gallery_id);
  },
});
