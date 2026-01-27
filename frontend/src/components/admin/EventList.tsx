import React, { useMemo, useState } from "react";

interface EventItem {
  _id: string;
  title: string;
  slug: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  start_date: number;
  end_date?: number;
  location: string;
  registrations: number;
  updated_at: number;
}

interface EventListProps {
  events: EventItem[] | undefined;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onEdit, onDelete }) => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | EventItem["status"]>(
    "all",
  );

  const filtered = useMemo(() => {
    if (!events) return [];
    return events
      .filter((e) =>
        statusFilter === "all" ? true : e.status === statusFilter,
      )
      .filter((e) =>
        query
          ? e.title.toLowerCase().includes(query.toLowerCase()) ||
            e.slug.toLowerCase().includes(query.toLowerCase()) ||
            e.location.toLowerCase().includes(query.toLowerCase())
          : true,
      );
  }, [events, query, statusFilter]);

  if (!events) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-muted-foreground text-center">Loading events...</p>
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
              placeholder="Search by title, slug or location"
              className="border border-border rounded px-3 py-2 w-full sm:w-72"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-border rounded px-3 py-2 sm:w-48"
            >
              <option value="all">All statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="text-sm text-muted-foreground">
            {filtered.length} of {events.length} shown
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
                  Dates
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Registrations
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((e) => (
                <tr
                  key={e._id}
                  className="hover:bg-muted/20 cursor-pointer"
                  onClick={() => onEdit(e._id)}
                >
                  <td className="px-6 py-4 text-sm text-foreground">
                    {e.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(e.start_date).toLocaleString()} {"→"}{" "}
                    {e.end_date ? new Date(e.end_date).toLocaleString() : ""}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {e.location}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        e.status === "upcoming"
                          ? "bg-yellow-100 text-yellow-700"
                          : e.status === "ongoing"
                            ? "bg-blue-100 text-blue-700"
                            : e.status === "completed"
                              ? "bg-green/10 text-green"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {e.registrations}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => onEdit(e._id)}
                      className="px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(e._id)}
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
          {filtered.map((e) => (
            <div key={e._id} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-base font-semibold text-foreground break-words">
                    {e.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{e.location}</p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    e.status === "upcoming"
                      ? "bg-yellow-100 text-yellow-700"
                      : e.status === "ongoing"
                        ? "bg-blue-100 text-blue-700"
                        : e.status === "completed"
                          ? "bg-green/10 text-green"
                          : "bg-muted text-muted-foreground"
                  }`}
                >
                  {e.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(e.start_date).toLocaleString()} {"→"}{" "}
                {e.end_date ? new Date(e.end_date).toLocaleString() : ""}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Registrations: {e.registrations}</span>
                <button
                  onClick={() => onEdit(e._id)}
                  className="text-blue-600 font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onDelete(e._id)}
                  className="px-3 py-2 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No events found.
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
