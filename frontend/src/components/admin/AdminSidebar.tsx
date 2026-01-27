import React from "react";

type DashboardTab = "overview" | "blogs" | "events" | "users";

interface AdminSidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  isOpen = false,
  onClose,
}) => {
  const tabs: { id: DashboardTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "blogs", label: "Blogs" },
    { id: "events", label: "Events" },
    { id: "users", label: "Users" },
  ];
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy flex flex-col shadow-lg transition-transform duration-300 md:static md:z-auto md:w-[220px] md:h-full md:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10">
        <div className="text-white font-semibold">Admin</div>
        <button
          onClick={() => onClose?.()}
          className="text-white/80 hover:text-white"
          aria-label="Close navigation"
        >
          ✕
        </button>
      </div>
      {/* Navigation */}
      <nav className="flex flex-col gap-3 p-6 pt-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-5 py-3 text-left text-base font-medium rounded-lg transition-all
              ${
                activeTab === tab.id
                  ? "bg-green text-white"
                  : "bg-muted/20 text-white/80 hover:bg-muted/30"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Logout */}
      <div className="p-6">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 w-full text-sm text-left text-white/90 bg-navy-dark/50 rounded-lg hover:bg-navy-dark transition-colors"
        >
          Log Out
          <span className="ml-auto text-sm">→</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
