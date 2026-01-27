import React, { useMemo, useState } from "react";

interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  created_at: number;
  updated_at: number;
  published_at?: number;
}

interface BlogListProps {
  blogs: BlogItem[] | undefined;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const BlogList: React.FC<BlogListProps> = ({ blogs, onEdit, onDelete }) => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BlogItem["status"]>(
    "all",
  );

  const filtered = useMemo(() => {
    if (!blogs) return [];
    return blogs
      .filter((b) =>
        statusFilter === "all" ? true : b.status === statusFilter,
      )
      .filter((b) =>
        query
          ? b.title.toLowerCase().includes(query.toLowerCase()) ||
            b.slug.toLowerCase().includes(query.toLowerCase())
          : true,
      );
  }, [blogs, query, statusFilter]);

  if (!blogs) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-muted-foreground text-center">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between border-b border-border">
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or slug"
              className="border border-border rounded px-3 py-2 w-full sm:w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-border rounded px-3 py-2 sm:w-48"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="text-sm text-muted-foreground">
            {filtered.length} of {blogs.length} shown
          </div>
        </div>

        <div className="overflow-x-auto hidden md:block">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Slug
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Updated
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((b) => (
                <tr
                  key={b._id}
                  className="hover:bg-muted/20 cursor-pointer"
                  onClick={() => onEdit(b._id)}
                >
                  <td className="px-6 py-4 text-sm text-foreground">
                    {b.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {b.slug}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        b.status === "published"
                          ? "bg-green/10 text-green"
                          : b.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(b.updated_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(b._id);
                      }}
                      className="px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(b._id);
                      }}
                      className="px-3 py-2 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="block md:hidden divide-y divide-border">
          {filtered.map((b) => (
            <div
              key={b._id}
              className="p-4 space-y-2 cursor-pointer hover:bg-muted/20"
              onClick={() => onEdit(b._id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-foreground break-words">
                    {b.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{b.slug}</p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    b.status === "published"
                      ? "bg-green/10 text-green"
                      : b.status === "draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {b.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Updated {new Date(b.updated_at).toLocaleString()}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(b._id);
                  }}
                  className="px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(b._id);
                  }}
                  className="px-3 py-2 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No blogs found.
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
