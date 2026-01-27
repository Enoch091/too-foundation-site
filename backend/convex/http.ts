import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Shared CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Public: list published blogs (lightweight JSON for static site)
http.route({
  path: "/public/blogs",
  method: "GET",
  handler: httpAction(async (ctx) => {
    try {
      const blogs = await ctx.runQuery(api.blogs.getPublishedBlogs, {});

      // Only expose fields needed on the static site
      const simplified = blogs.map((b) => ({
        id: b._id,
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        author: b.author_name,
        published_at: b.published_at || b.created_at,
        featured_image: b.featured_image,
        featured_image_url: b.featured_image_url,
        content_url: b.content_url,
      }));

      return new Response(JSON.stringify({ blogs: simplified }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("GET /public/blogs failed", error);
      return new Response(
        JSON.stringify({ error: "Failed to load blogs" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  }),
});

// Public: get a single published blog by slug (includes inline content if present)
http.route({
  path: "/public/blog",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response(
        JSON.stringify({ error: "Missing slug" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    try {
      const blog = await ctx.runQuery(api.blogs.getBlogBySlug, { slug });
      if (!blog || blog.status !== "published") {
        return new Response(
          JSON.stringify({ error: "Not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const result = {
        id: blog._id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        author: blog.author_name,
        published_at: blog.published_at || blog.created_at,
        featured_image: blog.featured_image,
        featured_image_url: blog.featured_image_url,
        content_url: blog.content_url,
        content: blog.content,
      };

      return new Response(JSON.stringify({ blog: result }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("GET /public/blog failed", error);
      return new Response(
        JSON.stringify({ error: "Failed to load blog" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  }),
});

// Public: list upcoming events (JSON for static site)
http.route({
  path: "/public/events",
  method: "GET",
  handler: httpAction(async (ctx) => {
    try {
      const events = await ctx.runQuery(api.events.getPublicEvents, {});

      const simplified = events.map((e) => ({
        id: e._id,
        title: e.title,
        slug: e.slug,
        description: e.description,
        date: e.start_date,
        end_date: e.end_date,
        location: e.location,
        status: e.status,
        image: e.image,
        image_url: e.image_url,
      }));

      return new Response(JSON.stringify({ events: simplified }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("GET /public/events failed", error);
      return new Response(
        JSON.stringify({ error: "Failed to load events" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  }),
});

// Send password reset code via Brevo
http.route({
  path: "/send-reset-email",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const { email, code } = await request.json();
      
      // @ts-ignore - process.env is available in Convex runtime
      const BREVO_API_KEY = process.env.BREVO_API_KEY;
      // Optional overrides for sender configuration
      // @ts-ignore
      const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "shawolhorizon@gmail.com";
      // @ts-ignore
      const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "The Olanike Omopariola Foundation";
      
      if (!BREVO_API_KEY) {
        console.error("BREVO_API_KEY not configured");
        return new Response(
          JSON.stringify({ error: "Email service not configured", code: "MISSING_API_KEY" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: {
            name: BREVO_SENDER_NAME,
            email: BREVO_SENDER_EMAIL,
          },
          to: [{ email }],
          subject: "Your Password Reset Code - TOOF Foundation",
          htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
                .content { padding: 30px; background: #f9f9f9; }
                .code-box { 
                  background: #16a34a;
                  color: white;
                  font-size: 32px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  padding: 20px 30px;
                  text-align: center;
                  border-radius: 10px;
                  margin: 25px 0;
                }
                .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>TOOF Foundation</h1>
                </div>
                <div class="content">
                  <h2>Password Reset Code</h2>
                  <p>We received a request to reset your password. Use the code below to reset your password:</p>
                  <div class="code-box">${code}</div>
                  <p><strong>This code will expire in 10 minutes.</strong></p>
                  <p>If you didn't request this password reset, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} The Olanike Omopariola Foundation. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        let details: any = undefined;
        try {
          details = JSON.parse(text);
        } catch (_e) {
          details = { raw: text };
        }
        console.error("Brevo API error:", details);
        return new Response(
          JSON.stringify({ error: "Failed to send email", details }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Password reset code sent to:", email);
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error sending reset email:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }),
});

// CORS preflight
http.route({
  path: "/send-reset-email",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

export default http;
