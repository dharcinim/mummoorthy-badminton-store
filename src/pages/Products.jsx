
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import products from "../data/product";

const defaultFilters = {
  category: "All",
  brand: "All Brands",
  sort: "newest",
  maxPrice: 20000,
  search: "",
  onlyNew: false,
  onlyBestSeller: false,
};

function Products() {
  const [filters, setFilters] = useState(defaultFilters);
  const [searchParams] = useSearchParams();

  // Read ?search= from URL on mount
  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setFilters((prev) => ({ ...prev, search: q }));
  }, [searchParams]);
  const [view, setView] = useState("grid"); // "grid" | "list"
  const navigate = useNavigate();

  // ── Apply Filters & Sort ─────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...products];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.includes(q)))
      );
    }

    // Category
    if (filters.category !== "All") {
      result = result.filter((p) => p.category === filters.category);
    }

    // Brand
    if (filters.brand !== "All Brands") {
      result = result.filter((p) => p.brand === filters.brand);
    }

    // Price
    result = result.filter((p) => p.price <= filters.maxPrice);

    // New / BestSeller toggles
    if (filters.onlyNew) result = result.filter((p) => p.isNew);
    if (filters.onlyBestSeller) result = result.filter((p) => p.isBestSeller);

    // Sort
    switch (filters.sort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        // newest — keep original order (id desc)
        result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [filters]);

  return (
    <div style={styles.page}>

      {/* ── PAGE HEADER ───────────────────────────────────── */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>🏸 Shop All Products</h1>
          <p style={styles.subtitle}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* View Toggle */}
        <div style={styles.viewToggle}>
          <button
            onClick={() => setView("grid")}
            style={{
              ...styles.viewBtn,
              background: view === "grid" ? "#0066FF" : "#F5F7FA",
              color: view === "grid" ? "#fff" : "#111",
            }}
          >
            ⊞ Grid
          </button>
          <button
            onClick={() => setView("list")}
            style={{
              ...styles.viewBtn,
              background: view === "list" ? "#0066FF" : "#F5F7FA",
              color: view === "list" ? "#fff" : "#111",
            }}
          >
            ≡ List
          </button>
        </div>
      </div>

      {/* ── MAIN LAYOUT ───────────────────────────────────── */}
      <div style={styles.layout}>

        {/* Sidebar Filters */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* Product Grid/List */}
        <main style={styles.main}>
          {filtered.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: "60px" }}>🏸</div>
              <h3 style={{ marginTop: "16px", fontSize: "20px" }}>No products found</h3>
              <p style={{ color: "#6B7280" }}>Try adjusting your filters</p>
              <button
                onClick={() =>
                  setFilters(defaultFilters)
                }
                style={styles.clearBtn}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              style={
                view === "grid"
                  ? styles.grid
                  : styles.listView
              }
            >
              {filtered.map((product) => (
                <div
                  key={product.id}
                  style={view === "list" ? styles.listCard : {}}
                >
                  {view === "list" ? (
                    /* LIST VIEW CARD */
                    <div style={styles.listCardInner}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={styles.listImage}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/120x120?text=No+Image";
                        }}
                      />
                      <div style={styles.listInfo}>
                        <div style={styles.listBadges}>
                          {product.isNew && (
                            <span style={styles.newBadge}>NEW</span>
                          )}
                          {product.isBestSeller && (
                            <span style={styles.bestBadge}>BEST SELLER</span>
                          )}
                        </div>
                        <h3 style={styles.listName}>{product.name}</h3>
                        <p style={styles.listBrand}>{product.brand} · {product.category}</p>
                        <p style={styles.listDesc}>{product.description?.slice(0, 100)}...</p>
                        <div style={styles.listRating}>
                          {"⭐".repeat(Math.floor(product.rating))}
                          <span style={{ color: "#6B7280", fontSize: "13px", marginLeft: "6px" }}>
                            ({product.reviews})
                          </span>
                        </div>
                      </div>
                      <div style={styles.listPriceCol}>
                        <span style={styles.listOldPrice}>₹{product.oldPrice?.toLocaleString()}</span>
                        <span style={styles.listPrice}>₹{product.price.toLocaleString()}</span>
                        <span style={styles.discountBadge}>-{product.discount}%</span>
                        <button
                          style={styles.listCartBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            // addToCart handled in ProductCard
                          }}
                        >
                          View Product →
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* GRID VIEW CARD */
                    <ProductCard
                      product={product}
                      showNew={product.isNew}
                      showBest={product.isBestSeller}
                      isDark={false}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Products;

// ─── STYLES ─────────────────────────────────────────────────
const styles = {
  page: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "30px 20px 60px",
    fontFamily: "sans-serif",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "12px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#111",
    margin: 0,
  },
  subtitle: {
    color: "#6B7280",
    marginTop: "4px",
    fontSize: "14px",
  },
  viewToggle: {
    display: "flex",
    gap: "8px",
  },
  viewBtn: {
    padding: "8px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  layout: {
    display: "flex",
    gap: "28px",
    alignItems: "flex-start",
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
  },
  listView: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  listCard: {
    background: "#fff",
    borderRadius: "14px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    cursor: "pointer",
    transition: "box-shadow 0.2s",
    overflow: "hidden",
  },
  listCardInner: {
    display: "flex",
    gap: "20px",
    padding: "20px",
    alignItems: "center",
  },
  listImage: {
    width: "120px",
    height: "120px",
    objectFit: "contain",
    borderRadius: "10px",
    background: "#F5F7FA",
    flexShrink: 0,
  },
  listInfo: {
    flex: 1,
  },
  listBadges: {
    display: "flex",
    gap: "6px",
    marginBottom: "6px",
  },
  newBadge: {
    background: "linear-gradient(45deg,#00e676,#00c853)",
    color: "#000",
    fontSize: "10px",
    padding: "2px 8px",
    borderRadius: "20px",
    fontWeight: "700",
  },
  bestBadge: {
    background: "linear-gradient(45deg,#ff9800,#ff5722)",
    color: "#fff",
    fontSize: "10px",
    padding: "2px 8px",
    borderRadius: "20px",
    fontWeight: "700",
  },
  listName: {
    margin: "0 0 4px",
    fontSize: "17px",
    fontWeight: "700",
    color: "#111",
  },
  listBrand: {
    fontSize: "13px",
    color: "#0066FF",
    marginBottom: "6px",
  },
  listDesc: {
    fontSize: "13px",
    color: "#6B7280",
    lineHeight: "1.5",
    marginBottom: "8px",
  },
  listRating: {
    fontSize: "13px",
  },
  listPriceCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "6px",
    minWidth: "130px",
  },
  listOldPrice: {
    textDecoration: "line-through",
    color: "#6B7280",
    fontSize: "13px",
  },
  listPrice: {
    fontWeight: "800",
    fontSize: "20px",
    color: "#111",
  },
  discountBadge: {
    background: "#ff3b3b",
    color: "#fff",
    fontSize: "12px",
    padding: "2px 8px",
    borderRadius: "5px",
    fontWeight: "600",
  },
  listCartBtn: {
    marginTop: "8px",
    padding: "9px 16px",
    background: "#0066FF",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  empty: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#111",
  },
  clearBtn: {
    marginTop: "20px",
    padding: "12px 28px",
    background: "#0066FF",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },
};
