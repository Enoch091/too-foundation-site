import CMS from "netlify-cms-app";

const BlogPreview = ({ entry, widgetFor }) => {
  const title = entry.getIn(["data", "title"]);
  const author = entry.getIn(["data", "author"]);
  const date = entry.getIn(["data", "date"]);
  const image = entry.getIn(["data", "image"]);
  return `
    <div style="font-family:Inter,Arial,sans-serif;padding:20px;max-width:800px;margin:auto;">
      <h1 style="font-size:2rem;color:#0532D3;">${title || "Untitled Blog"}</h1>
      <p style="color:#555;">${author || "TOO Foundation"} • ${date || ""}</p>
      ${image ? `<img src="${image}" style="width:100%;border-radius:12px;margin:15px 0;">` : ""}
      <div>${widgetFor("body")}</div>
    </div>
  `;
};

const EventPreview = ({ entry, widgetFor }) => {
  const title = entry.getIn(["data", "title"]);
  const date = entry.getIn(["data", "event_date"]);
  const location = entry.getIn(["data", "location"]);
  return `
    <div style="font-family:Inter,Arial,sans-serif;padding:20px;max-width:800px;margin:auto;">
      <h1 style="font-size:2rem;color:#0532D3;">${title || "Untitled Event"}</h1>
      <p style="color:#555;">${date || ""} • ${location || ""}</p>
      <div>${widgetFor("body")}</div>
    </div>
  `;
};

CMS.registerPreviewTemplate("blogs", ({ entry, widgetFor }) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = BlogPreview({ entry, widgetFor });
  return wrapper;
});

CMS.registerPreviewTemplate("events", ({ entry, widgetFor }) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = EventPreview({ entry, widgetFor });
  return wrapper;
});
