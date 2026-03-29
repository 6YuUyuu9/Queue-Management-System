import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useAuth } from "../context/useAuth";
import { Colors } from "../constant/colors";
import AdminHome from "../pages/admin/AdminHome";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageQueue from "../pages/admin/ManageQueue";
import ManageTable from "../pages/admin/ManageTable";
import AdminRoute from "./AdminRoute";

const COLLAPSED_WIDTH = "64px";
const EXPANDED_WIDTH  = "220px";

const NAV_ITEMS = [
  {
  to: "/admin",
  end: true,
  icon: <img src="/src/components/icon/house-door-fill.svg" width="20" />,
  label: "หน้าหลัก"
},
  { to: "/admin/dashboard", 
    end: false, 
    icon: <img src="/src/components/icon/bar-chart-line-fill.svg" width="20" />, 
    label: "จัดการคิว"  },
  { to: "/admin/managetable",  
    end: false, 
    icon: <img src="/src/components/icon/pencil-square.svg" width="20" />, 
    label: "จัดการโต๊ะ"   },
  { to: "/admin/managequeue",  
    end: false, 
    icon: <img src="/src/components/icon/house-door-fill.svg" width="20" />, 
    label: "จัดการคิว(Walk-in)"   },
];

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // collapsed = true เมื่อจอเล็ก
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  const handleLogout = () => { logout(); navigate("/signin"); };

  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: collapsed ? "center" : "flex-start",
    gap: collapsed ? 0 : "10px",
    padding: collapsed ? "12px 0" : "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: isActive ? "600" : "400",
    color: isActive ? Colors.blue : "#555",
    backgroundColor: isActive ? Colors.yellow + "44" : "transparent",
    borderLeft: isActive ? `3px solid ${Colors.yellow}` : "3px solid transparent",
    transition: "all 0.2s",
    overflow: "hidden",
    whiteSpace: "nowrap",
    position: "relative",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* ===== Sidebar ===== */}
      <div
        style={{
          width: sidebarWidth,
          minHeight: "100vh",
          position: "fixed",
          top: 0, left: 0,
          zIndex: 200,
          backgroundColor: "#ffff",
          borderRight: `3px solid ${Colors.yellow}`,
          boxShadow: "2px 0 8px rgba(0,0,0,0.07)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.25s ease",
          overflow: "hidden",
        }}
      >
        {/* Logo + Toggle button */}
        <div
          style={{
            backgroundColor: Colors.blue,
            borderBottom: `3px solid ${Colors.yellow}`,
            padding: "14px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            paddingLeft: collapsed ? 0 : "16px",
            paddingRight: collapsed ? 0 : "10px",
            flexShrink: 0,
          }}
        >
          <div style={{ color: Colors.yellow, fontWeight: "700", fontSize: "16px" }}>QQ</div>

          {!collapsed && (
            <div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "10px" }}>Admin Panel</div>
            </div>
          )}
          {collapsed && (
            <div style={{ color: Colors.yellow, fontWeight: "700", fontSize: "18px" }}></div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? "ขยาย" : "ย่อ"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: Colors.yellow,
              fontSize: "30px",
              lineHeight: 1,
              padding: collapsed ? "0" : "0 4px",
              position: collapsed ? "absolute" : "static",
              right: collapsed ? "-999px" : "auto", // hidden when collapsed — toggle via icon bar
            }}
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {/* Toggle btn เมื่อ collapsed — ลอยกลาง logo */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: Colors.blue, fontSize: "20px", padding: "6px 0",
              alignSelf: "center",
            }}
            title="ขยาย sidebar"
          >
            <img src="/src/components/icon/caret-right-fill.svg" width="20" />
          </button>
        )}

        {/* Collapse btn เมื่อ expanded */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#aaa", fontSize: "13px", padding: "4px 16px",
              textAlign: "right", alignSelf: "flex-end",
            }}
            title="ย่อ sidebar"
          >
            <img src="/src/components/icon/caret-left-fill.svg" width="15" />
          </button>
        )}

        {/* User info — ซ่อนตอน collapsed */}
        {user && !collapsed && (
          <div style={{ padding: "10px 14px 10px", borderBottom: `1px solid ${Colors.yellow}33`, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                backgroundColor: Colors.yellow, color: Colors.blue,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: "700", fontSize: "14px", flexShrink: 0,
              }}>
                {user.username?.[0]?.toUpperCase()}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: "13px", fontWeight: "600", color: Colors.blue, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.username}
                </div>
                <div style={{ fontSize: "11px", color: "#aaa" }}>Administrator</div>
              </div>
            </div>
          </div>
        )}

        {/* Avatar เล็กตอน collapsed */}
        {user && collapsed && (
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px", flexShrink: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              backgroundColor: Colors.yellow, color: Colors.blue,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: "700", fontSize: "14px",
            }}>
              {user.username?.[0]?.toUpperCase()}
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "8px", paddingTop: "12px", overflowY: "auto" }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
            {NAV_ITEMS.map(item => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} style={linkStyle} title={collapsed ? item.label : ""}>
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 8px", borderTop: `1px solid ${Colors.yellow}33`, flexShrink: 0 }}>
          {collapsed ? (
            <button
              onClick={handleLogout}
              title="ออกจากระบบ"
              style={{
                width: "100%", background: "none", border: "none",
                cursor: "pointer", fontSize: "20px", padding: "6px 0",
                color: "#e55",
              }}
            >
              ⏻
            </button>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                width: "100%", fontSize: "13px", padding: "8px",
                borderRadius: "8px", border: `1.5px solid ${Colors.blue}`,
                backgroundColor: "transparent", color: Colors.blue,
                cursor: "pointer", fontWeight: "600", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = Colors.blue; e.currentTarget.style.color = Colors.yellow; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = Colors.blue; }}
            >
              ออกจากระบบ
            </button>
          )}
        </div>
      </div>

      {/* ===== Main content ===== */}
      <div style={{
        marginLeft: sidebarWidth,
        flex: 1,
        minHeight: "100vh",
        backgroundColor: Colors.lightGray,
        transition: "margin-left 0.25s ease",
      }}>
        <Routes>
          <Route path="/admin"           element={<AdminRoute><AdminHome /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/managequeue" element={<AdminRoute><ManageQueue /></AdminRoute>} />
          <Route path="/admin/managetable" element={<AdminRoute><ManageTable /></AdminRoute>} />
        </Routes>
      </div>

    </div>
  );
};

export default AdminNavbar;
