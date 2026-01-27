import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../lib/convex-api";

interface GalleryManagerProps {
  userEmail: string;
}

interface GalleryCollection {
  _id: string;
  title: string;
  description?: string;
  category: string;
  featured: boolean;
  images: { url: string; alt_text: string }[];
  created_at: number;
}

const CATEGORIES = ["Impact", "Events", "Team", "Community", "General"];

const GalleryManager: React.FC<GalleryManagerProps> = ({ userEmail }) => {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    featured: false,
    images: [] as { url: string; alt_text: string }[],
  });
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  // Queries & Mutations
  const galleries = useQuery(api.gallery.getAllGalleryCollections, {
    admin_email: userEmail,
  });
  const createGallery = useMutation(api.gallery.createGalleryCollection);
  const updateGallery = useMutation(api.gallery.updateGalleryCollection);
  const deleteGallery = useMutation(api.gallery.deleteGalleryCollection);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "General",
      featured: false,
      images: [],
    });
    setNewImageUrl("");
    setNewImageAlt("");
  };

  const handleCreate = () => {
    resetForm();
    setEditingId(null);
    setView("create");
  };

  const handleEdit = (gallery: GalleryCollection) => {
    setFormData({
      title: gallery.title,
      description: gallery.description || "",
      category: gallery.category,
      featured: gallery.featured,
      images: gallery.images,
    });
    setEditingId(gallery._id);
    setView("edit");
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setFormData({
      ...formData,
      images: [
        ...formData.images,
        { url: newImageUrl, alt_text: newImageAlt || "Gallery image" },
      ],
    });
    setNewImageUrl("");
    setNewImageAlt("");
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateGallery({
          admin_email: userEmail,
          gallery_id: editingId as any,
          title: formData.title,
          description: formData.description || undefined,
          category: formData.category,
          featured: formData.featured,
          images: formData.images,
        });
        alert("Gallery updated successfully!");
      } else {
        await createGallery({
          admin_email: userEmail,
          title: formData.title,
          description: formData.description || undefined,
          category: formData.category,
          featured: formData.featured,
          images: formData.images,
        });
        alert("Gallery created successfully!");
      }
      resetForm();
      setEditingId(null);
      setView("list");
    } catch (error: any) {
      alert(error.message || "Failed to save gallery");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this gallery?"))
      return;
    try {
      await deleteGallery({
        admin_email: userEmail,
        gallery_id: id as any,
      });
      alert("Gallery deleted successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to delete gallery");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Gallery Manager</h1>
        {view === "list" && (
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-green text-white rounded-lg font-medium hover:bg-green/90 transition-colors"
          >
            + New Collection
          </button>
        )}
      </div>

      {/* List View */}
      {view === "list" && (
        <div className="grid gap-4">
          {galleries && galleries.length > 0 ? (
            galleries.map((gallery: GalleryCollection) => (
              <div
                key={gallery._id}
                className="bg-white rounded-xl p-5 shadow-sm border border-border flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">
                      {gallery.title}
                    </h3>
                    {gallery.featured && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {gallery.description || "No description"}
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Category: {gallery.category}</span>
                    <span>{gallery.images.length} images</span>
                    <span>Created: {formatDate(gallery.created_at)}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(gallery)}
                    className="px-3 py-1.5 text-sm bg-navy text-white rounded hover:bg-navy/90 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(gallery._id)}
                    className="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No gallery collections yet. Create one to get started.
            </div>
          )}
        </div>
      )}

      {/* Create/Edit View */}
      {(view === "create" || view === "edit") && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-border max-w-2xl">
          <button
            onClick={() => {
              resetForm();
              setEditingId(null);
              setView("list");
            }}
            className="text-navy hover:text-navy/80 font-medium mb-4"
          >
            ← Back to List
          </button>

          <h2 className="text-xl font-semibold text-foreground mb-6">
            {view === "create" ? "Create New Collection" : "Edit Collection"}
          </h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
                placeholder="Collection title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
                rows={3}
                placeholder="Optional description"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-4 h-4 text-green border-border rounded focus:ring-green"
              />
              <label htmlFor="featured" className="text-sm text-foreground">
                Featured collection
              </label>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Images
              </label>

              {/* Image List */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.url}
                        alt={img.alt_text}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Image */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green"
                  placeholder="Image URL"
                />
                <input
                  type="text"
                  value={newImageAlt}
                  onChange={(e) => setNewImageAlt(e.target.value)}
                  className="w-32 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green"
                  placeholder="Alt text"
                />
                <button
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-muted/80 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={!formData.title.trim()}
                className="px-6 py-2 bg-green text-white rounded-lg font-medium hover:bg-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {view === "create" ? "Create Collection" : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setEditingId(null);
                  setView("list");
                }}
                className="px-6 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
