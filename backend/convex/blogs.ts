import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Convex documents have a 1 MiB limit. Keep headroom and spill large bodies to storage.
const MAX_DOC_BYTES = 950 * 1024; // 950 KiB safety buffer for the whole document
const MAX_INLINE_CONTENT_BYTES = 400 * 1024; // inline content limit before spilling to storage

const getByteSize = (data: any) =>
  new TextEncoder().encode(typeof data === "string" ? data : JSON.stringify(data ?? {})).length;

const assertWithinDocLimit = (doc: any) => {
  const size = getByteSize(doc);
  if (size > MAX_DOC_BYTES) {
    throw new Error(
      `Blog content too large (${(size / 1024).toFixed(1)} KiB > ${(MAX_DOC_BYTES / 1024).toFixed(
        0
      )} KiB). Please shorten the content and try again.`
    );
  }
};

const storeContentIfLarge = async (
  ctx: any,
  content: string | undefined,
  existingStorageId?: string
) => {
  if (!content) {
    return { content: undefined, content_storage_id: existingStorageId };
  }

  const contentBytes = getByteSize(content);

  // Spill to Convex storage when too large to keep inline.
  if (contentBytes > MAX_INLINE_CONTENT_BYTES) {
    const storageId = await ctx.storage.store(
      new Blob([content], { type: "text/html" })
    );

    // Best-effort cleanup of prior stored content when replacing.
    if (existingStorageId && existingStorageId !== storageId) {
      try {
        await ctx.storage.delete(existingStorageId);
      } catch (_) {
        // ignore cleanup errors
      }
    }

    return { content: undefined, content_storage_id: storageId };
  }

  // Content small enough to inline.
  return { content, content_storage_id: existingStorageId };
};

// Enriches a blog with URLs for any storage-backed fields
const withBlogUrls = async (ctx: any, blog: any) => {
  const content_url = blog.content_storage_id
    ? await ctx.storage.getUrl(blog.content_storage_id)
    : undefined;
  
  const featured_image_url = blog.featured_image_storage_id
    ? await ctx.storage.getUrl(blog.featured_image_storage_id)
    : undefined;

  return {
    ...blog,
    content_url,
    // Prefer storage URL, fallback to inline URL if exists
    featured_image: featured_image_url ?? blog.featured_image,
    featured_image_url,
  };
};

// Create a new blog post (admin only)
export const createBlog = mutation({
  args: {
    admin_email: v.string(),
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    featured_image: v.optional(v.string()), // External URL (backward compat)
    featured_image_storage_id: v.optional(v.string()), // Convex storage ID (preferred)
    tags: v.array(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    author_name: v.optional(v.string()),
    publish_date: v.optional(v.number()),
  },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can create blogs");
    }

    // Check for duplicate slug
    const existing = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error("A blog with this slug already exists");
    }

    const { content, content_storage_id } = await storeContentIfLarge(
      ctx,
      args.content
    );

    const newDoc = {
      title: args.title,
      slug: args.slug,
      excerpt: args.excerpt,
      content,
      content_storage_id,
      author_id: user._id,
      author_name: args.author_name,
      // Use storage ID if provided, otherwise use inline URL
      featured_image: args.featured_image_storage_id ? undefined : args.featured_image,
      featured_image_storage_id: args.featured_image_storage_id,
      tags: args.tags,
      status: args.status,
      published_at:
        args.status === "published" ? args.publish_date || Date.now() : undefined,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    // Build doc for size check - exclude large fields stored externally
    const docForSizeCheck = { ...newDoc };
    if (content_storage_id) {
      delete (docForSizeCheck as any).content;
    }
    if (args.featured_image_storage_id) {
      delete (docForSizeCheck as any).featured_image;
    }
    assertWithinDocLimit(docForSizeCheck);

    const blogId = await ctx.db.insert("blogs", newDoc);

    return await ctx.db.get(blogId);
  },
});

// Update blog post (admin only)
export const updateBlog = mutation({
  args: {
    admin_email: v.string(),
    blog_id: v.id("blogs"),
    title: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    featured_image: v.optional(v.string()), // External URL (backward compat)
    featured_image_storage_id: v.optional(v.string()), // Convex storage ID (preferred)
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))),
    author_name: v.optional(v.string()),
    publish_date: v.optional(v.number()),
  },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can update blogs");
    }

    const blog = await ctx.db.get(args.blog_id);
    if (!blog) {
      throw new Error("Blog not found");
    }

    // Handle content storage first
    const currentContent =
      args.content !== undefined ? args.content : (blog as any).content;
    const { content, content_storage_id } = await storeContentIfLarge(
      ctx,
      currentContent,
      blog.content_storage_id
    );

    const updates: any = {
      updated_at: Date.now(),
      // Set content to undefined if stored externally, otherwise use the content
      content: content,
    };

    if (content_storage_id) {
      updates.content_storage_id = content_storage_id;
    }

    if (args.title !== undefined) updates.title = args.title;
    if (args.excerpt !== undefined) updates.excerpt = args.excerpt;
    if (args.author_name !== undefined) updates.author_name = args.author_name;
    
    // Handle featured image - prefer storage ID over inline URL
    if (args.featured_image_storage_id !== undefined) {
      updates.featured_image_storage_id = args.featured_image_storage_id;
      updates.featured_image = undefined; // Clear inline URL when using storage
    } else if (args.featured_image !== undefined) {
      updates.featured_image = args.featured_image;
    }
    
    if (args.tags !== undefined) updates.tags = args.tags;
    
    // Handle publish_date - can be updated independently of status
    if (args.publish_date !== undefined) {
      updates.published_at = args.publish_date;
    }
    
    if (args.status !== undefined) {
      updates.status = args.status;
      if (args.status === "published" && !blog.published_at && args.publish_date === undefined) {
        // Only set published_at to now if blog wasn't published and no date provided
        updates.published_at = Date.now();
      }
    }

    // Build doc for size check - exclude large fields stored externally
    const docForSizeCheck: any = { ...blog, ...updates };
    if (content_storage_id) {
      delete docForSizeCheck.content;
    }
    if (updates.featured_image_storage_id) {
      delete docForSizeCheck.featured_image;
    }
    assertWithinDocLimit(docForSizeCheck);

    await ctx.db.patch(args.blog_id, updates);
    return await ctx.db.get(args.blog_id);
  },
});

// Delete blog post (admin only)
export const deleteBlog = mutation({
  args: {
    admin_email: v.string(),
    blog_id: v.id("blogs"),
  },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can delete blogs");
    }

    const blog = await ctx.db.get(args.blog_id);
    if (!blog) {
      throw new Error("Blog not found");
    }

    // Clean up storage files before deleting the blog
    if (blog.content_storage_id) {
      try {
        await ctx.storage.delete(blog.content_storage_id);
      } catch (_) {
        // Ignore cleanup errors
      }
    }
    if (blog.featured_image_storage_id) {
      try {
        await ctx.storage.delete(blog.featured_image_storage_id);
      } catch (_) {
        // Ignore cleanup errors
      }
    }

    await ctx.db.delete(args.blog_id);
    return { success: true, deletedId: args.blog_id };
  },
});

// Get all published blogs (public)
export const getPublishedBlogs = query({
  async handler(ctx) {
    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();

    // Enrich blogs with author information and content URL
    const enrichedBlogs = await Promise.all(
      blogs.map(async (blog) => {
        const author = await ctx.db.get(blog.author_id);
        const withUrl = await withBlogUrls(ctx, blog);
        return {
          ...withUrl,
          author_name: blog.author_name ?? author?.name ?? "Unknown Author",
        };
      })
    );

    return enrichedBlogs;
  },
});

// Get blog by slug (public)
export const getBlogBySlug = query({
  args: { slug: v.string() },
  async handler(ctx, args) {
    const blog = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!blog) return null;

    const author = await ctx.db.get(blog.author_id);
    const withUrl = await withBlogUrls(ctx, blog);
    return {
      ...withUrl,
      author_name: blog.author_name ?? author?.name ?? "Unknown Author",
    };
  },
});

// Get all blogs (admin only)
export const getAllBlogs = query({
  args: { admin_email: v.string() },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can view all blogs");
    }

    const blogs = await ctx.db.query("blogs").order("desc").collect();
    return await Promise.all(blogs.map((b) => withBlogUrls(ctx, b)));
  },
});

// Get blogs by author (admin only)
export const getBlogsByAuthor = query({
  args: { admin_email: v.string(), author_id: v.id("users") },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can filter blogs by author");
    }

    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_author", (q) => q.eq("author_id", args.author_id))
      .order("desc")
      .collect();

    return await Promise.all(blogs.map((b) => withBlogUrls(ctx, b)));
  },
});
