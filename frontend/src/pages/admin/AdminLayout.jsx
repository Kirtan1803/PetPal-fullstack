import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { notify } from "../../utils/toast";

function AdminLayout() {
  const { user } = useAuth();

  useEffect(() => {
    if (user && !user.isAdmin) {
      notify.error("Access denied");
    }
  }, [user]);

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <h4 className="mb-4">Admin</h4>

        <NavLink to="/admin" end>
          Dashboard
        </NavLink>
        <NavLink to="/admin/pet-requests">
          Pet Requests
        </NavLink>
        <NavLink to="/admin/adoptions">
          Adoption Requests
        </NavLink>
        <NavLink to="/admin/categories">
          Categories
        </NavLink>
        <NavLink to="/admin/users">
          Users
        </NavLink>
      </aside>

      {/* CONTENT */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
