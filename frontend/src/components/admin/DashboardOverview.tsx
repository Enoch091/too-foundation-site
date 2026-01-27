import React from "react";

interface DashboardOverviewProps {
  blogs: any[] | undefined;
  events: any[] | undefined;
  users: any[] | undefined;
  onQuickAction: (action: "new-blog" | "new-event") => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  blogs,
  events,
  users,
  onQuickAction,
}) => {
  const totalBlogs = blogs?.length || 0;
  const totalEvents = events?.length || 0;
  const totalUsers = users?.length || 0;
  const upcomingEvents =
    events?.filter((e) => e.start_date > Date.now()).length || 0;

  const recentBlogs = blogs
    ?.sort((a, b) => (b.published_at || b.created_at) - (a.published_at || a.created_at))
    .slice(0, 5);

  const nextEvents = events
    ?.filter((e) => e.start_date > Date.now())
    .sort((a, b) => a.start_date - b.start_date)
    .slice(0, 3);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Blogs</p>
          <p className="text-3xl font-bold text-navy">{totalBlogs}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Events</p>
          <p className="text-3xl font-bold text-navy">{totalEvents}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Users</p>
          <p className="text-3xl font-bold text-navy">{totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground mb-1">Upcoming Events</p>
          <p className="text-3xl font-bold text-green">{upcomingEvents}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Recent Blogs */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Blogs</h2>
          {recentBlogs && recentBlogs.length > 0 ? (
            <ul className="space-y-3">
              {recentBlogs.map((blog) => (
                <li
                  key={blog._id}
                  className="flex justify-between items-center py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-foreground truncate max-w-[200px]">
                    {blog.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(blog.published_at || blog.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No blogs yet</p>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Events</h2>
          {nextEvents && nextEvents.length > 0 ? (
            <ul className="space-y-3">
              {nextEvents.map((event) => (
                <li
                  key={event._id}
                  className="flex justify-between items-center py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-foreground truncate max-w-[200px]">
                    {event.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(event.start_date)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming events</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => onQuickAction("new-blog")}
          className="px-6 py-3 bg-green text-white rounded-lg font-medium hover:bg-green/90 transition-colors"
        >
          + New Blog
        </button>
        <button
          onClick={() => onQuickAction("new-event")}
          className="px-6 py-3 bg-navy text-white rounded-lg font-medium hover:bg-navy/90 transition-colors"
        >
          + New Event
        </button>
      </div>
    </div>
  );
};

export default DashboardOverview;
