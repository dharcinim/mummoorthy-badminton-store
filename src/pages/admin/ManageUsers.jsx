import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";

export default function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersSnap, ordersSnap] = await Promise.all([
        getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"))),
        getDocs(collection(db, "orders")),
      ]);
      setUsers(usersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setOrders(ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const getUserOrders = (email) => orders.filter((o) => o.userEmail === email);

  const getUserTotalSpend = (email) =>
    getUserOrders(email)
      .filter((o) => o.status !== "Cancelled")
      .reduce((s, o) => s + (o.total || 0), 0);

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

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
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.route)}
              style={{
                ...s.navItem,
                background: item.route === "/admin/users" ? "rgba(0,255,156,0.1)" : "transparent",
                color: item.route === "/admin/users" ? "#00FF9C" : "#888",
                borderLeft: item.route === "/admin/users" ? "3px solid #00FF9C" : "3px solid transparent",
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN */}
      <div style={s.main}>

        {/* Top bar */}
        <div style={s.topBar}>
          <div>
            <h1 style={s.pageTitle}>👥 Manage Users</h1>
            <p style={s.pageSub}>{users.length} registered users</p>
          </div>
          <button onClick={fetchData} style={s.refreshBtn}>🔄 Refresh</button>
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          {[
            { label: "Total Users", value: users.length, color: "#00FF9C", icon: "👥" },
            { label: "Total Orders", value: orders.length, color: "#0066FF", icon: "📦" },
            {
              label: "Total Revenue",
              value: `₹${orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + (o.total || 0), 0).toLocaleString()}`,
              color: "#FF9800",
              icon: "💰"
            },
            {
              label: "Avg. Order Value",
              value: orders.length > 0
                ? `₹${Math.round(orders.reduce((s, o) => s + (o.total || 0), 0) / orders.length).toLocaleString()}`
                : "₹0",
              color: "#9C27B0",
              icon: "📊"
            },
          ].map((stat, i) => (
            <div key={i} style={s.statCard}>
              <div style={{ ...s.statIcon, background: stat.color + "15" }}>{stat.icon}</div>
              <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom: "20px" }}>
          <input
            style={s.searchInput}
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table + Detail */}
        <div style={s.layout}>

          {/* Table */}
          <div style={s.tableCard}>
            {loading ? (
              <p style={s.emptyMsg}>Loading users...</p>
            ) : filtered.length === 0 ? (
              <p style={s.emptyMsg}>No users found</p>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    {["User", "Email", "Joined", "Orders", "Total Spend"].map((h) => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => {
                    const userOrders = getUserOrders(user.email);
                    const spend = getUserTotalSpend(user.email);
                    return (
                      <tr
                        key={user.id}
                        style={{
                          ...s.tr,
                          background: selectedUser?.id === user.id ? "#0d1f0d" : "transparent",
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedUser(user)}
                      >
                        <td style={s.td}>
                          <div style={s.userRow}>
                            <div style={s.avatar}>
                              {user.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <span style={{ color: "#fff", fontWeight: "600" }}>{user.name}</span>
                          </div>
                        </td>
                        <td style={s.td}>{user.email}</td>
                        <td style={s.td}>
                          <span style={{ fontSize: "12px", color: "#555" }}>
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString("en-IN")
                              : "—"}
                          </span>
                        </td>
                        <td style={s.td}>
                          <span style={{
                            background: userOrders.length > 0 ? "#0a1628" : "#1a1a1a",
                            color: userOrders.length > 0 ? "#0066FF" : "#555",
                            padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700"
                          }}>
                            {userOrders.length} orders
                          </span>
                        </td>
                        <td style={s.td}>
                          <span style={{ color: spend > 0 ? "#00FF9C" : "#555", fontWeight: "700" }}>
                            {spend > 0 ? `₹${spend.toLocaleString()}` : "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Detail Panel */}
          {selectedUser && (
            <div style={s.detailPanel}>
              <div style={s.detailHeader}>
                <h3 style={s.detailTitle}>User Details</h3>
                <button onClick={() => setSelectedUser(null)} style={s.closeBtn}>✕</button>
              </div>

              {/* Avatar */}
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{ ...s.avatar, width: "60px", height: "60px", fontSize: "24px", margin: "0 auto 10px" }}>
                  {selectedUser.name?.[0]?.toUpperCase() || "U"}
                </div>
                <p style={{ color: "#fff", fontWeight: "700", fontSize: "16px", margin: "0 0 4px" }}>{selectedUser.name}</p>
                <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>{selectedUser.email}</p>
              </div>

              {/* Info */}
              <div style={s.detailSection}>
                <p style={s.detailLabel}>📅 Joined</p>
                <p style={s.detailVal}>
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
                    : "—"}
                </p>
              </div>

              {/* Order Stats */}
              <div style={s.detailSection}>
                <p style={s.detailLabel}>📦 Order Summary</p>
                <div style={s.detailItem}>
                  <span style={s.detailSub}>Total Orders</span>
                  <span style={{ color: "#0066FF", fontWeight: "700" }}>
                    {getUserOrders(selectedUser.email).length}
                  </span>
                </div>
                <div style={s.detailItem}>
                  <span style={s.detailSub}>Total Spend</span>
                  <span style={{ color: "#00FF9C", fontWeight: "700" }}>
                    ₹{getUserTotalSpend(selectedUser.email).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <p style={s.detailLabel}>🛒 Recent Orders</p>
                {getUserOrders(selectedUser.email).length === 0 ? (
                  <p style={{ color: "#444", fontSize: "12px" }}>No orders yet</p>
                ) : (
                  getUserOrders(selectedUser.email).slice(0, 4).map((order) => (
                    <div key={order.id} style={s.orderItem}>
                      <div>
                        <p style={{ margin: 0, fontSize: "12px", color: "#ccc", fontWeight: "600" }}>
                          #{order.id.slice(0, 6).toUpperCase()}
                        </p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#555" }}>
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#00FF9C", fontWeight: "700" }}>
                          ₹{order.total?.toLocaleString()}
                        </p>
                        <span style={{
                          fontSize: "10px", fontWeight: "700", padding: "2px 6px",
                          borderRadius: "10px", background: "#0d2b0d", color: "#00FF9C"
                        }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

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
  main: { flex: 1, padding: "32px", overflowY: "auto" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  pageTitle: { fontSize: "26px", fontWeight: "800", color: "#fff", margin: "0 0 4px" },
  pageSub: { fontSize: "13px", color: "#666", margin: 0 },
  refreshBtn: { padding: "10px 20px", background: "#111", border: "1px solid #1e1e1e", borderRadius: "10px", color: "#ccc", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" },
  statCard: { background: "#111", borderRadius: "14px", padding: "20px", border: "1px solid #1e1e1e" },
  statIcon: { width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "12px" },
  statValue: { fontSize: "24px", fontWeight: "900", marginBottom: "4px" },
  statLabel: { fontSize: "12px", color: "#666" },
  searchInput: { width: "100%", padding: "11px 16px", background: "#111", border: "1px solid #1e1e1e", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" },
  layout: { display: "flex", gap: "20px", alignItems: "flex-start" },
  tableCard: { flex: 1, background: "#111", borderRadius: "16px", padding: "20px", border: "1px solid #1e1e1e", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { fontSize: "11px", color: "#555", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", padding: "10px 12px", textAlign: "left", borderBottom: "1px solid #1e1e1e" },
  tr: { borderBottom: "1px solid #141414", transition: "background 0.15s" },
  td: { fontSize: "13px", color: "#ccc", padding: "12px 12px", verticalAlign: "middle" },
  userRow: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: { width: "32px", height: "32px", borderRadius: "50%", background: "#00FF9C", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px", flexShrink: 0 },
  emptyMsg: { fontSize: "14px", color: "#444", textAlign: "center", padding: "40px 0" },
  detailPanel: { width: "300px", flexShrink: 0, background: "#111", borderRadius: "16px", padding: "24px", border: "1px solid #1e1e1e", position: "sticky", top: "20px" },
  detailHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  detailTitle: { fontSize: "16px", fontWeight: "800", color: "#fff", margin: 0 },
  closeBtn: { background: "none", border: "none", color: "#555", fontSize: "16px", cursor: "pointer" },
  detailSection: { marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #1a1a1a" },
  detailLabel: { fontSize: "11px", color: "#555", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px" },
  detailVal: { fontSize: "14px", color: "#fff", fontWeight: "600", margin: 0 },
  detailSub: { fontSize: "12px", color: "#666", margin: "2px 0" },
  detailItem: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  orderItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #141414" },
};
