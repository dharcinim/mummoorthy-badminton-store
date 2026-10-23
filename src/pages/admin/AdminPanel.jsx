import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [role, setRole] = useState(null);
  const [stats, setStats] = useState({ products: 0, orders: 0, bookings: 0, users: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get role
        const adminDoc = await getDoc(doc(db, "admins", user.email));
        if (adminDoc.exists()) setRole(adminDoc.data().role);

        // Get counts
        const [products, orders, bookings, users] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(collection(db, "orders")),
          getDocs(collection(db, "bookings")),
          getDocs(collection(db, "users")),
        ]);

        setStats({
          products: products.size,
          orders: orders.size,
          bookings: bookings.size,
          users: users.size,
        });

        // Recent orders
        const recentOrdersSnap = await getDocs(
          query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5))
        );
        setRecentOrders(recentOrdersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        // Recent bookings
        const recentBookingsSnap = await getDocs(
          query(collection(db, "bookings"), orderBy("createdAt", "desc"), limit(5))
        );
        setRecentBookings(recentBookingsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const statCards = [
    { label: "Total Products", value: stats.products,  color: "#00FF9C", route: "/admin/products" },
    { label: "Total Orders", value: stats.orders,  color: "#0066FF", route: "/admin/orders" },
    { label: "Total Bookings", value: stats.bookings,color: "#FF9800", route: "/admin/bookings" },
    { label: "Total Users", value: stats.users,  color: "#9C27B0", route: "/admin/users" },
  ];

  const menuItems = [
    {  label: "Dashboard", route: "/admin" },
    { label: "Products", route: "/admin/products" },
    {  label: "Orders", route: "/admin/orders" },
    {  label: "Bookings", route: "/admin/bookings" },
    {  label: "Users", route: "/admin/users" },
    ...(role === "superadmin" ? [{ icon: "📊", label: "Activity Log", route: "/admin/activity" }] : []),
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      Loading dashboard...
    </div>
  );

  return (
    <div style={s.shell}>

      {/* SIDEBAR */}
      <div style={s.sidebar}>
        {/* Brand */}
        <div style={s.sidebarBrand}>
          <span style={s.brandIcon}>M</span>
          <div>
            <div style={s.brandName}>Mummoorthy</div>
            <div style={s.brandSub}>Admin Panel</div>
          </div>
        </div>

        {/* Admin info */}
        <div style={s.adminInfo}>
          <div style={s.adminAvatar}>{user?.name?.[0]?.toUpperCase() || "A"}</div>
          <div>
            <div style={s.adminName}>{user?.name || user?.email}</div>
            <div style={{ ...s.adminRole, color: role === "superadmin" ? "#00FF9C" : "#FF9800" }}>
              {role === "superadmin" ? " Super Admin" : "🔧 Admin"}
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav style={s.nav}>
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.route)}
              style={{
                ...s.navItem,
                background: item.route === "/admin" ? "rgba(0,255,156,0.1)" : "transparent",
                color: item.route === "/admin" ? "#00FF9C" : "#888",
                borderLeft: item.route === "/admin" ? "3px solid #00FF9C" : "3px solid transparent",
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button onClick={handleLogout} style={s.logoutBtn}>
           Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={s.main}>

        {/* Top bar */}
        <div style={s.topBar}>
          <div>
            <h1 style={s.pageTitle}>Dashboard</h1>
            <p style={s.pageSubtitle}>Welcome back, {user?.name?.split(" ")[0] || "Admin"}! </p>
          </div>
          <div style={s.topBarRight}>
            <div style={s.dateBadge}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={s.statsGrid}>
          {statCards.map((card, i) => (
            <div
              key={i}
              onClick={() => navigate(card.route)}
              style={{ ...s.statCard, cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = card.color}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1e1e1e"}
            >
              <div style={{ ...s.statIcon, background: card.color + "15" }}>
                {card.icon}
              </div>
              <div style={{ ...s.statValue, color: card.color }}>{card.value}</div>
              <div style={s.statLabel}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div style={s.twoCol}>

          {/* Recent Orders */}
          <div style={s.tableCard}>
            <div style={s.tableHeader}>
              <h3 style={s.tableTitle}> Recent Orders</h3>
              <button onClick={() => navigate("/admin/orders")} style={s.viewAllBtn}>View All →</button>
            </div>
            {recentOrders.length === 0 ? (
              <p style={s.emptyMsg}>No orders yet</p>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    {["Order ID", "Customer", "Total", "Status"].map((h) => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} style={s.tr}>
                      <td style={s.td}>#{order.id.slice(0, 6).toUpperCase()}</td>
                      <td style={s.td}>{order.userName}</td>
                      <td style={s.td}>₹{order.total?.toLocaleString()}</td>
                      <td style={s.td}>
                        <span style={{ ...s.statusBadge, ...getStatusStyle(order.status) }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Recent Bookings */}
          <div style={s.tableCard}>
            <div style={s.tableHeader}>
              <h3 style={s.tableTitle}> Recent Bookings</h3>
              <button onClick={() => navigate("/admin/bookings")} style={s.viewAllBtn}>View All →</button>
            </div>
            {recentBookings.length === 0 ? (
              <p style={s.emptyMsg}>No bookings yet</p>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    {["Name", "Type", "Date", "Status"].map((h) => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} style={s.tr}>
                      <td style={s.td}>{booking.name}</td>
                      <td style={{ ...s.td, textTransform: "capitalize" }}>{booking.type}</td>
                      <td style={s.td}>{booking.date}</td>
                      <td style={s.td}>
                        <span style={{ ...s.statusBadge, ...getStatusStyle(booking.status) }}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>

        {/* Quick Actions */}
        <div style={s.quickActions}>
          <h3 style={s.tableTitle}> Quick Actions</h3>
          <div style={s.actionGrid}>
            {[
              { label: "Add Product", icon: "+", route: "/admin/products", color: "#00FF9C" },
              { label: "View Orders", icon: "◻", route: "/admin/orders", color: "#0066FF" },
              { label: "View Bookings", icon: "◷", route: "/admin/bookings", color: "#FF9800" },
              { label: "View Users", icon: "◉",  route: "/admin/users", color: "#9C27B0" },
              ...(role === "superadmin" ? [{ label: "Activity Log", icon: "📊", route: "/admin/activity", color: "#F44336" }] : []),
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.route)}
                style={{ ...s.actionBtn, borderColor: action.color + "44" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = action.color + "15";
                  e.currentTarget.style.borderColor = action.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#111";
                  e.currentTarget.style.borderColor = action.color + "44";
                }}
              >
                <span style={{ fontSize: "24px" }}>{action.icon}</span>
                <span style={{ fontSize: "13px", color: "#ccc", fontWeight: "600" }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const getStatusStyle = (status) => {
  switch (status) {
    case "Delivered": return { background: "#0d2b0d", color: "#00FF9C" };
    case "Shipped": return { background: "#0a1628", color: "#0066FF" };
    case "Pending": return { background: "#2b1a0d", color: "#FF9800" };
    case "Cancelled": return { background: "#2b0d0d", color: "#F44336" };
    default: return { background: "#1a1a1a", color: "#888" };
  }
};

const s = {
  shell: { display: "flex", minHeight: "100vh", background: "#0a0a0a", fontFamily: "Inter, sans-serif" },

  // Sidebar
  sidebar: { width: "240px", background: "#111", borderRight: "1px solid #1e1e1e", display: "flex", flexDirection: "column", padding: "24px 0", position: "sticky", top: 0, height: "100vh", flexShrink: 0 },
  sidebarBrand: { display: "flex", alignItems: "center", gap: "10px", padding: "0 20px 24px", borderBottom: "1px solid #1e1e1e", marginBottom: "20px" },
  brandIcon: { fontSize: "20px", fontWeight: "900", color: "#00FF9C", width: "32px", height: "32px", borderRadius: "8px", background: "rgba(0,255,156,0.1)", display: "flex", alignItems: "center", justifyContent: "center" },
  brandName: { fontSize: "15px", fontWeight: "800", color: "#fff" },
  brandSub: { fontSize: "10px", color: "#00FF9C", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" },
  adminInfo: { display: "flex", alignItems: "center", gap: "10px", padding: "0 20px 20px", borderBottom: "1px solid #1e1e1e", marginBottom: "16px" },
  adminAvatar: { width: "36px", height: "36px", borderRadius: "50%", background: "#00FF9C", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "16px", flexShrink: 0 },
  adminName: { fontSize: "13px", fontWeight: "600", color: "#fff", marginBottom: "2px" },
  adminRole: { fontSize: "11px", fontWeight: "600" },
  nav: { flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: "4px" },
  navItem: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "500", fontFamily: "Inter, sans-serif", transition: "all 0.2s", textAlign: "left", width: "100%" },
  logoutBtn: { margin: "16px 12px 0", padding: "10px", background: "rgba(244,67,54,0.1)", border: "1px solid rgba(244,67,54,0.2)", borderRadius: "10px", color: "#F44336", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" },

  // Main
  main: { flex: 1, padding: "32px", overflowY: "auto" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" },
  pageTitle: { fontSize: "28px", fontWeight: "800", color: "#fff", margin: "0 0 4px" },
  pageSubtitle: { fontSize: "14px", color: "#666", margin: 0 },
  topBarRight: { display: "flex", gap: "12px", alignItems: "center" },
  dateBadge: { fontSize: "12px", color: "#555", background: "#111", padding: "8px 14px", borderRadius: "8px", border: "1px solid #1e1e1e" },

  // Stats
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" },
  statCard: { background: "#111", borderRadius: "16px", padding: "24px", border: "1px solid #1e1e1e", transition: "border-color 0.2s" },
  statIcon: { width: "44px", height: "44px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "14px" },
  statValue: { fontSize: "32px", fontWeight: "900", marginBottom: "4px" },
  statLabel: { fontSize: "13px", color: "#666", fontWeight: "500" },

  // Tables
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" },
  tableCard: { background: "#111", borderRadius: "16px", padding: "24px", border: "1px solid #1e1e1e" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  tableTitle: { fontSize: "16px", fontWeight: "700", color: "#fff", margin: 0 },
  viewAllBtn: { fontSize: "12px", color: "#00FF9C", background: "none", border: "none", cursor: "pointer", fontWeight: "600", fontFamily: "Inter, sans-serif" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { fontSize: "11px", color: "#555", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", padding: "8px 10px", textAlign: "left", borderBottom: "1px solid #1e1e1e" },
  tr: { borderBottom: "1px solid #141414" },
  td: { fontSize: "13px", color: "#ccc", padding: "10px 10px" },
  statusBadge: { fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px" },
  emptyMsg: { fontSize: "13px", color: "#444", textAlign: "center", padding: "20px 0" },

  // Quick Actions
  quickActions: { background: "#111", borderRadius: "16px", padding: "24px", border: "1px solid #1e1e1e" },
  actionGrid: { display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" },
  actionBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "16px 24px", background: "#111", border: "1px solid", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s", fontFamily: "Inter, sans-serif", minWidth: "100px" },
};
