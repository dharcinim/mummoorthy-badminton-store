import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategory } from "../services/categoryService";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";


const sortOptions = ["Default", "Price: Low to High", "Price: High to Low", "Newest"];

const normalizeCategory = (value = "") => {
  const key = String(value).toLowerCase().trim().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
  const aliases = {
    "kits": "kit bags", "kitbags": "kit bags", "bags": "kit bags", "kit bag": "kit bags",
    "shuttle": "shuttlecocks", "shuttles": "shuttlecocks", "shuttlecock": "shuttlecocks",
    "fitness training equipment": "fitness equipment", "training equipment": "fitness equipment",
    "grip": "grips", "racket": "rackets", "shoe": "shoes", "string": "strings",
    "accessory": "accessories"
  };
  return aliases[key] || key;
};

const normalizeAudience = (value = "") =>
  String(value ?? "").trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");

const getProductAudience = (p) => {
  const audience = normalizeAudience(
    p.gender ??
    p.targetAudience ??
    p.audience ??
    p.productGender ??
    p.specifications?.gender ??
    p.specifications?.targetAudience ??
    p.subCategoryName ??
    p.subCategory?.name ??
    ""
  );

  if (audience) return audience;

  const description = normalizeAudience(
    `${p.name || ""} ${p.shortDescription || ""} ${p.description || ""}`
  );

  if (/\b(unisex|adult unisex)\b/.test(description)) {
    return "unisex";
  }

  if (/\b(kids|kid|children|child|junior|youth)\b/.test(description)) {
    return "kids";
  }

  if (/\b(women|woman|womens|female|ladies)\b/.test(description)) {
    return "women";
  }

  if (/\b(men|mens|male)\b/.test(description)) {
    return "men";
  }

  return "";
};

const collectionTitles = {
  men: "Men Collection",
  women: "Women Collection",
  kids: "Kids Collection",
};


// Racket

const flexibilityOptions = ["Extra Stiff", "Stiff", "Medium", "Flexible", "Extra Flexible"];
const weightOptions = [
  { label: "70–75g", value: "6U" },
  { label: "75–80g", value: "5U" },
  { label: "80–85g", value: "4U" },
  { label: "85–90g", value: "3U" },
  { label: "90–95g", value: "2U" },
];
const levelOptions = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Intermediate", value: "Intermediate to Advanced" },
  { label: "Advanced", value: "Advanced" },
  { label: "Professional", value: "Professional" },
  { label: "Junior", value: "Junior" },
];


// Shoe sizes
const shoeSizes = [
  "UK 1", "UK 1.5", "UK 2", "UK 2.5",
  "UK 3", "UK 3.5", "UK 4", "UK 4.5",
  "UK 5", "UK 5.5", "UK 6", "UK 6.5",
  "UK 7", "UK 7.5", "UK 8", "UK 8.5",
  "UK 9", "UK 9.5", "UK 10", "UK 10.5",
  "UK 11", "UK 11.5", "UK 12"
];


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
    const shoeSizes = [...new Set(
  products
    .filter((p) => p.sizes)
    .flatMap((p) =>
      Array.isArray(p.sizes)
        ? p.sizes
        : typeof p.sizes === "string"
        ? p.sizes.split(",").map((s) => s.trim())
        : []
    )
)].sort((a, b) => {
  const numA = parseFloat(a.replace("UK ", ""));
  const numB = parseFloat(b.replace("UK ", ""));
  return numA - numB;
});

  const normalizedCategory = normalizeCategory(category);
  const isRacket    = normalizedCategory === "rackets";
  const isShoe      = normalizedCategory === "shoes";
  const isShuttle   = normalizedCategory === "shuttlecocks";
  const isString    = normalizedCategory === "strings";
  const isGrip      = normalizedCategory === "grips";
  const isClothing  = normalizedCategory === "clothing";
  const isAccessory = normalizedCategory === "accessories";
  const isKit       = normalizedCategory === "kit bags";
  const isFitness   = normalizedCategory === "fitness equipment";



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
            // Prefer the category endpoint, but fall back to the full catalogue.
            // This protects categories such as "Kit Bags" when the route slug and
            // backend category name differ (kit-bags vs Kit Bags).
            let data = [];
            try {
                data = await getProductsByCategory(category);
            } catch (categoryError) {
                console.warn("Category endpoint failed; loading full catalogue", categoryError);
            }

            if (!Array.isArray(data) || data.length === 0) {
                data = await getProducts();
            }

            setProducts(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error("Unable to load category products:", error);
            setProducts([]);
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

  const isCollection = Object.prototype.hasOwnProperty.call(collectionTitles, normalizedCategory);

  let filtered = products.filter((p) => {
    const productCategory = normalizeCategory(p.categoryName || p.category?.name || "");

    // Collections span multiple product categories, so filter by audience first.
    if (isCollection) {
      const audience = getProductAudience(p);
      if (normalizedCategory === "men") {
        return ["men", "male", "mens", "unisex", "all", "adult unisex"].includes(audience);
      }
      if (normalizedCategory === "women") {
        return ["women", "woman", "female", "womens", "unisex", "all", "adult unisex"].includes(audience);
      }
      // Kids gets explicitly child/junior products, plus unisex items marked for kids.
      return ["kids", "kid", "children", "child", "junior", "youth", "unisex kids", "kids unisex"].includes(audience);
    }

    if (productCategory !== normalizedCategory) return false;
    if (isRacket) {
      if (flexibility.length && !flexibility.includes(p.flexibility)) return false;
      if (weight.length && !weight.includes(p.weight))               return false;
      if (level.length && !level.includes(p.playingLevel))                  return false;
    }
    if (isShoe) {
     if (sizes.length) {
    const productSizes = Array.isArray(p.sizes)
      ? p.sizes
      : typeof p.sizes === "string"
      ? p.sizes.split(",").map((s) => s.trim())
      : [];

    if (!sizes.some((s) => productSizes.includes(s))) {
      return false;
    }
  }
    }
    if (isShuttle) {
      if (shuttleType.length && !shuttleType.includes(p.shuttleType || p.type || p.specifications?.type)) return false;
    }
    if (isGrip) {
      if (gripType.length && !gripType.includes(p.gripType || p.gripCategory || p.subCategoryName)) return false;
    }
    if (isClothing) {
      if (clothingCat.length && !clothingCat.includes(p.gender)) return false;
      const productSizes = Array.isArray(p.sizes) ? p.sizes : typeof p.sizes === "string" ? p.sizes.split(",").map((s) => s.trim()) : [];
      if (clothingSize.length && !clothingSize.some((s) => productSizes.includes(s))) return false;
    }
    if (isAccessory) {
      if (accessoryType.length && !accessoryType.includes(p.accessoryType || p.subCategoryName || p.subCategory?.name)) return false;
    }
    if (isKit) {
      const actualBagType = String(
        p.bagType || p.subCategoryName || p.subCategory?.name || p.type || p.name || ""
      ).toLowerCase();
      if (bagType.length && !bagType.some((type) => actualBagType.includes(type.toLowerCase()))) return false;
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
          {collectionTitles[normalizedCategory] || category.charAt(0).toUpperCase() + category.slice(1)}
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
                  <Checkbox
                    key={w.value}
                    label={w.label}
                    checked={weight.includes(w.value)}
                    onChange={() => toggle(weight, setWeight, w.value)}
                  />
                ))}
            </Section>
            <Divider />
            <Section title="Playing Level">
              {levelOptions.map((l) => (
                  <Checkbox
                    key={l.value}
                    label={l.label}
                    checked={level.includes(l.value)}
                    onChange={() => toggle(level, setLevel, l.value)}
                  />
                ))}
            </Section>
            <Divider />
          </>}

          
          {/* ── SHOE ── */}
{isShoe && <>
  <Section title="Size">
    <div style={styles.sizeGrid}>
      {shoeSizes.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => toggle(sizes, setSizes, s)}
          style={{
            ...styles.sizeBtn,
            background: sizes.includes(s) ? "#000" : "#f5f5f5",
            color: sizes.includes(s) ? "#fff" : "#333",
            border: sizes.includes(s)
              ? "1px solid #000"
              : "1px solid #e0e0e0",
          }}
        >
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
              <input type="number"  min="0" placeholder="Min" value={minPrice}
                onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || Number(value) >= 0) {
                      setMinPrice(value);
                    }
                  }}
                style={styles.priceInput} />
              <span style={styles.priceSep}>—</span>
              <input type="number"  min="0" placeholder="Max" value={maxPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || Number(value) >= 0) {
                    setMaxPrice(value);
                  }
                }}
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