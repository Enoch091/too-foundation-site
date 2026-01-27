import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "../lib/convex-api";
import AdminSidebar from "./admin/AdminSidebar";
import BlogEditor, { BlogFormData } from "./admin/BlogEditor";
import EventEditor, { EventFormData } from "./admin/EventEditor";
import UserManager from "./admin/UserManager";
import BlogList from "./admin/BlogList";
import EventList from "./admin/EventList";
import DashboardOverview from "./admin/DashboardOverview";
import { uploadFileToStorage } from "../lib/uploadToStorage";

interface AdminDashboardProps {
  userEmail: string;
}

type DashboardTab = "overview" | "blogs" | "events" | "users";

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userEmail }) => {
  const convex = useConvex();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [blogView, setBlogView] = useState<"create" | "list" | "edit">(
    "create",
  );
  const [eventView, setEventView] = useState<"create" | "list" | "edit">(
    "create",
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Queries
  const users = useQuery(api.auth.listAllUsers, { admin_email: userEmail });
  const blogs = useQuery(api.blogs.getAllBlogs, { admin_email: userEmail });
  const events = useQuery(api.events.getAllEvents, { admin_email: userEmail });

  // Mutations
  const createBlog = useMutation(api.blogs.createBlog);
  const updateBlog = useMutation(api.blogs.updateBlog);
  const deleteBlog = useMutation(api.blogs.deleteBlog);
  const createEvent = useMutation(api.events.createEvent);
  const updateEvent = useMutation(api.events.updateEvent);
  const deleteEvent = useMutation(api.events.deleteEvent);
  const promoteToAdmin = useMutation(api.auth.promoteToAdmin);
  const demoteFromAdmin = useMutation(api.auth.demoteFromAdmin);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleBlogSave = async (
    data: BlogFormData,
    status: "draft" | "published",
  ) => {
    try {
      const publishDate = data.publishDate
        ? new Date(data.publishDate).getTime()
        : Date.now();

      // Upload cover image to storage if a new file was selected
      let featured_image_storage_id: string | undefined;
      if (data.coverImageFile) {
        featured_image_storage_id = await uploadFileToStorage(
          convex,
          data.coverImageFile,
          userEmail,
        );
      }

      if (editingBlogId) {
        // Update existing blog
        await updateBlog({
          admin_email: userEmail,
          blog_id: editingBlogId as any,
          title: data.title,
          excerpt: data.content.substring(0, 150).replace(/<[^>]*>/g, ""),
          content: data.content,
          // Only send storage ID if we uploaded a new image
          ...(featured_image_storage_id && { featured_image_storage_id }),
          tags: [],
          status,
          author_name: data.author,
          publish_date: publishDate,
        });
        alert(`Blog updated successfully!`);
        setEditingBlogId(null);
        setBlogView("list");
      } else {
        // Create new blog
        await createBlog({
          admin_email: userEmail,
          title: data.title,
          slug: generateSlug(data.title),
          excerpt: data.content.substring(0, 150).replace(/<[^>]*>/g, ""),
          content: data.content,
          // Only send storage ID if we uploaded an image
          ...(featured_image_storage_id && { featured_image_storage_id }),
          tags: [],
          status,
          author_name: data.author,
          publish_date: publishDate,
        });
        alert(
          `Blog ${status === "published" ? "published" : "saved"} successfully!`,
        );
        setBlogView("list");
      }
    } catch (error: any) {
      alert(error.message || "Failed to save blog");
    }
  };

  const handleBlogDelete = async () => {
    if (!editingBlogId) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this blog? This cannot be undone.",
      )
    ) {
      return;
    }
    try {
      await deleteBlog({
        admin_email: userEmail,
        blog_id: editingBlogId as any,
      });
      alert("Blog deleted successfully!");
      setEditingBlogId(null);
      setBlogView("list");
    } catch (error: any) {
      alert(error.message || "Failed to delete blog");
    }
  };

  const handleEventSave = async (
    data: EventFormData,
    status: "draft" | "published",
  ) => {
    try {
      const startDate = new Date(
        `${data.startDate}T${data.startTime || "00:00"}`,
      ).getTime();

      if (editingEventId) {
        // Update existing event
        await updateEvent({
          admin_email: userEmail,
          event_id: editingEventId as any,
          title: data.title,
          description: data.description,
          start_date: startDate,
          location: data.location,
          status: status === "published" ? "upcoming" : "upcoming",
        });
        alert(`Event updated successfully!`);
        setEditingEventId(null);
        setEventView("list");
      } else {
        // Create new event
        await createEvent({
          admin_email: userEmail,
          title: data.title,
          slug: generateSlug(data.title),
          description: data.description,
          start_date: startDate,
          location: data.location,
        });
        alert(
          `Event ${status === "published" ? "published" : "saved"} successfully!`,
        );
        setEventView("list");
      }
    } catch (error: any) {
      alert(error.message || "Failed to save event");
    }
  };

  const handleEventDelete = async () => {
    if (!editingEventId) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This cannot be undone.",
      )
    ) {
      return;
    }
    try {
      await deleteEvent({
        admin_email: userEmail,
        event_id: editingEventId as any,
      });
      alert("Event deleted successfully!");
      setEditingEventId(null);
      setEventView("list");
    } catch (error: any) {
      alert(error.message || "Failed to delete event");
    }
  };

  const handlePromote = (userId: string) => {
    promoteToAdmin({ admin_email: userEmail, target_user_id: userId as any });
  };

  const handleDemote = (userId: string) => {
    demoteFromAdmin({ admin_email: userEmail, target_user_id: userId as any });
  };

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    // Close the overlay drawer on small screens after selecting a tab
    setIsSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-muted overflow-hidden">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-muted/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="flex items-center gap-2 text-foreground"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open admin navigation"
          >
            <span className="h-12 w-12 rounded-full bg-white text-navy shadow-sm border border-border flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-navy"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </span>
            <div className="text-sm font-semibold capitalize">{activeTab}</div>
          </button>
        </div>
        {/* Tab selector removed on mobile to prevent horizontal scroll - use drawer instead */}
      </div>

      {/* Overlay for mobile drawer */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex h-full pt-[118px] md:pt-0">
        {/* Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto">
          {activeTab === "overview" && (
            <DashboardOverview
              blogs={blogs as any}
              events={events as any}
              users={users as any}
              onQuickAction={(action) => {
                if (action === "new-blog") {
                  setActiveTab("blogs");
                  setBlogView("create");
                } else if (action === "new-event") {
                  setActiveTab("events");
                  setEventView("create");
                }
              }}
            />
          )}
          {activeTab === "blogs" && (
            <>
              {blogView === "edit" && editingBlogId && blogs ? (
                <>
                  <div className="p-4 md:p-6 border-b border-border bg-blue-50">
                    <button
                      onClick={() => {
                        setEditingBlogId(null);
                        setBlogView("list");
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      ← Back to Blog List
                    </button>
                    <h2 className="text-xl font-bold text-foreground mt-2">
                      Editing Blog
                    </h2>
                  </div>
                  <BlogEditor
                    onSave={handleBlogSave}
                    onDelete={handleBlogDelete}
                    initialData={
                      blogs.find((b: any) => b._id === editingBlogId)
                        ? {
                            title: blogs.find(
                              (b: any) => b._id === editingBlogId,
                            ).title,
                            content: blogs.find(
                              (b: any) => b._id === editingBlogId,
                            ).content,
                            contentUrl: blogs.find(
                              (b: any) => b._id === editingBlogId,
                            ).content_url,
                            coverImage: blogs.find(
                              (b: any) => b._id === editingBlogId,
                            ).featured_image,
                            author:
                              blogs.find((b: any) => b._id === editingBlogId)
                                .author_name || "Oluwatoyin Omotayo",
                            publishDate: blogs.find(
                              (b: any) => b._id === editingBlogId,
                            ).published_at
                              ? new Date(
                                  blogs.find(
                                    (b: any) => b._id === editingBlogId,
                                  ).published_at,
                                )
                                  .toISOString()
                                  .split("T")[0]
                              : new Date().toISOString().split("T")[0],
                          }
                        : undefined
                    }
                    authorName="Oluwatoyin Omotayo"
                    isEditing={true}
                  />
                </>
              ) : (
                <>
                  <div className="p-4 md:p-6 border-b border-border flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setBlogView("create")}
                        className={`text-sm px-4 py-2 rounded ${
                          blogView === "create"
                            ? "bg-green text-white"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        Create New Blog
                      </button>
                      <button
                        onClick={() => setBlogView("list")}
                        className={`text-sm px-4 py-2 rounded ${
                          blogView === "list"
                            ? "bg-green text-white"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        Manage Blogs {blogs ? `(${blogs.length})` : ""}
                      </button>
                    </div>
                  </div>
                  {blogView === "create" && (
                    <BlogEditor
                      onSave={handleBlogSave}
                      authorName="Oluwatoyin Omotayo"
                    />
                  )}
                  {blogView === "list" && (
                    <BlogList
                      blogs={blogs as any}
                      onEdit={(id) => {
                        setEditingBlogId(id);
                        setBlogView("edit");
                      }}
                      onDelete={(id) => {
                        setEditingBlogId(id);
                        handleBlogDelete();
                      }}
                    />
                  )}
                </>
              )}
            </>
          )}

          {activeTab === "events" && (
            <>
              {eventView === "edit" && editingEventId && events ? (
                <>
                  <div className="p-4 md:p-6 border-b border-border bg-blue-50">
                    <button
                      onClick={() => {
                        setEditingEventId(null);
                        setEventView("list");
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      ← Back to Event List
                    </button>
                    <h2 className="text-xl font-bold text-foreground mt-2">
                      Editing Event
                    </h2>
                  </div>
                  <EventEditor
                    onSave={handleEventSave}
                    onDelete={handleEventDelete}
                    initialData={
                      events.find((e: any) => e._id === editingEventId)
                        ? {
                            title: events.find(
                              (e: any) => e._id === editingEventId,
                            ).title,
                            description: events.find(
                              (e: any) => e._id === editingEventId,
                            ).description,
                            startDate: new Date(
                              events.find((e: any) => e._id === editingEventId)
                                .start_date,
                            )
                              .toISOString()
                              .split("T")[0],
                            startTime: new Date(
                              events.find((e: any) => e._id === editingEventId)
                                .start_date,
                            )
                              .toISOString()
                              .split("T")[1]
                              .substring(0, 5),
                            location: events.find(
                              (e: any) => e._id === editingEventId,
                            ).location,
                          }
                        : undefined
                    }
                    isEditing={true}
                  />
                </>
              ) : (
                <>
                  <div className="p-4 md:p-6 border-b border-border flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEventView("create")}
                        className={`text-sm px-4 py-2 rounded ${
                          eventView === "create"
                            ? "bg-green text-white"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        Create New Event
                      </button>
                      <button
                        onClick={() => setEventView("list")}
                        className={`text-sm px-4 py-2 rounded ${
                          eventView === "list"
                            ? "bg-green text-white"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        Manage Events {events ? `(${events.length})` : ""}
                      </button>
                    </div>
                  </div>
                  {eventView === "create" && (
                    <EventEditor onSave={handleEventSave} />
                  )}
                  {eventView === "list" && (
                    <EventList
                      events={events as any}
                      onEdit={(id) => {
                        setEditingEventId(id);
                        setEventView("edit");
                      }}
                      onDelete={(id) => {
                        setEditingEventId(id);
                        handleEventDelete();
                      }}
                    />
                  )}
                </>
              )}
            </>
          )}

          {activeTab === "users" && (
            <UserManager
              users={users as any}
              onPromote={handlePromote}
              onDemote={handleDemote}
              currentUserEmail={userEmail}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
