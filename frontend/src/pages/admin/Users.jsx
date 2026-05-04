import { useEffect, useState } from "react";
import api from "../../services/api";
import { notify } from "../../utils/toast";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/admin/");
        if (isMounted) setUsers(res.data);
      } catch {
        // handled by interceptor
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleAdmin = async (id) => {
    try {
      await api.post(`/users/admin/toggle-admin/${id}/`);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, is_staff: !u.is_staff } : u
        )
      );

      notify.success("User role updated");
    } catch {
      // handled globally
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/users/admin/${id}/`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      notify.success("User deleted");
    } catch {
      // handled globally
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-section">
        <h5>Users</h5>

        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>

                    <td>
                      <span
                        className={`status ${
                          user.is_staff ? "approved" : "pending"
                        }`}
                      >
                        {user.is_staff ? "Admin" : "User"}
                      </span>
                    </td>

                    <td className="action-cell">
                      <button
                        className="btn-edit me-2"
                        onClick={() => handleToggleAdmin(user.id)}
                      >
                        {user.is_staff ? "Remove Admin" : "Make Admin"}
                      </button>

                      <button
                        className="btn-reject"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;