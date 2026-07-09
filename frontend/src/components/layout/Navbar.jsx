import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const roleMenus = {
    superadmin: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Incoming Register", path: "/incoming-register" },
      { name: "Outgoing Register", path: "/outgoing-register" },
      { name: "Verify / Reject", path: "/verify-reject" },
      { name: "Manage Users", path: "/manage-users" },
      { name: "Announcements", path: "/announcements" },
      { name: "Quick Links", path: "/quick-links" },
    ],
    manager: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Incoming Register", path: "/incoming-register" },
      { name: "Outgoing Register", path: "/outgoing-register" },
      { name: "Verify / Reject", path: "/verify-reject" },
      { name: "Quick Links", path: "/quick-links" },
    ],
    security: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Record Incoming", path: "/record-incoming" },
      { name: "Record Outgoing", path: "/record-outgoing" },
      { name: "My Records", path: "/my-records" },
      { name: "Quick Links", path: "/quick-links" },
    ],
  };

  const menus = roleMenus[user?.role] || [];

  const handleLogout = () => {
    localStorage.removeItem("ctps_user");
    localStorage.removeItem("ctps_token");
    navigate("/");
  };

  return (
    /* nav-bar: exact from reference */
    <nav style={{
      background: "#003087",
      padding: "0 20px",
      display: "flex",
      alignItems: "stretch",
      borderBottom: "3px solid #cc3300",
      position: "sticky",
      top: 0,
      zIndex: 100,
      overflow: "hidden",
    }}>
      {/* Brand label */}
      <div style={{
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
        padding: "0 14px 0 0",
        borderRight: "1px solid rgba(255,255,255,0.2)",
        marginRight: "6px",
        display: "flex",
        alignItems: "center",
        whiteSpace: "nowrap",
      }}>
        Material Register
      </div>

      {/* Home button — replace the URL below with your actual link */}
      <a
        href="https://YOUR_WEBSITE_URL_HERE"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "rgba(255,255,255,0.85)",
          fontSize: "12px",
          fontWeight: 500,
          padding: "0 13px",
          display: "flex",
          alignItems: "center",
          alignSelf: "stretch",
          whiteSpace: "nowrap",
          textDecoration: "none",
          borderRight: "1px solid rgba(255,255,255,0.2)",
          marginRight: "6px",
          borderBottom: "3px solid transparent",
          transition: "all 0.15s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = "rgba(255,255,255,0.85)";
          e.currentTarget.style.background = "none";
        }}
      >
        Home
      </a>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "stretch", flex: 1, overflowX: "hidden" }}>
        {menus.map((menu) => {
          const isActive = location.pathname === menu.path;
          return (
            <button
              key={menu.path}
              onClick={() => navigate(menu.path)}
              style={{
                color: isActive ? "#fff" : "rgba(255,255,255,0.85)",
                fontSize: "12px",
                fontWeight: 500,
                padding: "0 13px",
                cursor: "pointer",
                border: "none",
                background: isActive ? "rgba(255,255,255,0.1)" : "none",
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                borderBottom: isActive ? "3px solid #cc3300" : "3px solid transparent",
                marginBottom: "-3px",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                  e.currentTarget.style.background = "none";
                }
              }}
            >
              {menu.name}
            </button>
          );
        })}
      </div>

      {/* Right: user info + logout */}
      <div style={{
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        paddingLeft: "12px",
        borderLeft: "1px solid rgba(255,255,255,0.2)",
      }}>
        <div style={{
          color: "rgba(255,255,255,0.85)",
          fontSize: "11px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}>
          <span style={{ fontWeight: 600, color: "#fff", textTransform: "capitalize" }}>{user?.fullName}</span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px", textTransform: "uppercase" }}>{user?.role}</span>
          <span style={{ color: "#ffd700", fontSize: "10px" }}>{user?.gate}</span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "5px 12px",
            background: "#cc3300",
            color: "#fff",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: 600,
            transition: "background 0.15s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#a82800"}
          onMouseLeave={e => e.currentTarget.style.background = "#cc3300"}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;