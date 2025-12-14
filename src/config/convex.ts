// This file helps configure environment variables for Convex
// Copy the values from your Convex and Clerk dashboards

export const CONVEX_CONFIG = {
  // Get this from: https://dashboard.convex.dev
  // After running `convex init`, it will be in your .env.local
  CONVEX_URL: import.meta.env.VITE_CONVEX_URL || "",

  // Get these from: https://dashboard.clerk.com/apps
  CLERK_PUBLISHABLE_KEY:
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "",
};

// Validation
if (!CONVEX_CONFIG.CONVEX_URL) {
  console.warn(
    "VITE_CONVEX_URL is not set. Set it in .env.local to enable Convex features."
  );
}

if (!CONVEX_CONFIG.CLERK_PUBLISHABLE_KEY) {
  console.warn(
    "VITE_CLERK_PUBLISHABLE_KEY is not set. Set it in .env.local to enable authentication."
  );
}

export default CONVEX_CONFIG;
