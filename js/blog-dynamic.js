(function(){
  const HERO_ID = "blogHero";
  const LIST_ID = "blogList";
  const LOAD_WRAP_ID = "blogLoadMoreWrap";
  const LOAD_BTN_ID = "blogLoadMoreBtn";
  const API_URL = "https://peaceful-loris-622.convex.site/public/blogs";
  const PAGE_SIZE = 5;

  const heroEl = document.getElementById(HERO_ID);
  const listEl = document.getElementById(LIST_ID);
  const loadWrap = document.getElementById(LOAD_WRAP_ID);
  const loadBtn = document.getElementById(LOAD_BTN_ID);

  if (!heroEl || !listEl) return;

  const fmtDate = (ms) => {
    if (!ms) return "";
    try {
      return new Date(ms).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return "";
    }
  };

  const blogUrl = (slug) => `blog-post.html?slug=${encodeURIComponent(slug || "")}`;

  const renderHero = (blog) => {
    const img = blog.featured_image_url || blog.featured_image || "assets/images/blog-hero-when-a-girl.jpg";
    heroEl.innerHTML = `
      <a class="feat-card" href="${blogUrl(blog.slug)}">
        <img class="feat-img" src="${img}" alt="${blog.title || "Blog image"}" />
        <div class="feat-meta">
          <h2 class="feat-title">${blog.title || "Untitled"}</h2>
          <div class="meta-row">
            <span class="meta">${blog.author || "TOOF"}</span>
            <span class="dot" aria-hidden="true"></span>
            <time class="meta" datetime="${fmtDate(blog.published_at)}">${fmtDate(blog.published_at)}</time>
          </div>
        </div>
      </a>
    `;
  };

  const makeCard = (blog) => {
    const li = document.createElement("li");
    li.className = "row";
    const img = blog.featured_image_url || blog.featured_image || "assets/images/NAVIGATING.jpg";
    li.innerHTML = `
      <article class="post-card">
        <a class="card-link" href="${blogUrl(blog.slug)}">
          <img class="thumb" src="${img}" alt="${blog.title || "Blog"}" />
          <div class="info">
            <h3 class="title">${blog.title || "Untitled"}</h3>
            <div class="meta-row">
              <span class="meta">${blog.author || "TOOF"}</span>
              <span class="dot" aria-hidden="true"></span>
              <time class="meta" datetime="${fmtDate(blog.published_at)}">${fmtDate(blog.published_at)}</time>
            </div>
          </div>
        </a>
      </article>
    `;
    return li;
  };

  const renderList = (blogs) => {
    listEl.innerHTML = "";
    let shown = 5; // Show first 5 blogs immediately

    const paint = () => {
      const slice = blogs.slice(0, shown);
      listEl.innerHTML = "";
      slice.forEach((b) => listEl.appendChild(makeCard(b)));

      if (shown < blogs.length) {
        loadWrap.hidden = false;
        loadBtn.textContent = "Load More";
      } else {
        loadWrap.hidden = true;
      }
    };

    if (loadBtn) loadBtn.onclick = () => {
      shown += PAGE_SIZE;
      paint();
    };
    paint();
  };

  const showError = (msg) => {
    heroEl.innerHTML = `<div style="padding:24px; text-align:center; color:#B00020;">${msg}</div>`;
    listEl.innerHTML = "";
    if (loadWrap) loadWrap.hidden = true;
  };

  const load = async () => {
    try {
      console.log("Fetching blogs from:", API_URL);
      const res = await fetch(API_URL, { cache: "no-store" });
      console.log("Response status:", res.status);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log("Blogs response:", data);
      const blogs = Array.isArray(data.blogs) ? data.blogs : [];
      if (!blogs.length) {
        showError("No blogs yet. Check back soon.");
        return;
      }

      const sorted = [...blogs].sort((a, b) => (b.published_at || 0) - (a.published_at || 0));
      renderHero(sorted[0]);
      renderList(sorted.slice(1));
    } catch (e) {
      console.error("Failed to load blogs", e);
      showError("We couldn't load blogs right now. (Check console for details)");
    }
  };

  load();
})();
