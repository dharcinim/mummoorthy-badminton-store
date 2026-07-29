import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../../firebase";

const getActionStyle = (action) => {
  if (action?.includes("Order"))   return { color: "#0066FF", bg: "#0a1628", icon: "📦" };
  if (action?.includes("Booking")) return { color: "#FF9800", bg: "#2b1a0d", icon: "📅" };
  if (action?.includes("Product")) return { color: "#00FF9C", bg: "#0d2b0d", icon: "🏸" };
  if (action?.includes("User"))    return { color: "#9C27B0", bg: "#1a0d2b", icon: "👥" };
  if (action?.includes("Login"))   return { color: "#00BCD4", bg: "#0a1a1a", icon: "🔐" };
  return { color: "#888", bg: "#1a1a1a", icon: "📋" };
};

export default function ActivityLog() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAdmin, setFilterAdmin] = useState("All");
  const [filterType, setFilterType] = useState("All");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersSnap, bookingsSnap, usersSnap] = await Promise.all([
        getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(50))),
        getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc"), limit(50))),
        getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"), limit(50))),
      ]);

      const ordersData = ordersSnap.docs.map((d) => ({
        id: d.id,
        action: "Order Placed",
        detail: `${d.data().userName} placed an order of ₹${d.data().total?.toLocaleString()}`,
        by: d.data().userEmail,
        time: d.data().createdAt,
        type: "Order",
      }));

      const bookingsData = bookingsSnap.docs.map((d) => ({
        id: d.id,
        action: `Booking — ${d.data().type}`,
        detail: `${d.data().name} booked ${d.data().type} for ${d.data().date}`,
        by: d.data().phone,
        time: d.data().createdAt,
        type: "Booking",
      }));

      const usersData = usersSnap.docs.map((d) => ({
        id: d.id,
        action: "User Registered",
        detail: `${d.data().name} created an account`,
        by: d.data().email,
        time: d.data().createdAt,
        type: "User",
      }));

      // Merge and sort by time
      const allLogs = [...ordersData, ...bookingsData, ...usersData].sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );

      setLogs(allLogs);
      setOrders(ordersData);
      setBookings(bookingsData);
      setUsers(usersData);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const filtered = logs.filter((log) => {
    const matchType = filterType === "All" || log.type === filterType;
    return matchType;
  });

  const formatTime = (time) => {
    if (!time) return "—";
    const date = new Date(time);
    return date.toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const timeAgo = (time) => {
    if (!time) return "";
    const diff = (Date.now() - new Date(time)) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div style={s.shell}>

      {/* SIDEBAR */}
      <div style={s.sidebar}>
        <div style={s.sidebarBrand}>
          <span style={{ fontSize: "28px" }}>🏸</span>
          <div>
            <div style={s.brandName}>Mummoorthy</div>
            <div style={s.brandSub}>Admin Panel</div>
          </div>
        </div>
        <nav style={s.nav}>
          {[
            { icon: "🏠", label: "Dashboard", route: "/admin" },
            { icon: "🏸", label: "Products", route: "/admin/products" },
            { icon: "📦", label: "Orders", route: "/admin/orders" },
            { icon: "📅", label: "Bookings", route: "/admin/bookings" },
            { icon: "👥", label: "Users", route: "/admin/users" },
            { icon: "📊", label: "Activity Log", route: "/admin/activity" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.route)}
              style={{
                ...s.navItem,
                background: item.route === "/admin/activity" ? "rgba(0,255,156,0.1)" : "transparent",
                color: item.route === "/admin/activity" ? "#00FF9C" : "#888",
                borderLeft: item.route === "/admin/activity" ? "3px solid #00FF9C" : "3px solid transparent",
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        {/* Super Admin badge */}
        <div style={s.superBadge}>
          ⭐ Super Admin View
        </div>
      </div>

      {/* MAIN */}
      <div style={s.main}>

        {/* Top bar */}
        <div style={s.topBar}>
          <div>
            <h1 style={s.pageTitle}>📊 Activity Log</h1>
            <p style={s.pageSub}>Complete store activity — orders, bookings, registrations</p>
          </div>
          <button onClick={fetchData} style={s.refreshBtn}>🔄 Refresh</button>
        </div>

        {/* Summary cards */}
        <div style={s.statsRow}>
          {[
            { label: "Total Activities", value: logs.length, color: "#fff", icon: "📋" },
            { label: "Orders", value: orders.length, color: "#0066FF", icon: "📦" },
            { label: "Bookings", value: bookings.length, color: "#FF9800", icon: "📅" },
            { label: "New Users", value: users.length, color: "#9C27B0", icon: "👥" },
          ].map((stat, i) => (
            <div key={i} style={s.statCard}>
              <div style={{ ...s.statIcon, background: stat.color + "15" }}>{stat.icon}</div>
              <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={s.filterRow}>
          {["All", "Order", "Booking", "User"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                ...s.filterBtn,
                background: filterType === type ? "#00FF9C" : "#111",
                color: filterType === type ? "#000" : "#888",
                border: filterType === type ? "1px solid #00FF9C" : "1px solid #1e1e1e",
              }}
            >
              {type === "All" ? "📋 All" : type === "Order" ? "📦 Orders" : type === "Booking" ? "📅 Bookings" : "👥 Users"}
            </button>
          ))}
          <span style={{ marginLeft: "auto", fontSize: "13px", color: "#555", alignSelf: "center" }}>
            {filtered.length} activities
          </span>
        </div>

        {/* Activity Feed */}
        <div style={s.feedCard}>
          {loading ? (
            <p style={s.emptyMsg}>Loading activity...</p>
          ) : filtered.length === 0 ? (
            <p style={s.emptyMsg}>No activity found</p>
          ) : (
            <div style={s.feed}>
              {filtered.map((log, i) => {
                const as = getActionStyle(log.action);
                return (
                  <div key={log.id + i} style={s.logItem}>

                    {/* Icon */}
                    <div style={{ ...s.logIcon, background: as.bg, color: as.color }}>
                      {as.icon}
                    </div>

                    {/* Line */}
                    {i < filtered.length - 1 && <div style={s.logLine} />}

                    {/* Content */}
                    <div style={s.logContent}>
                      <div style={s.logHeader}>
                        <span style={{ ...s.logAction, color: as.color }}>{log.action}</span>
                        <span style={s.logTime}>{timeAgo(log.time)}</span>
                      </div>
                      <p style={s.logDetail}>{log.detail}</p>
                      <div style={s.logMeta}>
                        <span style={s.logBy}>{log.by}</span>
                        <span style={s.logDate}>{formatTime(log.time)}</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const s = {
  shell: { display: "flex", minHeight: "100vh", background: "#0a0a0a", fontFamily: "Inter, sans-serif" },
  sidebar: { width: "240px", background: "#111", borderRight: "1px solid #1e1e1e", display: "flex", flexDirection: "column", padding: "24px 0", position: "sticky", top: 0, height: "100vh", flexShrink: 0 },
  sidebarBrand: { display: "flex", alignItems: "center", gap: "10px", padding: "0 20px 24px", borderBottom: "1px solid #1e1e1e", marginBottom: "20px" },
  brandName: { fontSize: "15px", fontWeight: "800", color: "#fff" },
  brandSub: { fontSize: "10px", color: "#00FF9C", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" },
  nav: { flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: "4px" },
  navItem: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "500", fontFamily: "Inter, sans-serif", transition: "all 0.2s", textAlign: "left", width: "100%" },
  superBadge: { margin: "16px 12px 0", padding: "10px", background: "rgba(0,255,156,0.08)", border: "1px solid rgba(0,255,156,0.2)", borderRadius: "10px", color: "#00FF9C", fontSize: "12px", fontWeight: "700", textAlign: "center" },
  main: { flex: 1, padding: "32px", overflowY: "auto" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  pageTitle: { fontSize: "26px", fontWeight: "800", color: "#fff", margin: "0 0 4px" },
  pageSub: { fontSize: "13px", color: "#666", margin: 0 },
  refreshBtn: { padding: "10px 20px", background: "#111", border: "1px solid #1e1e1e", borderRadius: "10px", color: "#ccc", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" },
  statCard: { background: "#111", borderRadius: "14px", padding: "20px", border: "1px solid #1e1e1e" },
  statIcon: { width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "12px" },
  statValue: { fontSize: "28px", fontWeight: "900", marginBottom: "4px" },
  statLabel: { fontSize: "12px", color: "#666" },
  filterRow: { display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" },
  filterBtn: { padding: "8px 18px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.2s" },
  feedCard: { background: "#111", borderRadius: "16px", padding: "24px", border: "1px solid #1e1e1e" },
  feed: { display: "flex", flexDirection: "column" },
  logItem: { display: "flex", gap: "16px", position: "relative", paddingBottom: "24px" },
  logIcon: { width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0, zIndex: 1 },
  logLine: { position: "absolute", left: "19px", top: "44px", bottom: 0, width: "2px", background: "#1e1e1e" },
  logContent: { flex: 1, paddingTop: "8px" },
  logHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" },
  logAction: { fontSize: "14px", fontWeight: "700" },
  logTime: { fontSize: "11px", color: "#444" },
  logDetail: { fontSize: "13px", color: "#ccc", margin: "0 0 6px", lineHeight: 1.5 },
  logMeta: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  logBy: { fontSize: "11px", color: "#555", background: "#1a1a1a", padding: "2px 8px", borderRadius: "6px" },
  logDate: { fontSize: "11px", color: "#444" },
  emptyMsg: { fontSize: "14px", color: "#444", textAlign: "center", padding: "40px 0" },
};
