import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const dummyOrders = [
  {
    id: "MBS10023",
    date: "22 Jun 2026",
    items: ["Yonex Nanoflare 800", "Yonex BG 65 String"],
    total: 12350,
    status: "Out for Delivery",
    steps: [
      { label: "Order Placed", done: true, date: "22 Jun, 10:00 AM" },
      { label: "Confirmed", done: true, date: "22 Jun, 10:30 AM" },
      { label: "Packed", done: true, date: "22 Jun, 2:00 PM" },
      { label: "Shipped", done: true, date: "23 Jun, 9:00 AM" },
      { label: "Out for Delivery", done: true, date: "24 Jun, 8:00 AM" },
      { label: "Delivered", done: false, date: "Expected: 24 Jun" },
    ],
  },
  {
    id: "MBS10019",
    date: "18 Jun 2026",
    items: ["Yonex Aerus Z Shoes"],
    total: 8500,
    status: "Delivered",
    steps: [
      { label: "Order Placed", done: true, date: "18 Jun, 11:00 AM" },
      { label: "Confirmed", done: true, date: "18 Jun, 11:30 AM" },
      { label: "Packed", done: true, date: "18 Jun, 4:00 PM" },
      { label: "Shipped", done: true, date: "19 Jun, 10:00 AM" },
      { label: "Out for Delivery", done: true, date: "20 Jun, 9:00 AM" },
      { label: "Delivered", done: true, date: "20 Jun, 2:00 PM" },
    ],
  },
];

export default function Tracking() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = () => {
    const trimmed = orderId.trim().toUpperCase();
    if (!trimmed) { setError("Please enter an order ID"); return; }
    const found = dummyOrders.find((o) => o.id === trimmed);
    if (found) {
      setResult(found);
      setError("");
    } else {
      setResult(null);
      setError("No order found with this ID. Please check and try again.");
    }
  };

  const activeStep = result
    ? result.steps.filter((s) => s.done).length - 1
    : -1;

  return (
    <div style={pg.page}>

      {/* HEADER */}
      <div style={pg.header}>
        <h1 style={pg.title}> Track Your Order</h1>
        <p style={pg.sub}>Enter your order ID to get real-time updates</p>
      </div>

      {/* SEARCH BOX */}
      <div style={pg.searchBox}>
        <div style={pg.inputRow}>
          <input
            style={pg.input}
            placeholder="Enter Order ID (e.g. MBS10023)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
          />
          <button style={pg.trackBtn} onClick={handleTrack}>
            Track →
          </button>
        </div>
        {error && <p style={pg.error}>{error}</p>}
        <p style={pg.hint}>
           Try: <span
            style={{ color: "#0066FF", cursor: "pointer", fontWeight: "600" }}
            onClick={() => setOrderId("MBS10023")}
          >MBS10023</span> or <span
            style={{ color: "#0066FF", cursor: "pointer", fontWeight: "600" }}
            onClick={() => setOrderId("MBS10019")}
          >MBS10019</span>
        </p>
      </div>

      {/* RESULT */}
      {result && (
        <div style={pg.resultBox}>

          {/* Order Info */}
          <div style={pg.orderInfo}>
            <div>
              <p style={pg.orderLabel}>Order ID</p>
              <p style={pg.orderVal}>#{result.id}</p>
            </div>
            <div>
              <p style={pg.orderLabel}>Order Date</p>
              <p style={pg.orderVal}>{result.date}</p>
            </div>
            <div>
              <p style={pg.orderLabel}>Items</p>
              <p style={pg.orderVal}>{result.items.join(", ")}</p>
            </div>
            <div>
              <p style={pg.orderLabel}>Total</p>
              <p style={pg.orderVal}>₹{result.total.toLocaleString()}</p>
            </div>
            <div>
              <p style={pg.orderLabel}>Status</p>
              <span style={{
                ...pg.statusBadge,
                background: result.status === "Delivered" ? "#e8f5e9" : "#fff3e0",
                color: result.status === "Delivered" ? "#2e7d32" : "#e65100",
              }}>
                {result.status}
              </span>
            </div>
          </div>

          <hr style={pg.divider} />

          {/* Progress Steps */}
          <h3 style={pg.stepsTitle}>Delivery Progress</h3>
          <div style={pg.stepsWrapper}>
            {result.steps.map((step, i) => (
              <div key={i} style={pg.stepRow}>

                {/* Circle + Line */}
                <div style={pg.stepLeft}>
                  <div style={{
                    ...pg.stepCircle,
                    background: step.done ? "#0066FF" : "#E0E0E0",
                    color: step.done ? "#fff" : "#aaa",
                  }}>
                    {step.done ? "✓" : i + 1}
                  </div>
                  {i < result.steps.length - 1 && (
                    <div style={{
                      ...pg.stepLine,
                      background: result.steps[i + 1].done ? "#0066FF" : "#E0E0E0",
                    }} />
                  )}
                </div>

                {/* Text */}
                <div style={pg.stepRight}>
                  <p style={{
                    ...pg.stepLabel,
                    color: i === activeStep ? "#0066FF" : step.done ? "#111" : "#aaa",
                    fontWeight: i === activeStep ? "700" : "500",
                  }}>
                    {step.label}
                    {i === activeStep && (
                      <span style={pg.currentBadge}>Current</span>
                    )}
                  </p>
                  <p style={pg.stepDate}>{step.date}</p>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* BACK BUTTON */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button onClick={() => navigate("/")} style={pg.backBtn}>
          ← Continue Shopping
        </button>
      </div>

    </div>
  );
}

const pg = {
  page: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "40px 20px 80px",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#111",
    margin: "0 0 8px",
  },
  sub: {
    fontSize: "15px",
    color: "#6B7280",
    margin: 0,
  },
  searchBox: {
    background: "#fff",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    marginBottom: "28px",
  },
  inputRow: {
    display: "flex",
    gap: "12px",
  },
  input: {
    flex: 1,
    padding: "13px 16px",
    border: "1.5px solid #E0E0E0",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    fontFamily: "sans-serif",
  },
  trackBtn: {
    padding: "13px 28px",
    background: "#0066FF",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },
  error: {
    color: "#f44336",
    fontSize: "13px",
    marginTop: "10px",
  },
  hint: {
    fontSize: "13px",
    color: "#888",
    marginTop: "12px",
    marginBottom: 0,
  },
  resultBox: {
    background: "#fff",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  orderInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  orderLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 4px",
  },
  orderVal: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111",
    margin: 0,
  },
  statusBadge: {
    display: "inline-block",
    fontSize: "12px",
    fontWeight: "700",
    padding: "4px 12px",
    borderRadius: "20px",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #F0F0F0",
    margin: "20px 0",
  },
  stepsTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111",
    marginBottom: "20px",
  },
  stepsWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  stepRow: {
    display: "flex",
    gap: "16px",
  },
  stepLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  stepCircle: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    flexShrink: 0,
  },
  stepLine: {
    width: "2px",
    flex: 1,
    minHeight: "32px",
    margin: "4px 0",
  },
  stepRight: {
    paddingBottom: "24px",
  },
  stepLabel: {
    fontSize: "14px",
    margin: "4px 0 2px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  currentBadge: {
    fontSize: "10px",
    background: "#0066FF",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "20px",
    fontWeight: "600",
  },
  stepDate: {
    fontSize: "12px",
    color: "#6B7280",
    margin: 0,
  },
  backBtn: {
    padding: "12px 28px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
