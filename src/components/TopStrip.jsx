import React, { useState, useEffect } from "react";

const messages = [
  "Free shipping on orders above ₹999",
  "Same-day racket stringing available in-store",
  "New arrivals every week · Yonex · Li-Ning · Victor",
  "Express repair service · Ready in 1 hour",
  "Authorized dealer for all major badminton brands",
];

function TopStrip() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div style={styles.strip}>
      <div style={{ flex: 1 }} />
      <p style={styles.message}>
        — {messages[current]}
      </p>
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => setVisible(false)} style={styles.closeBtn} title="Close">
          ×
        </button>
      </div>
    </div>
  );
}

export default TopStrip;

const styles = {
  strip: {
    background: "#00FF9C",
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 20px",
    fontSize: "13px",
    fontWeight: "600",
    gap: "12px",
    minHeight: "36px",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "0.3px",
  },
  message: {
    margin: 0,
    textAlign: "center",
    flex: "none",
    letterSpacing: "0.3px",
    transition: "opacity 0.3s ease",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#000",
    fontWeight: "700",
    padding: "2px 6px",
    opacity: 0.5,
    lineHeight: 1,
  },
};
