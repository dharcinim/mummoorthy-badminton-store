import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategory } from "../services/categoryService";
import ProductCard from "../components/ProductCard";


const sortOptions = ["Default", "Price: Low to High", "Price: High to Low", "Newest"];

// Racket
const flexibilityOptions = ["Extra Stiff", "Stiff", "Medium", "Flexible", "Extra Flexible"];
const weightOptions      = ["70–75g", "75–80g", "80–85g", "85–90g"];
const levelOptions       = ["Beginner", "Intermediate", "Advanced", "Professional", "Junior"];

// Shoe sizes
const shoeSizes = [];
for (let i = 1; i <= 12; i += 0.5) {
  shoeSizes.push(`UK ${i % 1 === 0 ? i : i.toFixed(1)}`);
}

// Others
const shuttleTypes    = ["Feather", "Nylon", "Hybrid"];
const gripTypes       = ["Overgrip", "Replacement Grip", "Towel Grip"];
const clothingCats    = ["Men", "Women", "Kids"];
const clothingSizes   = ["XS", "S", "M", "L", "XL", "XXL"];
const accessoryTypes  = ["Socks", "Sweatband", "Skipping Rope", "Wristband"];
const bagTypes        = ["Backpack", "Duffle Bag", "Kit Bag", "Tournament Bag"];

function CategoryPage() {
  const { category } = useParams();
    const [products, setProducts] = useState([]);

  const isRacket    = category === "rackets";
  const isShoe      = category === "shoes";
  const isShuttle   = category === "shuttles";
  const isString    = category === "strings";
  const isGrip      = category === "grips";
  const isClothing  = category === "clothing";
  const isAccessory = category === "accessories";
  const isKit       = category === "kit";



  // Racket
  const [flexibility, setFlexibility] = useState([]);
  const [weight, setWeight]           = useState([]);
  const [level, setLevel]             = useState([]);

  // Shoe
  const [sizes, setSizes] = useState([]);

  // Shuttle
  const [shuttleType, setShuttleType] = useState([]);

  // Grip
  const [gripType, setGripType] = useState([]);

  // Clothing
  const [clothingCat, setClothingCat]   = useState([]);
  const [clothingSize, setClothingSize] = useState([]);

  // Accessory
  const [accessoryType, setAccessoryType] = useState([]);

  // Bag
  const [bagType, setBagType] = useState([]);

  // Common
  const [sortBy, setSortBy]     = useState("Default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  useEffect(() => {

    const loadProducts = async () => {

        try {

            const data =
                await getProductsByCategory(category);

            setProducts(data);

        } catch (error) {

            console.error(error);

        }

    };

    loadProducts();

}, [category]);
  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const clearAll = () => {
    setSortBy("Default");
    setFlexibility([]); setWeight([]); setLevel([]);
    setSizes([]);
    setShuttleType([]);
    setGripType([]);
    setClothingCat([]); setClothingSize([]);
    setAccessoryType([]);
    setBagType([]);
    setMinPrice(""); setMaxPrice("");
  };

  let filtered = products.filter((p) => {
    if (p.categoryName?.toLowerCase() !== category.toLowerCase()) return false;
    if (isRacket) {
      if (flexibility.length && !flexibility.includes(p.flexibility)) return false;
      if (weight.length && !weight.includes(p.weight))               return false;
      if (level.length && !level.includes(p.level))                  return false;
    }
    if (isShoe) {
      if (sizes.length && !sizes.some((s) => p.sizes?.includes(s))) return false;
    }
    if (isShuttle) {
      if (shuttleType.length && !shuttleType.includes(p.shuttleType)) return false;
    }
    if (isGrip) {
      if (gripType.length && !gripType.includes(p.gripType)) return false;
    }
    if (isClothing) {
      if (clothingCat.length && !clothingCat.includes(p.gender))           return false;
      if (clothingSize.length && !clothingSize.some((s) => p.sizes?.includes(s))) return false;
    }
    if (isAccessory) {
      if (accessoryType.length && !accessoryType.includes(p.accessoryType)) return false;
    }
    if (isKit) {
      if (bagType.length && !bagType.includes(p.bagType)) return false;
    }
    if (minPrice !== "" && p.sellingPrice < Number(minPrice)) return false;
    if (maxPrice !== "" && p.sellingPrice > Number(maxPrice)) return false;
    return true;
  })

  if (sortBy === "Price: Low to High") filtered = [...filtered].sort((a, b) =>a.sellingPrice - b.sellingPrice);
  if (sortBy === "Price: High to Low") filtered = [...filtered].sort((a, b) => b.sellingPrice - a.sellingPrice);
  if (sortBy === "Newest")             filtered = [...filtered].sort((a, b) => b.id - a.id);

  const activeCount =
    (sortBy !== "Default" ? 1 : 0) +
    flexibility.length + weight.length + level.length +
    sizes.length + shuttleType.length + gripType.length +
    clothingCat.length + clothingSize.length +
    accessoryType.length + bagType.length +
    (minPrice !== "" || maxPrice !== "" ? 1 : 0);

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <h1 style={styles.title}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>
        <p style={styles.count}>{filtered.length} products found</p>
      </div>

      <div style={styles.layout}>

        {/* ── Sidebar ── */}
        <aside style={styles.sidebar}>

          <div style={styles.sidebarTop}>
            <span style={styles.filterLabel}>Filters</span>
            {activeCount > 0 && (
              <button style={styles.clearBtn} onClick={clearAll}>
                Clear All ({activeCount})
              </button>
            )}
          </div>

          {/* Sort By */}
          <Section title="Sort By">
            {sortOptions.map((s) => (
              <label key={s} style={styles.row}>
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === s}
                  onChange={() => setSortBy(s)}
                  style={styles.radio}
                />
                <span style={styles.optionText}>{s}</span>
              </label>
            ))}
          </Section>

          <Divider />

          {/* ── RACKET ── */}
          {isRacket && <>
            <Section title="Flexibility">
              {flexibilityOptions.map((f) => (
                <Checkbox key={f} label={f}
                  checked={flexibility.includes(f)}
                  onChange={() => toggle(flexibility, setFlexibility, f)} />
              ))}
            </Section>
            <Divider />
            <Section title="Weight">
              {weightOptions.map((w) => (
                <Checkbox key={w} label={w}
                  checked={weight.includes(w)}
                  onChange={() => toggle(weight, setWeight, w)} />
              ))}
            </Section>
            <Divider />
            <Section title="Playing Level">
              {levelOptions.map((l) => (
                <Checkbox key={l} label={l}
                  checked={level.includes(l)}
                  onChange={() => toggle(level, setLevel, l)} />
              ))}
            </Section>
            <Divider />
          </>}

          {/* ── SHOE ── */}
          {isShoe && <>
            <Section title="Size">
              <div style={styles.sizeGrid}>
                {shoeSizes.map((s) => (
                  <button key={s}
                    onClick={() => toggle(sizes, setSizes, s)}
                    style={{
                      ...styles.sizeBtn,
                      background: sizes.includes(s) ? "#000" : "#f5f5f5",
                      color:      sizes.includes(s) ? "#fff" : "#333",
                      border:     sizes.includes(s) ? "1px solid #000" : "1px solid #e0e0e0",
                    }}>
                    {s.replace("UK ", "")}
                  </button>
                ))}
              </div>
            </Section>
            <Divider />
          </>}

          {/* ── SHUTTLE ── */}
          {isShuttle && <>
            <Section title="Shuttle Type">
              {shuttleTypes.map((t) => (
                <Checkbox key={t} label={t}
                  checked={shuttleType.includes(t)}
                  onChange={() => toggle(shuttleType, setShuttleType, t)} />
              ))}
            </Section>
            <Divider />
          </>}

          {/* ── GRIP ── */}
          {isGrip && <>
            <Section title="Grip Type">
              {gripTypes.map((t) => (
                <Checkbox key={t} label={t}
                  checked={gripType.includes(t)}
                  onChange={() => toggle(gripType, setGripType, t)} />
              ))}
            </Section>
            <Divider />
          </>}

          {/* ── CLOTHING ── */}
          {isClothing && <>
            <Section title="Category">
              {clothingCats.map((c) => (
                <Checkbox key={c} label={c}
                  checked={clothingCat.includes(c)}
                  onChange={() => toggle(clothingCat, setClothingCat, c)} />
              ))}
            </Section>
            <Divider />
            <Section title="Size">
              <div style={styles.chipGrid}>
                {clothingSizes.map((s) => (
                  <button key={s}
                    onClick={() => toggle(clothingSize, setClothingSize, s)}
                    style={{
                      ...styles.chipBtn,
                      background: clothingSize.includes(s) ? "#000" : "#f5f5f5",
                      color:      clothingSize.includes(s) ? "#fff" : "#333",
                      border:     clothingSize.includes(s) ? "1px solid #000" : "1px solid #e0e0e0",
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </Section>
            <Divider />
          </>}

          {/* ── ACCESSORY ── */}
          {isAccessory && <>
            <Section title="Accessory Type">
              {accessoryTypes.map((t) => (
                <Checkbox key={t} label={t}
                  checked={accessoryType.includes(t)}
                  onChange={() => toggle(accessoryType, setAccessoryType, t)} />
              ))}
            </Section>
            <Divider />
          </>}

          {/* ── KIT / BAGS ── */}
          {isKit && <>
            <Section title="Bag Type">
              {bagTypes.map((t) => (
                <Checkbox key={t} label={t}
                  checked={bagType.includes(t)}
                  onChange={() => toggle(bagType, setBagType, t)} />
              ))}
            </Section>
            <Divider />
          </>}

          {/* Price Range — all categories */}
          <Section title="Price (₹)">
            <div style={styles.priceRow}>
              <input type="number" placeholder="Min" value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                style={styles.priceInput} />
              <span style={styles.priceSep}>—</span>
              <input type="number" placeholder="Max" value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={styles.priceInput} />
            </div>
          </Section>

          <Divider />

          <button style={styles.clearAllBtn} onClick={clearAll}>
            Clear All Filters
          </button>

        </aside>

        {/* ── Product Grid ── */}
        <div style={styles.main}>
          {filtered.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyIcon}>🏸</p>
              <p style={styles.emptyText}>No products found</p>
              <p style={styles.emptySubtext}>Try adjusting or clearing your filters</p>
              <button style={styles.emptyBtn} onClick={clearAll}>Clear Filters</button>
            </div>
          ) : (
            <div style={styles.grid}>
              {filtered.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ── Small helper components ──
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "4px", display: "flex", flexDirection: "column", gap: "10px" }}>
      <h4 style={{
        fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px",
        textTransform: "uppercase", color: "#aaa", margin: "0 0 4px",
      }}>{title}</h4>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={onChange}
        style={{ accentColor: "#000", width: "15px", height: "15px", cursor: "pointer" }} />
      <span style={{ fontSize: "13px", color: "#333" }}>{label}</span>
    </label>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "#f0f0f0", margin: "16px 0" }} />;
}

export default CategoryPage;

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f5f5",
    padding: "40px 30px",
    fontFamily: "'Inter', sans-serif",
  },
  header: { marginBottom: "28px" },
  title: {
    fontSize: "30px", fontWeight: "800",
    color: "#0a0a0a", margin: "0 0 4px", textTransform: "capitalize",
  },
  count: { fontSize: "14px", color: "#888", margin: 0 },
  layout: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: "28px",
    alignItems: "start",
  },
  sidebar: {
    background: "#fff", borderRadius: "16px",
    padding: "20px", border: "1px solid #eee",
    position: "sticky", top: "20px",
  },
  sidebarTop: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "16px",
  },
  filterLabel: { fontSize: "15px", fontWeight: "700", color: "#0a0a0a" },
  clearBtn: {
    fontSize: "12px", color: "#0066FF",
    background: "none", border: "none",
    cursor: "pointer", fontWeight: "600", padding: 0,
  },
  row: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
  radio: { accentColor: "#000", width: "15px", height: "15px", cursor: "pointer" },
  optionText: { fontSize: "13px", color: "#333" },
  sizeGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" },
  sizeBtn: {
    padding: "8px 4px", borderRadius: "8px",
    fontSize: "12px", fontWeight: "600",
    cursor: "pointer", textAlign: "center", transition: "all 0.15s",
  },
  chipGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" },
  chipBtn: {
    padding: "8px 4px", borderRadius: "8px",
    fontSize: "12px", fontWeight: "600",
    cursor: "pointer", textAlign: "center", transition: "all 0.15s",
  },
  priceRow: { display: "flex", alignItems: "center", gap: "8px" },
  priceInput: {
    flex: 1, padding: "8px 10px", borderRadius: "8px",
    border: "1px solid #e0e0e0", fontSize: "13px",
    outline: "none", width: "100%",
  },
  priceSep: { color: "#aaa", fontSize: "14px" },
  clearAllBtn: {
    width: "100%", padding: "11px", borderRadius: "10px",
    border: "1.5px solid #000", background: "#fff",
    color: "#000", fontSize: "13px", fontWeight: "700",
    cursor: "pointer", marginTop: "4px",
  },
  main: { minHeight: "400px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
  },
  empty: {
    textAlign: "center", padding: "80px 20px",
    background: "#fff", borderRadius: "16px",
  },
  emptyIcon: { fontSize: "48px", margin: "0 0 12px" },
  emptyText: { fontSize: "18px", fontWeight: "700", color: "#333", margin: "0 0 6px" },
  emptySubtext: { fontSize: "14px", color: "#aaa", margin: "0 0 20px" },
  emptyBtn: {
    padding: "10px 24px", borderRadius: "999px",
    border: "none", background: "#000",
    color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer",
  },
};