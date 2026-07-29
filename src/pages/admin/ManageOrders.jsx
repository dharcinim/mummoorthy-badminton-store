import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/orderService";

const statusOptions = ["Order Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

const getStatusStyle = (status) => {
  switch (status) {
    case "Delivered":        return { background: "#0d2b0d", color: "#00FF9C" };
    case "Shipped":          return { background: "#0a1628", color: "#0066FF" };
    case "Out for Delivery": return { background: "#1a1a0a", color: "#FFD700" };
    case "Packed":           return { background: "#1a0f0a", color: "#FF9800" };
    case "Confirmed":        return { background: "#0a1a1a", color: "#00BCD4" };
    case "Order Placed":     return { background: "#1a1a1a", color: "#aaa" };
    case "Cancelled":        return { background: "#2b0d0d", color: "#F44336" };
    default:                 return { background: "#1a1a1a", color: "#888" };
  }
};

export default function ManageOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
  setLoading(true);

  try {
    const response = await getAllOrders();
    setOrders(response.data);
  } catch (error) {
    console.error("Error fetching orders:", error);
  } finally {
    setLoading(false);
  }
};

  const updateStatus = async (orderId, newStatus) => {
  setUpdating(true);

  try {
    const response = await updateOrderStatus(orderId, newStatus);

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? response.data : order
      )
    );

    if (selectedOrder?.id === orderId) {
      setSelectedOrder(response.data);
    }
  } catch (error) {
    console.error("Error updating order:", error);
  } finally {
    setUpdating(false);
  }
};

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.userName?.toLowerCase().includes(search.toLowerCase()) ||
      o.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      (o.orderNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div style={s.shell}>

      {/* SIDEBAR */}
      <div style={s.sidebar}>
        <div style={s.sidebarBrand}>
          <span style={{ fontSize: "14px", fontWeight: "900", color: "#00FF9C" }}>M</span>
          <div>
            <div style={s.brandName}>Mummoorthy</div>
            <div style={s.brandSub}>Admin Panel</div>
          </div>
        </div>
        <nav style={s.nav}>
          {[
            { icon: "⊞", label: "Dashboard", route: "/admin" },
            { icon: "◈", label: "Products", route: "/admin/products" },
            { icon: "◻", label: "Orders", route: "/admin/orders" },
            { icon: "◷", label: "Bookings", route: "/admin/bookings" },
            { icon: "◉", label: "Users", route: "/admin/users" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.route)}
              style={{
                ...s.navItem,
                background: item.route === "/admin/orders" ? "rgba(0,255,156,0.1)" : "transparent",
                color: item.route === "/admin/orders" ? "#00FF9C" : "#888",
                borderLeft: item.route === "/admin/orders" ? "3px solid #00FF9C" : "3px solid transparent",
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
            <h1 style={s.pageTitle}> Manage Orders</h1>
            <p style={s.pageSub}>{orders.length} total orders · ₹{totalRevenue.toLocaleString()} revenue</p>
          </div>
          <button onClick={fetchOrders} style={s.refreshBtn}>↺ Refresh</button>
        </div>

        {/* Filters */}
        <div style={s.filterRow}>
          <input
            style={s.searchInput}
            placeholder="Search by name, email, order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={s.select}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            {statusOptions.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Table + Detail layout */}
        <div style={s.layout}>

          {/* Orders Table */}
          <div style={s.tableCard}>
            {loading ? (
              <p style={s.emptyMsg}>Loading orders...</p>
            ) : filtered.length === 0 ? (
              <p style={s.emptyMsg}>No orders found</p>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", "Action"].map((h) => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      style={{
                        ...s.tr,
                        background: selectedOrder?.id === order.id ? "#0d1f0d" : "transparent",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td style={s.td}>
                        <span style={{ color: "#00FF9C", fontWeight: "700" }}>
                          #{order.id.slice(0, 6).toUpperCase()}
                        </span>
                      </td>
                      <td style={s.td}>
                        <div style={{ fontWeight: "600", color: "#fff" }}>{order.userName}</div>
                        <div style={{ fontSize: "11px", color: "#555" }}>{order.userEmail}</div>
                      </td>
                      <td style={s.td}>{order.items?.length || 0} items</td>
                      <td style={s.td}>
                        <span style={{ color: "#00FF9C", fontWeight: "700" }}>
                          ₹{order.total?.toLocaleString()}
                        </span>
                      </td>
                      <td  style={{ ...s.td, textTransform: "uppercase", fontSize: "11px", color: "#888" }}>
                        {order.payment?.method}
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.statusBadge, ...getStatusStyle(order.status) }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={{ fontSize: "11px", color: "#555" }}>
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </td>
                      <td style={s.td}>
                        <select
                          style={s.statusSelect}
                          value={order.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateStatus(order.id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          disabled={updating}
                        >
                          {statusOptions.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Order Detail Panel */}
          {selectedOrder && (
            <div style={s.detailPanel}>
              <div style={s.detailHeader}>
                <h3 style={s.detailTitle}>
                  Order #{selectedOrder.id.slice(0, 6).toUpperCase()}
                </h3>
                <button onClick={() => setSelectedOrder(null)} style={s.closeBtn}>×</button>
              </div>

              {/* Status */}
              <div style={{ marginBottom: "20px" }}>
                <p style={s.detailLabel}>Status</p>
                <span style={{ ...s.statusBadge, ...getStatusStyle(selectedOrder.status), fontSize: "13px", padding: "5px 14px" }}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Customer */}
              <div style={s.detailSection}>
                <p style={s.detailLabel}> Customer</p>
                <p style={s.detailVal}>{selectedOrder.userName}</p>
                <p style={s.detailSub}>{selectedOrder.userEmail}</p>
                <p style={s.detailSub}>{selectedOrder.phone}</p>
              </div>

              {/* Address */}
              <div style={s.detailSection}>
                <p style={s.detailLabel}> Delivery Address</p>
                <p style={s.detailVal}>{selectedOrder.address?.address}</p>
                <p style={s.detailSub}>{selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}</p>
              </div>

              {/* Items */}
              <div style={s.detailSection}>
                <p style={s.detailLabel}> Items</p>
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} style={s.detailItem}>
                    <span style={{ color: "#ccc", fontSize: "13px" }}>{item.name}</span>
                    <span style={{ color: "#00FF9C", fontSize: "13px", fontWeight: "700" }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Payment */}
              <div style={s.detailSection}>
                <p style={s.detailLabel}> Payment</p>
                <p style={s.detailVal}>{selectedOrder.payment?.method?.toUpperCase()}</p>
                {selectedOrder.payment?.upi && <p style={s.detailSub}>{selectedOrder.payment.upi}</p>}
                {selectedOrder.payment?.cardLast4 && <p style={s.detailSub}>Card ending in {selectedOrder.payment.cardLast4}</p>}
              </div>

              {/* Total */}
              <div style={s.detailTotal}>
                <span>Total</span>
                <span style={{ color: "#00FF9C", fontWeight: "900", fontSize: "20px" }}>
                  ₹{selectedOrder.total?.toLocaleString()}
                </span>
              </div>

              {/* Update Status */}
              <div style={{ marginTop: "16px" }}>
                <p style={s.detailLabel}>Update Status</p>
                <select
                  style={{ ...s.statusSelect, width: "100%", padding: "10px 14px" }}
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                  disabled={updating}
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
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
  filterRow: { display: "flex", gap: "12px", marginBottom: "20px" },
  searchInput: { flex: 1, padding: "11px 16px", background: "#111", border: "1px solid #1e1e1e", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "Inter, sans-serif" },
  select: { padding: "11px 16px", background: "#111", border: "1px solid #1e1e1e", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  layout: { display: "flex", gap: "20px", alignItems: "flex-start" },
  tableCard: { flex: 1, background: "#111", borderRadius: "16px", padding: "20px", border: "1px solid #1e1e1e", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { fontSize: "11px", color: "#555", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", padding: "10px 12px", textAlign: "left", borderBottom: "1px solid #1e1e1e", whiteSpace: "nowrap" },
  tr: { borderBottom: "1px solid #141414", transition: "background 0.15s" },
  td: { fontSize: "13px", color: "#ccc", padding: "12px 12px", verticalAlign: "middle" },
  statusBadge: { fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", whiteSpace: "nowrap" },
  statusSelect: { background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", color: "#fff", fontSize: "12px", padding: "6px 10px", cursor: "pointer", outline: "none", fontFamily: "Inter, sans-serif" },
  emptyMsg: { fontSize: "14px", color: "#444", textAlign: "center", padding: "40px 0" },
  detailPanel: { width: "300px", flexShrink: 0, background: "#111", borderRadius: "16px", padding: "24px", border: "1px solid #1e1e1e", position: "sticky", top: "20px" },
  detailHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  detailTitle: { fontSize: "16px", fontWeight: "800", color: "#fff", margin: 0 },
  closeBtn: { background: "none", border: "none", color: "#555", fontSize: "16px", cursor: "pointer" },
  detailSection: { marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #1a1a1a" },
  detailLabel: { fontSize: "11px", color: "#555", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" },
  detailVal: { fontSize: "14px", color: "#fff", fontWeight: "600", margin: "0 0 2px" },
  detailSub: { fontSize: "12px", color: "#666", margin: "2px 0" },
  detailItem: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
  detailTotal: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderTop: "1px solid #1a1a1a", fontSize: "15px", fontWeight: "700", color: "#fff" },
};
