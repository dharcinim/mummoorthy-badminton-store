import React from "react";
import { useNavigate } from "react-router-dom";

const collections = [
  {
    id: "men",
    label: "Collection",
    name: "Men",
    count: "Explore the collection",
    bg: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    deco1: "#4fc3f7",
    deco2: "#81d4fa",
  },
  {
    id: "women",
    label: "Collection",
    name: "Women",
    count: "Explore the collection",
    bg: "linear-gradient(160deg, #2d1b35 0%, #6b2d5e 50%, #c2185b 100%)",
    deco1: "#f48fb1",
    deco2: "#f06292",
  },
  {
    id: "kids",
    label: "Collection",
    name: "Kids",
    count: "Explore the collection",
    bg: "linear-gradient(160deg, #1a2f1a 0%, #2e5e2e 50%, #43a047 100%)",
    deco1: "#a5d6a7",
    deco2: "#66bb6a",
  },
];

function Collections() {
  const navigate = useNavigate();

  return (
    <div style={styles.section}>
      <div style={styles.top}>
        <div>
          <h2 style={styles.title}>Shop by Collection</h2>
          <p style={styles.subtitle}>Find your perfect style</p>
        </div>
      </div>

      <div style={styles.grid}>
        {collections.map((col) => (
          <div key={col.id} style={styles.card}>
            <div style={{ ...styles.bg, background: col.bg }}>

              {/* Decorative circles */}
              <div style={{
                ...styles.deco,
                width: 200, height: 200,
                background: col.deco1,
                top: -40, right: -40,
              }} />
              <div style={{
                ...styles.deco,
                width: 90, height: 90,
                background: col.deco2,
                bottom: 60, right: 20,
              }} />

              <div style={styles.info}>
                <div style={styles.label}>Collection</div>
                <h3 style={styles.name}>{col.name}</h3>
                <button
                  style={styles.btn}
                  onClick={() => navigate(`/category/${col.id}`)}
                >
                  Shop Now
                </button>
                <div style={styles.count}>{col.count}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Collections;

const styles = {
  section: {
    padding: "60px 20px",
    background: "#fff",
  },
  top: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#0a0a0a",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "#888",
    margin: "4px 0 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  card: {
    borderRadius: "16px",
    overflow: "hidden",
    cursor: "pointer",
    aspectRatio: "8/4",
  },
  bg: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "flex-end",
    padding: "24px",
    position: "relative",
    transition: "filter .3s",
  },
  deco: {
    position: "absolute",
    borderRadius: "50%",
    opacity: 0.12,
  },
  info: {
    position: "relative",
    zIndex: 2,
  },
  label: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.6)",
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  name: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#fff",
    margin: "0 0 14px",
  },
  btn: {
    display: "inline-block",
    background: "#fff",
    color: "#0a0a0a",
    fontSize: "13px",
    fontWeight: "600",
    padding: "9px 20px",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
  },
  count: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.5)",
    marginTop: "10px",
  },
};