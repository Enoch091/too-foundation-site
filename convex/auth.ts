import { internalMutation, query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Hash password (simple hashing - in production use bcrypt)
function hashPassword(password: string): string {
  // For now, use a simple approach. In production, integrate proper bcrypt
  // This is a placeholder - actual hashing should be done server-side
  return btoa(password); // Base64 encoding as placeholder
}

function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash;
}

// Sign up a new user
export const signup = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
  },
  async handler(ctx, args) {
    // Check if email already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Validate password length
    if (args.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Create new user with "admin" role (auto-admin on signup)
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      password_hash: hashPassword(args.password),
      role: "admin",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Failed to create user");
    }
    
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
});

// Sign in user
export const signin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    if (!verifyPassword(args.password, user.password_hash)) {
      throw new Error("Invalid password");
    }

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
});

// Get current user by email
export const getCurrentUser = query({
  args: { email: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) return null;

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
});

// Promote user to admin (admin only)
export const promoteToAdmin = mutation({
  args: {
    admin_email: v.string(),
    target_user_id: v.id("users"),
  },
  async handler(ctx, args) {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only admins can promote users");
    }

    const targetUser = await ctx.db.get(args.target_user_id);
    if (!targetUser) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.target_user_id, {
      role: "admin",
      updatedAt: Date.now(),
    });

    return await ctx.db.get(args.target_user_id);
  },
});

// Demote admin to user (admin only)
export const demoteFromAdmin = mutation({
  args: {
    admin_email: v.string(),
    target_user_id: v.id("users"),
  },
  async handler(ctx, args) {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only admins can demote users");
    }

    const targetUser = await ctx.db.get(args.target_user_id);
    if (!targetUser) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.target_user_id, {
      role: "user",
      updatedAt: Date.now(),
    });

    return await ctx.db.get(args.target_user_id);
  },
});

// List all users (admin only)
export const listAllUsers = query({
  args: { admin_email: v.string() },
  async handler(ctx, args) {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.admin_email))
      .first();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only admins can list users");
    }

    return await ctx.db.query("users").collect();
  },
});
