const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const slug = params.get('slug');

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined,
    { year: 'numeric', month: 'long', day: 'numeric' });

async function load() {
  try {
    const posts = await fetch('data/posts.json').then(r => r.json());
    const p = posts.find(x => x.slug === slug);
    if (!p) throw new Error('Not found');

    $('postCover').src = p.cover;
    $('postCover').alt = p.title;
    $('postTitle').textContent = p.title;
    $('postRead').textContent = `${p.readingMins} Min`;
    $('postDate').textContent = fmtDate(p.date);

    document.title = `${p.title} — The Olanike Omopariola Foundation`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', p.excerpt || p.title);

    const html = await fetch(`posts/${encodeURIComponent(slug)}.html`).then(r => r.text());
    $('postContent').innerHTML = html;
  } catch (e) {
    document.title = 'Story not found';
    $('postTitle').textContent = 'Story not found';
    $('postContent').innerHTML = `<p>We couldn’t find this story. Please go back to the <a href="blog.html">blog</a>.</p>`;
    console.error(e);
  }
}

load();
