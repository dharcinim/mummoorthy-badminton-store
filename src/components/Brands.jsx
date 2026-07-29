import React from "react";

const brands = ["Apacas", "Katana", "Lining", "Yonex", "Hundred", "Young"];

// duplicate for infinite loop effect
const loopBrands = [...brands, ...brands, ...brands];

function BrandScroller() {
  return (
    <div style={styles.section}>
      <h2 style={styles.title}>Our Brands</h2>
      <div style={styles.wrapper}>
        <div style={styles.track} className="brand-track">
          {loopBrands.map((brand, i) => (
            <div key={i} style={styles.pill}>
              {brand}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrandScroller;

const styles = {
  section: {
    padding: "40px 0",
    background: "#fff",
    overflow: "hidden",
    textAlign: "center",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#0a0a0a",
    marginBottom: "28px",
  },
  wrapper: {
    overflow: "hidden",
    width: "100%",
  },
  track: {
    display: "flex",
    gap: "20px",
    width: "max-content",
    animation: "scrollBrands 18s linear infinite",
  },
  pill: {
    padding: "12px 32px",
    borderRadius: "999px",
    border: "1.5px solid #e0e0e0",
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a1a1a",
    background: "#fff",
    whiteSpace: "nowrap",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
};