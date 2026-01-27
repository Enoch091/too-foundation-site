import React from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: number;
}

interface UserManagerProps {
  users: User[] | undefined;
  onPromote: (userId: string) => void;
  onDemote: (userId: string) => void;
  currentUserEmail: string;
}

const UserManager: React.FC<UserManagerProps> = ({
  users,
  onPromote,
  onDemote,
  currentUserEmail,
}) => {
  if (!users) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-muted-foreground text-center">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Desktop table view - hidden on mobile */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-muted/20">
                  <td className="px-6 py-4 text-sm text-foreground">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`
                      inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                      ${
                        user.role === "admin"
                          ? "bg-green/10 text-green"
                          : "bg-muted text-muted-foreground"
                      }
                    `}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {user.email !== currentUserEmail &&
                      (user.role === "user" ? (
                        <button
                          onClick={() => onPromote(user._id)}
                          className="px-4 py-2 text-xs font-medium text-white bg-green rounded-md hover:bg-green-dark transition-colors"
                        >
                          Promote
                        </button>
                      ) : (
                        <button
                          onClick={() => onDemote(user._id)}
                          className="px-4 py-2 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                        >
                          Demote
                        </button>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card view - visible only on mobile */}
        <div className="md:hidden divide-y divide-border">
          {users.map((user) => (
            <div key={user._id} className="p-4 hover:bg-muted/20">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {user.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {user.email}
                    </p>
                  </div>
                  <span
                    className={`
                    ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap
                    ${
                      user.role === "admin"
                        ? "bg-green/10 text-green"
                        : "bg-muted text-muted-foreground"
                    }
                  `}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </span>

                  {user.email !== currentUserEmail &&
                    (user.role === "user" ? (
                      <button
                        onClick={() => onPromote(user._id)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-green rounded-md hover:bg-green-dark transition-colors"
                      >
                        Promote
                      </button>
                    ) : (
                      <button
                        onClick={() => onDemote(user._id)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                      >
                        Demote
                      </button>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;
