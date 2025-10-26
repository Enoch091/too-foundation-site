import CMS from "netlify-cms-app";

/* ---------- Blog Preview ---------- */
const BlogPreview = ({ entry, widgetFor }) => {
  const title = entry.getIn(["data", "title"]);
  const author = entry.getIn(["data", "author"]);
  const date = entry.getIn(["data", "date"]);
  const image = entry.getIn(["data", "image"]);

  return (
    <div style="font-family:Inter,Arial,sans-serif;padding:20px;max-width:800px;margin:auto;">
      <h1 style="color:#062C0C;">{title || "Untitled Blog"}</h1>
      <p style="color:#555;">
        {author || "TOO Foundation"} • {date ? new Date(date).toDateString() : ""}
      </p>
      {image ? (
        <img src={image} style="width:100%;border-radius:12px;margin:20px 0;" />
      ) : (
        ""
      )}
      <div>{widgetFor("body")}</div>
    </div>
  );
};

/* ---------- Event Preview ---------- */
const EventPreview = ({ entry }) => {
  const title = entry.getIn(["data", "title"]);
  const event_date = entry.getIn(["data", "event_date"]);
  const time = entry.getIn(["data", "time"]);
  const location = entry.getIn(["data", "location"]);
  const summary = entry.getIn(["data", "summary"]);

  return (
    <div style="font-family:Inter,Arial,sans-serif;padding:20px;max-width:600px;margin:auto;">
      <h2 style="color:#60D669;">{title || "Event Title"}</h2>
      <p style="color:#062C0C;font-weight:500;">
        {event_date ? new Date(event_date).toDateString() : ""} • {time}
      </p>
      <p style="color:#555;">📍 {location}</p>
      <p style="margin-top:10px;color:#444;">{summary}</p>
    </div>
  );
};

/* ---------- Story Preview ---------- */
const StoryPreview = ({ entry, widgetFor }) => {
  const title = entry.getIn(["data", "title"]);
  const image = entry.getIn(["data", "image"]);

  return (
    <div style="font-family:Inter,Arial,sans-serif;padding:20px;max-width:700px;margin:auto;">
      <h2 style="color:#60D669;">{title || "Story Title"}</h2>
      {image ? (
        <img src={image} style="width:100%;border-radius:12px;margin:20px 0;" />
      ) : (
        ""
      )}
      <div>{widgetFor("body")}</div>
    </div>
  );
};

/* ---------- Register Templates ---------- */
CMS.registerPreviewTemplate("blogs", BlogPreview);
CMS.registerPreviewTemplate("events", EventPreview);
CMS.registerPreviewTemplate("stories", StoryPreview);
