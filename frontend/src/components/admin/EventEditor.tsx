import React, { useState } from "react";

interface EventEditorProps {
  onSave: (data: EventFormData, status: "draft" | "published") => void;
  onDelete?: () => void;
  initialData?: EventFormData;
  isEditing?: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  location: string;
}

const DESCRIPTION_WORD_LIMIT = 10;

const EventEditor: React.FC<EventEditorProps> = ({
  onSave,
  onDelete,
  initialData,
  isEditing = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [startTime, setStartTime] = useState(initialData?.startTime || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleDescriptionChange = (value: string) => {
    const words = value.trim().split(/\s+/);
    if (words.filter(Boolean).length <= DESCRIPTION_WORD_LIMIT) {
      setDescription(value);
    }
  };

  const handleSubmit = async (status: "draft" | "published") => {
    setIsSaving(true);
    try {
      await onSave(
        {
          title,
          description,
          startDate,
          startTime,
          location,
        },
        status,
      );
    } finally {
      setIsSaving(false);
    }
  };

  React.useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+C
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "C")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 md:p-6 bg-background">
      {/* Main Editor */}
      <div className="flex-1 bg-white rounded-lg shadow-sm p-4 md:p-6 overflow-y-auto">
        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Event Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Description (max {DESCRIPTION_WORD_LIMIT} words)
          </label>
          <textarea
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Enter event description"
            rows={6}
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {description.trim() === ""
              ? 0
              : description.trim().split(/\s+/).filter(Boolean).length}{" "}
            / {DESCRIPTION_WORD_LIMIT} words
          </p>
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green appearance-none cursor-pointer uppercase text-base"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Start Time
            </label>
            <div className="relative">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green appearance-none cursor-pointer uppercase text-base"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter event location"
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green"
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[280px] flex flex-col gap-3">
        {/* Event Details Summary */}
        <div className="bg-white rounded-lg shadow-sm p-3 space-y-2">
          <h3 className="font-semibold text-foreground text-sm">
            Event Details
          </h3>

          {title && (
            <div>
              <p className="text-xs text-muted-foreground">Title</p>
              <p className="text-sm font-medium text-foreground line-clamp-2">
                {title}
              </p>
            </div>
          )}

          {startDate && (
            <div>
              <p className="text-xs text-muted-foreground">Start Date/Time</p>
              <p className="text-sm font-medium text-foreground">
                {startDate.split("-").reverse().join("/")}
                {startTime && ` AT ${startTime}`}
              </p>
            </div>
          )}

          {location && (
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium text-foreground">{location}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 bg-white p-3 rounded-lg shadow-sm">
          <button
            onClick={() => handleSubmit("draft")}
            disabled={isSaving}
            className="flex-1 px-3 py-2 bg-[#4a4a4a] text-white text-sm font-medium rounded-md hover:bg-[#3a3a3a] transition-colors disabled:opacity-50"
          >
            {isEditing ? "Update" : "Save"}
          </button>
          <button
            onClick={() => handleSubmit("published")}
            disabled={isSaving}
            className="flex-1 px-3 py-2 bg-green text-white text-sm font-medium rounded-md hover:bg-green-dark transition-colors disabled:opacity-50"
          >
            {isEditing ? "Update & Publish" : "Publish"}
          </button>
          {isEditing && onDelete && (
            <button
              onClick={onDelete}
              disabled={isSaving}
              className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              title="Delete this event"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventEditor;
