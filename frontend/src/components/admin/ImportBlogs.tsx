import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../lib/convex-api";
import blogsData from "../../data/blogs.json";

interface ImportBlogsProps {
  userEmail: string;
}

const ImportBlogs: React.FC<ImportBlogsProps> = ({ userEmail }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const createBlog = useMutation(api.blogs.createBlog);

  const handleImportBlogs = async () => {
    if (
      !window.confirm(`This will import ${blogsData.length} blogs. Continue?`)
    ) {
      return;
    }

    setIsImporting(true);
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const blog of blogsData) {
      try {
        await createBlog({
          admin_email: userEmail,
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          featured_image: blog.featured_image,
          tags: blog.tags || [],
          status: "published",
          author_name: blog.author,
          publish_date: new Date(blog.date).getTime(),
        });
        results.success++;
      } catch (error: any) {
        results.failed++;
        const errorMsg = `Failed to import "${blog.title}": ${error.message}`;
        results.errors.push(errorMsg);
      }
    }

    setIsImporting(false);
    setImportStatus(results);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Bulk Import Blogs
        </h2>

        <p className="text-muted-foreground mb-6">
          Import all {blogsData.length} pre-written blog posts at once. These
          blogs cover topics related to domestic violence awareness, legal
          rights, and women empowerment in Nigeria.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Blogs to Import:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            {blogsData.map((blog) => (
              <li key={blog.slug}>• {blog.title}</li>
            ))}
          </ul>
        </div>

        {!importStatus ? (
          <button
            onClick={handleImportBlogs}
            disabled={isImporting}
            className="w-full px-6 py-3 bg-green text-white font-semibold rounded-lg hover:bg-green-dark transition-colors disabled:opacity-50"
          >
            {isImporting ? "Importing..." : "Import All Blogs"}
          </button>
        ) : (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg ${
                importStatus.failed === 0
                  ? "bg-green-50 border border-green text-green"
                  : "bg-yellow-50 border border-yellow-200 text-yellow-800"
              }`}
            >
              <p className="font-semibold">
                ✓ Successfully imported: {importStatus.success}
              </p>
              {importStatus.failed > 0 && (
                <p className="text-sm mt-1">✗ Failed: {importStatus.failed}</p>
              )}
            </div>

            {importStatus.errors.length > 0 && (
              <>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showDetails ? "Hide" : "Show"} Errors (
                  {importStatus.errors.length})
                </button>

                {showDetails && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 max-h-64 overflow-y-auto">
                    {importStatus.errors.map((error, idx) => (
                      <p key={idx} className="text-xs text-red-700 mb-2">
                        {error}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}

            <button
              onClick={() => setImportStatus(null)}
              className="w-full px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              Import Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportBlogs;
