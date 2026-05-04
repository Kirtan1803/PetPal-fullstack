import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const notifRef = useRef(null);

  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const navItems = [
    { to: "/", label: "Home", end: true },
    { to: "/add-pet", label: "Give a Pet" },
    { to: "/my-adoptions", label: "My Adoptions" },
    { to: "/pets", label: "Pets" },
    ...(user?.isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  const closeMenus = () => {
    setMobileOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications/", { skipToast: true });
        if (isMounted) {
          setNotifications(Array.isArray(res.data) ? res.data : []);
        }
      } catch {
        // Notifications should never interrupt navigation.
      }
    };

    const initialFetch = window.setTimeout(fetchNotifications, 0);

    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => {
      isMounted = false;
      window.clearTimeout(initialFetch);
      clearInterval(interval);
    };
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read/`, {}, { skipToast: true });

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch {
      // Notifications should never interrupt navigation.
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const header = headerRef.current;
      if (!header) return;

      if (window.scrollY > 60) {
        header.classList.add("shrink");
      } else {
        header.classList.remove("shrink");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="tg-header custom-navbar" ref={headerRef}>
      <div className="tg-header__area">
        <div className="container-fluid">
          <div className="tgmenu__nav">
            <div className="logo">
              <Link to="/">
                <img src="/assets/img/logo/logo.png" alt="logo" />
              </Link>
            </div>

            <div className="tgmenu__navbar-wrap">
              <ul>
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) => (isActive ? "active" : "")}
                      onClick={closeMenus}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tgmenu__action">
              <ul className="list-wrap">
                <li className="nav-action-item position-relative" ref={notifRef}>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-label="Notifications"
                    aria-expanded={open}
                  >
                    <i className="fas fa-bell"></i>
                  </button>

                  {unreadCount > 0 && (
                    <span className="notif-badge">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}

                  <div className={`tg-notif-dropdown ${open ? "show" : ""}`}>
                    <div className="tg-notif-header">Notifications</div>

                    <div className="tg-notif-list">
                      {notifications.length === 0 ? (
                        <div className="tg-notif-empty">No notifications</div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`tg-notif-item ${
                              !n.is_read ? "unread" : ""
                            }`}
                            onClick={() => markAsRead(n.id)}
                          >
                            <div className="tg-notif-text">{n.message}</div>
                            <div className="tg-notif-time">
                              {new Date(n.created_at).toLocaleString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </li>

                <li className="nav-action-item">
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>

            <button
              className="mobile-nav-toggler"
              type="button"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <i className={`fas ${mobileOpen ? "fa-times" : "fa-bars"}`}></i>
            </button>
          </div>

          <nav className={`tg-mobile-nav ${mobileOpen ? "show" : ""}`}>
            <ul>
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    onClick={closeMenus}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
