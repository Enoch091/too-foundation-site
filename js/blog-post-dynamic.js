(function(){
  const API_URL = "https://peaceful-loris-622.convex.site/public/blog";

  const heroImg = document.getElementById("postHeroImg");
  const titleEl = document.getElementById("postTitle");
  const authorEl = document.getElementById("postAuthor");
  const dateEl = document.getElementById("postDate");
  const contentEl = document.getElementById("postContent");

  const params = new URLSearchParams(location.search);
  const slug = params.get("slug");

  const setError = (msg) => {
    titleEl.textContent = "Post not found";
    authorEl.textContent = "";
    dateEl.textContent = "";
    if (heroImg) heroImg.src = "assets/images/blog-hero-when-a-girl.jpg";
    contentEl.innerHTML = `<p>${msg}</p>`;
  };

  const fmtDate = (ms) => {
    if (!ms) return "";
    try {
      return new Date(ms).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    } catch { return ""; }
  };

  const loadContentHtml = async (blog) => {
    if (blog.content && blog.content.trim().length) return blog.content;
    if (!blog.content_url) return "<p>No content available.</p>";
    try {
      const res = await fetch(blog.content_url, { cache: "no-store" });
      if (!res.ok) throw new Error("content fetch failed");
      return await res.text();
    } catch (e) {
      console.error("Failed to fetch blog content", e);
      return "<p>Unable to load content.</p>";
    }
  };

  const load = async () => {
    if (!slug) {
      setError("Missing article slug.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const blog = data.blog;
      if (!blog) throw new Error("No blog");

      titleEl.textContent = blog.title || "Untitled";
      authorEl.textContent = blog.author || "TOOF";
      dateEl.textContent = fmtDate(blog.published_at);
      if (heroImg) {
        heroImg.src = blog.featured_image_url || blog.featured_image || "assets/images/blog-hero-when-a-girl.jpg";
        heroImg.alt = blog.title || "Blog hero";
      }

      const html = await loadContentHtml(blog);
      contentEl.innerHTML = html;
    } catch (e) {
      console.error("Failed to load blog", e);
      setError("We couldn't find this article. Please go back to the blog list.");
    }
  };

  load();
})();
