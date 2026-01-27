/**
 * Re-export the generated Convex API from the backend.
 * This allows the frontend to use the actual Convex function references.
 */

/**
 * IMPORTANT:
 * In environments where Convex codegen hasn't been run yet, importing
 * `backend/convex/_generated/api` will fail and/or produce non-functionReference
 * objects, which crashes Convex React hooks.
 *
 * `anyApi` is provided by Convex specifically for custom clients and testing.
 * It returns real runtime FunctionReference objects (via a Proxy) that satisfy
 * Convex's `getFunctionName` checks.
 *
 * When you run Convex codegen locally you can switch back to the generated API
 * for strong typing, but this keeps the app working in the preview.
 */
export { anyApi as api } from "convex/server";
