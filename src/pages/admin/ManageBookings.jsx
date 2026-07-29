import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";

const statusOptions = ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];

const getStatusStyle = (status) => {
  switch (status) {
    case "Completed":   return { background: "#0d2b0d", color: "#00FF9C" };
    case "Confirmed":   return { background: "#0a1628", color: "#0066FF" };
    case "In Progress": return { background: "#1a1a0a", color: "#FFD700" };
    case "Pending":     return { background: "#2b1a0d", color: "#FF9800" };
    case "Cancelled":   return { background: "#2b0d0d", color: "#F44336" };
    default:            return { background: "#1a1a1a", color: "#888" };
  }
};

const getTypeStyle = (type) => {
  switch (type) {
    case "stringing": return { color: "#00FF9C", icon: "◈" };
    case "repair":    return { color: "#FF6B35", icon: "◧" };
    case "coaching":  return { color: "#6366F1", icon: "◉" };
    default:          return { color: "#888", icon: "◎" };
  }
};

export default function ManageBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc")));
      setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const updateStatus = async (bookingId, newStatus) => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (e) { console.error(e); }
    setUpdating(false);
  };

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.phone?.includes(search);
    const matchType = filterType === "All" || b.type === filterType;
    const matchStatus = filterStatus === "All" || b.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const counts = {
    stringing: bookings.filter((b) => b.type === "stringing").length,
    repair: bookings.filter((b) => b.type === "repair").length,
    coaching: bookings.filter((b) => b.type === "coaching").length,
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
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.route)}
              style={{
                ...s.navItem,
                background: item.route === "/admin/bookings" ? "rgba(0,255,156,0.1)" : "transparent",
                color: item.route === "/admin/bookings" ? "#00FF9C" : "#888",
                borderLeft: item.route === "/admin/bookings" ? "3px solid #00FF9C" : "3px solid transparent",
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
            <h1 style={s.pageTitle}> Manage Bookings</h1>
            <p style={s.pageSub}>{bookings.length} total bookings</p>
          </div>
          <button onClick={fetchBookings} style={s.refreshBtn}>↺ Refresh</button>
        </div>

        {/* Type stat cards */}
        <div style={s.typeCards}>
          {[
            { type: "All", label: "All Bookings", count: bookings.length, color: "#fff", icon: "◎" },
            { type: "stringing", label: "Stringing", count: counts.stringing, color: "#00FF9C", icon: "◈" },
            { type: "repair", label: "Repair", count: counts.repair, color: "#FF6B35", icon: "◧" },
            { type: "coaching", label: "Coaching", count: counts.coaching, color: "#6366F1", icon: "◉" },
          ].map((card, i) => (
            <div
              key={i}
              onClick={() => setFilterType(card.type)}
              style={{
                ...s.typeCard,
                borderColor: filterType === card.type ? card.color : "#1e1e1e",
                background: filterType === card.type ? card.color + "10" : "#111",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "24px" }}>{card.icon}</span>
              <div style={{ ...s.typeCount, color: card.color }}>{card.count}</div>
              <div style={s.typeLabel}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={s.filterRow}>
          <input
            style={s.searchInput}
            placeholder="Search by name or phone..."
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

        {/* Table + Detail */}
        <div style={s.layout}>

          {/* Table */}
          <div style={s.tableCard}>
            {loading ? (
              <p style={s.emptyMsg}>Loading bookings...</p>
            ) : filtered.length === 0 ? (
              <p style={s.emptyMsg}>No bookings found</p>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    {["Type", "Name", "Phone", "Date", "Status", "Update"].map((h) => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((booking) => {
                    const ts = getTypeStyle(booking.type);
                    return (
                      <tr
                        key={booking.id}
                        style={{
                          ...s.tr,
                          background: selectedBooking?.id === booking.id ? "#0d1f0d" : "transparent",
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <td style={s.td}>
                          <span style={{ color: ts.color, fontWeight: "700", textTransform: "capitalize" }}>
                            {ts.icon} {booking.type}
                          </span>
                        </td>
                        <td style={s.td}>
                          <span style={{ color: "#fff", fontWeight: "600" }}>{booking.name}</span>
                        </td>
                        <td style={s.td}>{booking.phone}</td>
                        <td style={s.td}>{booking.date}</td>
                        <td style={s.td}>
                          <span style={{ ...s.statusBadge, ...getStatusStyle(booking.status) }}>
                            {booking.status}
                          </span>
                        </td>
                        <td style={s.td}>
                          <select
                            style={s.statusSelect}
                            value={booking.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateStatus(booking.id, e.target.value);
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
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Detail Panel */}
          {selectedBooking && (
            <div style={s.detailPanel}>
              <div style={s.detailHeader}>
                <h3 style={s.detailTitle}>Booking Details</h3>
                <button onClick={() => setSelectedBooking(null)} style={s.closeBtn}>✕</button>
              </div>

              {/* Type badge */}
              <div style={{ marginBottom: "16px" }}>
                <span style={{
                  ...s.statusBadge,
                  color: getTypeStyle(selectedBooking.type).color,
                  background: getTypeStyle(selectedBooking.type).color + "15",
                  fontSize: "13px", padding: "5px 14px", textTransform: "capitalize"
                }}>
                  {selectedBooking.type}
                </span>
              </div>

              {/* Customer */}
              <div style={s.detailSection}>
                <p style={s.detailLabel}> Customer</p>
                <p style={s.detailVal}>{selectedBooking.name}</p>
                <p style={s.detailSub}> {selectedBooking.phone}</p>
              </div>

              {/* Date */}
              <div style={s.detailSection}>
                <p style={s.detailLabel}> Appointment</p>
                <p style={s.detailVal}>{selectedBooking.date}</p>
                {selectedBooking.time && <p style={s.detailSub}>⏰ {selectedBooking.time}</p>}
              </div>

              {/* Type specific details */}
              {selectedBooking.type === "stringing" && (
                <div style={s.detailSection}>
                  <p style={s.detailLabel}> Stringing Details</p>
                  <p style={s.detailSub}>String: {selectedBooking.string}</p>
                  <p style={s.detailSub}>Tension: {selectedBooking.tension} lbs</p>
                  <p style={s.detailSub}>Total: ₹{selectedBooking.totalPrice}</p>
                </div>
              )}

              {selectedBooking.type === "repair" && (
                <div style={s.detailSection}>
                  <p style={s.detailLabel}> Repair Services</p>
                  {selectedBooking.services?.map((sv, i) => (
                    <p key={i} style={s.detailSub}>• {sv}</p>
                  ))}
                  <p style={{ ...s.detailSub, color: "#00FF9C", fontWeight: "700", marginTop: "6px" }}>
                    Total: ₹{selectedBooking.total}
                  </p>
                </div>
              )}

              {selectedBooking.type === "coaching" && (
                <div style={s.detailSection}>
                  <p style={s.detailLabel}> Coaching Details</p>
                  <p style={s.detailSub}>Plan: {selectedBooking.plan}</p>
                  <p style={s.detailSub}>Level: {selectedBooking.level}</p>
                  <p style={s.detailSub}>Age: {selectedBooking.age || "Not provided"}</p>
                  {selectedBooking.monthlyFee > 0 && (
                    <p style={{ ...s.detailSub, color: "#6366F1", fontWeight: "700", marginTop: "6px" }}>
                      Fee: ₹{selectedBooking.monthlyFee}/mo
                    </p>
                  )}
                </div>
              )}

              {/* Notes */}
              {selectedBooking.notes && (
                <div style={s.detailSection}>
                  <p style={s.detailLabel}> Notes</p>
                  <p style={s.detailSub}>{selectedBooking.notes}</p>
                </div>
              )}

              {/* Status */}
              <div style={s.detailSection}>
                <p style={s.detailLabel}>Current Status</p>
                <span style={{ ...s.statusBadge, ...getStatusStyle(selectedBooking.status), fontSize: "12px", padding: "4px 12px" }}>
                  {selectedBooking.status}
                </span>
              </div>

              {/* Update */}
              <div>
                <p style={s.detailLabel}>Update Status</p>
                <select
                  style={{ ...s.statusSelect, width: "100%", padding: "10px 14px" }}
                  value={selectedBooking.status}
                  onChange={(e) => updateStatus(selectedBooking.id, e.target.value)}
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
  typeCards: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" },
  typeCard: { background: "#111", borderRadius: "14px", padding: "18px", border: "1px solid", transition: "all 0.2s", textAlign: "center" },
  typeCount: { fontSize: "28px", fontWeight: "900", margin: "8px 0 4px" },
  typeLabel: { fontSize: "12px", color: "#666", fontWeight: "500" },
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
};
