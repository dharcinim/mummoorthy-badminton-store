import React, { useState } from "react";

const categories = ["All", "Rackets", "Shoes", "Shuttles", "Bags", "Strings", "Grips"];
const brands = ["All Brands", "Yonex", "Li-Ning", "Victor"];
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Most Popular", value: "popular" },
];

function FilterBar({ filters, setFilters }) {
  const [priceRange, setPriceRange] = useState(filters.maxPrice || 20000);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCategory = (cat) => {
    setFilters((prev) => ({ ...prev, category: cat }));
  };

  const handleBrand = (brand) => {
    setFilters((prev) => ({ ...prev, brand }));
  };

  const handleSort = (e) => {
    setFilters((prev) => ({ ...prev, sort: e.target.value }));
  };

  const handlePrice = (e) => {
    const val = Number(e.target.value);
    setPriceRange(val);
    setFilters((prev) => ({ ...prev, maxPrice: val }));
  };

  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleToggle = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetFilters = () => {
    setPriceRange(20000);
    setFilters({
      category: "All",
      brand: "All Brands",
      sort: "newest",
      maxPrice: 20000,
      search: "",
      onlyNew: false,
      onlyBestSeller: false,
    });
  };

  return (
    <>
      {/* ── Mobile Toggle ─────────────────────────────── */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={styles.mobileToggle}
      >
        {mobileOpen ? "✕ Close Filters" : "⚙ Filters & Sort"}
      </button>

      {/* ── Filter Panel ──────────────────────────────── */}
      <aside style={{ ...styles.panel, display: mobileOpen || window.innerWidth > 768 ? "flex" : "none" }}>

        {/* Search */}
        <div style={styles.section}>
          <label style={styles.label}>🔍 Search</label>
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search || ""}
            onChange={handleSearch}
            style={styles.searchInput}
          />
        </div>

        {/* Sort */}
        <div style={styles.section}>
          <label style={styles.label}>Sort By</label>
          <select value={filters.sort} onChange={handleSort} style={styles.select}>
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div style={styles.section}>
          <label style={styles.label}>Category</label>
          <div style={styles.chipGroup}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                style={{
                  ...styles.chip,
                  background: filters.category === cat ? "#0066FF" : "#F5F7FA",
                  color: filters.category === cat ? "#fff" : "#111",
                  border: filters.category === cat ? "2px solid #0066FF" : "2px solid #E0E0E0",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div style={styles.section}>
          <label style={styles.label}>Brand</label>
          <div style={styles.chipGroup}>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrand(brand)}
                style={{
                  ...styles.chip,
                  background: filters.brand === brand ? "#00FF9C" : "#F5F7FA",
                  color: filters.brand === brand ? "#111" : "#111",
                  border: filters.brand === brand ? "2px solid #00FF9C" : "2px solid #E0E0E0",
                }}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div style={styles.section}>
          <label style={styles.label}>
            Max Price: <strong style={{ color: "#0066FF" }}>₹{priceRange.toLocaleString()}</strong>
          </label>
          <input
            type="range"
            min={0}
            max={20000}
            step={500}
            value={priceRange}
            onChange={handlePrice}
            style={styles.range}
          />
          <div style={styles.rangeLabels}>
            <span>₹0</span>
            <span>₹20,000</span>
          </div>
        </div>

        {/* Toggles */}
        <div style={styles.section}>
          <label style={styles.label}>Filter By</label>
          <div style={styles.toggleRow}>
            <label style={styles.toggle}>
              <input
                type="checkbox"
                checked={filters.onlyNew || false}
                onChange={() => handleToggle("onlyNew")}
              />
              <span style={styles.toggleLabel}>🆕 New Arrivals</span>
            </label>
            <label style={styles.toggle}>
              <input
                type="checkbox"
                checked={filters.onlyBestSeller || false}
                onChange={() => handleToggle("onlyBestSeller")}
              />
              <span style={styles.toggleLabel}>🏆 Best Sellers</span>
            </label>
          </div>
        </div>

        {/* Reset */}
        <button onClick={resetFilters} style={styles.resetBtn}>
          ↺ Reset All Filters
        </button>
      </aside>
    </>
  );
}

export default FilterBar;

// ─── STYLES ───────────────────────────────────────────────────
const styles = {
  mobileToggle: {
    display: "none",
    width: "100%",
    padding: "12px",
    background: "#0066FF",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "12px",
    "@media (max-width: 768px)": { display: "block" },
  },
  panel: {
    flexDirection: "column",
    gap: "24px",
    width: "260px",
    minWidth: "220px",
    background: "#fff",
    borderRadius: "16px",
    padding: "24px 20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
    height: "fit-content",
    position: "sticky",
    top: "100px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontWeight: "700",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#6B7280",
  },
  searchInput: {
    padding: "10px 14px",
    border: "2px solid #E0E0E0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border 0.2s",
  },
  select: {
    padding: "10px 14px",
    border: "2px solid #E0E0E0",
    borderRadius: "8px",
    fontSize: "14px",
    background: "#F5F7FA",
    cursor: "pointer",
    outline: "none",
  },
  chipGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  chip: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  range: {
    width: "100%",
    accentColor: "#0066FF",
  },
  rangeLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#6B7280",
  },
  toggleRow: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  toggle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  toggleLabel: {
    fontSize: "14px",
    fontWeight: "500",
  },
  resetBtn: {
    padding: "10px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "background 0.2s",
  },
};
