import React, { useState, useRef } from "react";
import { sanitizeHtml } from "../../lib/sanitize";

interface BlogEditorProps {
  onSave: (data: BlogFormData, status: "draft" | "published") => void;
  onDelete?: () => void;
  initialData?: BlogFormData;
  authorName?: string;
  isEditing?: boolean;
}

export interface BlogFormData {
  title: string;
  content: string;
  coverImage: string | null; // Preview URL only (for display)
  coverImageFile?: File | null; // Actual file to upload
  author?: string;
  publishDate?: string;
  contentUrl?: string;
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  onSave,
  onDelete,
  initialData,
  authorName = "Oluwatoyin Omotayo",
  isEditing = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState<string | null>(
    initialData?.coverImage || null,
  );
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [author, setAuthor] = useState(initialData?.author || authorName);
  const [publishDate, setPublishDate] = useState(
    initialData?.publishDate || new Date().toISOString().split("T")[0],
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<string | null>(null);

  // Load content from a remote URL (stored in Convex storage) when editing
  React.useEffect(() => {
    let cancelled = false;

    const loadRemoteContent = async () => {
      if (content || !initialData?.contentUrl) return;
      try {
        const res = await fetch(initialData.contentUrl);
        const text = await res.text();
        if (!cancelled) {
          setContent(text);
        }
      } catch (_e) {
        // silently fail; editor will show empty content
      }
    };

    loadRemoteContent();

    return () => {
      cancelled = true;
    };
  }, [content, initialData?.contentUrl]);

  // Cleanup object URL on unmount
  React.useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    };
  }, []);

  const handleFormat = (command: "bold" | "italic") => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!range || range.collapsed) return;

    const tag = command === "bold" ? "strong" : "em";
    const element = document.createElement(tag);

    try {
      range.surroundContents(element);
    } catch (e) {
      // If surroundContents fails (e.g., partially selected elements),
      // extract contents and wrap them
      const contents = range.extractContents();
      element.appendChild(contents);
      range.insertNode(element);
    }

    // Update the content state
    handleContentChange();
    contentRef.current?.focus();
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      // Sanitize the HTML content before storing
      const sanitized = sanitizeHtml(contentRef.current.innerHTML);
      setContent(sanitized);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Cleanup previous object URL to prevent memory leak
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }

      // Store the actual file for upload
      setCoverImageFile(file);
      // Create a local URL for preview
      const previewUrl = URL.createObjectURL(file);
      imageUrlRef.current = previewUrl;
      setCoverImage(previewUrl);
    }
  };

  const handleSubmit = async (status: "draft" | "published") => {
    setIsSaving(true);
    try {
      await onSave(
        { title, content, coverImage, coverImageFile, author, publishDate },
        status,
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-8 bg-background">
      {/* Main Editor */}
      <div className="flex-1 bg-white rounded-lg shadow-sm p-4 md:p-6">
        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title Here"
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          />
        </div>

        {/* Article Body */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Article Body
          </label>
          <div className="border border-border rounded-md overflow-hidden">
            {/* Toolbar */}
            <div className="flex gap-2 p-3 border-b border-border bg-muted/30">
              <button
                type="button"
                onClick={() => handleFormat("bold")}
                className="w-8 h-8 flex items-center justify-center font-bold text-foreground hover:bg-muted rounded"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => handleFormat("italic")}
                className="w-8 h-8 flex items-center justify-center italic text-foreground hover:bg-muted rounded"
              >
                I
              </button>
            </div>
            {/* Content Area */}
            <div
              ref={contentRef}
              contentEditable
              onInput={handleContentChange}
              className={`p-4 focus:outline-none text-base md:text-lg overflow-y-auto transition-all duration-300 ${
                isContentExpanded ? "max-h-[1000px]" : "max-h-[400px]"
              }`}
              dangerouslySetInnerHTML={{ __html: content }}
              data-placeholder="Enter Title Here"
            />
            {/* See More/Less Button */}
            <div className="border-t border-border bg-muted/30 p-3 text-center">
              <button
                type="button"
                onClick={() => setIsContentExpanded(!isContentExpanded)}
                className="text-sm text-foreground hover:text-green transition-colors font-medium"
              >
                {isContentExpanded ? "See Less ▲" : "See More ▼"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[300px] flex flex-col gap-4">
        {/* Cover Image Upload */}
        <div
          className="bg-white rounded-lg shadow-sm p-4 aspect-square lg:aspect-auto flex items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {coverImage ? (
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <span className="text-4xl text-muted-foreground/50">+</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        <p className="text-xs md:text-sm font-medium text-foreground text-center">
          Upload Cover Image Here
        </p>

        {/* Author Input */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-xs font-semibold text-foreground mb-2">
            Author Name
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author name"
            className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          />
        </div>

        {/* Date Input */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-xs font-semibold text-foreground mb-2">
            Publish Date
          </label>
          <input
            type="text"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
            placeholder="e.g. January 15, 2025"
            className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          />
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-lg shadow-sm">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs md:text-sm font-medium text-foreground hover:bg-muted/30 transition-colors"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Live Preview
            </span>
            <span>→</span>
          </button>
        </div>

        {/* Meta Info */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-xs md:text-sm">
          <div>
            <span className="text-xs text-muted-foreground">Author:</span>
            <span className="text-xs md:text-sm font-medium text-foreground ml-1">
              {author || "No author set"}
            </span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Post Date:</span>
            <span className="text-xs md:text-sm font-medium text-foreground ml-1">
              {new Date(publishDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 bg-background p-3 rounded-lg shadow-sm">
          <button
            onClick={() => handleSubmit("draft")}
            disabled={isSaving || !title}
            className="flex-1 px-2 py-2 bg-[#4a4a4a] text-white text-xs font-medium rounded-md hover:bg-[#3a3a3a] transition-colors disabled:opacity-50"
          >
            {isEditing ? "Update" : "Save"}
          </button>
          <button
            onClick={() => handleSubmit("published")}
            disabled={isSaving || !title}
            className="flex-1 px-2 py-2 bg-green text-white text-xs font-medium rounded-md hover:bg-green-dark transition-colors disabled:opacity-50"
          >
            {isEditing ? "Update & Publish" : "Publish"}
          </button>
          {isEditing && onDelete && (
            <button
              onClick={onDelete}
              disabled={isSaving}
              className="px-2 py-2 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 whitespace-nowrap"
              title="Delete this blog post"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                Live Preview
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-2xl text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close preview"
              >
                ×
              </button>
            </div>

            {/* Preview Content */}
            <div className="p-6">
              {/* Featured Image */}
              {coverImage && (
                <img
                  src={coverImage}
                  alt={title || "Preview"}
                  className="w-full h-[300px] object-cover rounded-xl mb-6"
                />
              )}

              {/* Title */}
              <h1 className="uppercase text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {title || "Untitled Blog Post"}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <span className="font-semibold text-foreground/80">
                  {author || "Unknown Author"}
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <time>
                  {new Date(publishDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>

              {/* Content */}
              <div
                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none 
                          prose-headings:font-bold prose-headings:text-foreground prose-headings:mb-4 prose-headings:mt-8
                          prose-p:text-muted-foreground prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-base
                          prose-ul:my-6 prose-ul:space-y-2 prose-ul:text-muted-foreground
                          prose-ol:my-6 prose-ol:space-y-2 prose-ol:text-muted-foreground
                          prose-li:leading-[1.8] prose-li:text-base
                          prose-strong:text-foreground prose-strong:font-semibold
                          prose-a:text-green prose-a:no-underline hover:prose-a:underline
                          prose-blockquote:border-l-4 prose-blockquote:border-green prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-6
                          prose-img:rounded-lg prose-img:my-8"
                dangerouslySetInnerHTML={{
                  __html:
                    content ||
                    "<p class='text-muted-foreground'>No content yet...</p>",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEditor;
