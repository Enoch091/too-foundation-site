import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Enriches an event with URLs for any storage-backed fields
const withEventUrls = async (ctx: any, event: any) => {
  const image_url = event.image_storage_id
    ? await ctx.storage.getUrl(event.image_storage_id)
    : undefined;

  return {
    ...event,
    // Prefer storage URL, fallback to inline URL if exists
    image: image_url ?? event.image,
    image_url,
  };
};

// Create a new event (admin only)
export const createEvent = mutation({
  args: {
    admin_email: v.string(),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    start_date: v.number(),
    end_date: v.optional(v.number()),
    location: v.string(),
    image: v.optional(v.string()), // External URL (backward compat)
    image_storage_id: v.optional(v.string()), // Convex storage ID (preferred)
    capacity: v.optional(v.number()),
  },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can create events");
    }

    // Check for duplicate slug
    const existing = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error("An event with this slug already exists");
    }

    const eventId = await ctx.db.insert("events", {
      title: args.title,
      slug: args.slug,
      description: args.description,
      start_date: args.start_date,
      end_date: args.end_date,
      location: args.location,
      // Use storage ID if provided, otherwise use inline URL
      image: args.image_storage_id ? undefined : args.image,
      image_storage_id: args.image_storage_id,
      capacity: args.capacity,
      registrations: 0,
      status: "upcoming",
      organizer_id: user._id,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    return await ctx.db.get(eventId);
  },
});

// Update event (admin only)
export const updateEvent = mutation({
  args: {
    admin_email: v.string(),
    event_id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    start_date: v.optional(v.number()),
    end_date: v.optional(v.number()),
    location: v.optional(v.string()),
    image: v.optional(v.string()), // External URL (backward compat)
    image_storage_id: v.optional(v.string()), // Convex storage ID (preferred)
    capacity: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("upcoming"),
        v.literal("ongoing"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
  },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can update events");
    }

    const event = await ctx.db.get(args.event_id);
    if (!event) {
      throw new Error("Event not found");
    }

    const updates: any = {
      updated_at: Date.now(),
    };

    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.start_date !== undefined) updates.start_date = args.start_date;
    if (args.end_date !== undefined) updates.end_date = args.end_date;
    if (args.location !== undefined) updates.location = args.location;
    
    // Handle image - prefer storage ID over inline URL
    if (args.image_storage_id !== undefined) {
      updates.image_storage_id = args.image_storage_id;
      updates.image = undefined; // Clear inline URL when using storage
    } else if (args.image !== undefined) {
      updates.image = args.image;
    }
    
    if (args.capacity !== undefined) updates.capacity = args.capacity;
    if (args.status !== undefined) updates.status = args.status;

    await ctx.db.patch(args.event_id, updates);
    return await ctx.db.get(args.event_id);
  },
});

// Delete event (admin only)
export const deleteEvent = mutation({
  args: {
    admin_email: v.string(),
    event_id: v.id("events"),
  },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can delete events");
    }

    const event = await ctx.db.get(args.event_id);
    if (!event) {
      throw new Error("Event not found");
    }

    // Clean up storage files before deleting the event
    if (event.image_storage_id) {
      try {
        await ctx.storage.delete(event.image_storage_id);
      } catch (_) {
        // Ignore cleanup errors
      }
    }

    // Also delete registrations for this event
    const registrations = await ctx.db
      .query("event_registrations")
      .withIndex("by_event", (q) => q.eq("event_id", args.event_id))
      .collect();

    for (const reg of registrations) {
      await ctx.db.delete(reg._id);
    }

    await ctx.db.delete(args.event_id);
    return { success: true, deletedId: args.event_id };
  },
});

// Get all upcoming/public events
export const getPublicEvents = query({
  async handler(ctx) {
    const events = await ctx.db
      .query("events")
      .withIndex("by_status", (q) =>
        q.eq("status", "upcoming")
      )
      .order("desc")
      .collect();
    
    return await Promise.all(events.map((e) => withEventUrls(ctx, e)));
  },
});

// Get event by slug
export const getEventBySlug = query({
  args: { slug: v.string() },
  async handler(ctx, args) {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    
    if (!event) return null;
    return await withEventUrls(ctx, event);
  },
});

// Get all events (admin only)
export const getAllEvents = query({
  args: { admin_email: v.string() },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can view all events");
    }

    const events = await ctx.db.query("events").order("desc").collect();
    return await Promise.all(events.map((e) => withEventUrls(ctx, e)));
  },
});

// Register for an event (public)
export const registerForEvent = mutation({
  args: {
    event_id: v.id("events"),
    user_name: v.string(),
    user_email: v.string(),
    phone: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const event = await ctx.db.get(args.event_id);
    if (!event) {
      throw new Error("Event not found");
    }

    // Check capacity if set
    if (event.capacity && event.registrations >= event.capacity) {
      throw new Error("Event is at full capacity");
    }

    // Create registration
    const registrationId = await ctx.db.insert("event_registrations", {
      event_id: args.event_id,
      user_name: args.user_name,
      user_email: args.user_email,
      phone: args.phone,
      registered_at: Date.now(),
    });

    // Increment registration count
    await ctx.db.patch(args.event_id, {
      registrations: event.registrations + 1,
      updated_at: Date.now(),
    });

    return await ctx.db.get(registrationId);
  },
});

// Get event registrations (admin only)
export const getEventRegistrations = query({
  args: {
    admin_email: v.string(),
    event_id: v.id("events"),
  },
  async handler(ctx, args) {
    // Verify admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can view registrations");
    }

    return await ctx.db
      .query("event_registrations")
      .withIndex("by_event", (q) => q.eq("event_id", args.event_id))
      .collect();
  },
});
