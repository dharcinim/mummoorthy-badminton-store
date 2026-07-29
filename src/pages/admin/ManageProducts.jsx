import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query
} from "firebase/firestore";
import { db } from "../../firebase";

const emptyForm = {
  name: "", brand: "", category: "Rackets", price: "", oldPrice: "",
  discount: "", rating: "", reviews: "", stock: "", description: "",
  image: "", isNew: false, isBestSeller: false, isFeatured: false,
};

const categories = ["Rackets", "Shoes", "Shuttles", "Bags", "Strings", "Grips", "Clothing", "Accessories"];

export default function ManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "products"), orderBy("name")));
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setForm({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "Rackets",
      price: product.price || "",
      oldPrice: product.oldPrice || "",
      discount: product.discount || "",
      rating: product.rating || "",
      reviews: product.reviews || "",
      stock: product.stock || "",
      description: product.description || "",
      image: product.image || "",
      isNew: product.isNew || false,
      isBestSeller: product.isBestSeller || false,
      isFeatured: product.isFeatured || false,
    });
    setEditId(product.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      alert("Name and price are required!");
      return;
    }
    setSaving(true);
    try {
      const data = {
        ...form,
        price: Number(form.price),
        oldPrice: Number(form.oldPrice) || Number(form.price),
        discount: Number(form.discount) || 0,
        rating: Number(form.rating) || 0,
        reviews: Number(form.reviews) || 0,
        stock: Number(form.stock) || 0,
      };

      if (editId) {
        await updateDoc(doc(db, "products", editId), data);
        setProducts((prev) => prev.map((p) => p.id === editId ? { id: editId, ...data } : p));
      } else {
        const docRef = await addDoc(collection(db, "products"), data);
        setProducts((prev) => [...prev, { id: docRef.id, ...data }]);
      }
      setShowForm(false);
      setEditId(null);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } catch (e) { console.error(e); }
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const inp = (key, placeholder, type = "text") => (
    <div style={f.fieldWrap}>
      <label style={f.label}>{placeholder}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        style={f.input}
      />
    </div>
  );

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
                background: item.route === "/admin/products" ? "rgba(0,255,156,0.1)" : "transparent",
                color: item.route === "/admin/products" ? "#00FF9C" : "#888",
                borderLeft: item.route === "/admin/products" ? "3px solid #00FF9C" : "3px solid transparent",
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
            <h1 style={s.pageTitle}>🏸 Manage Products</h1>
            <p style={s.pageSub}>{products.length} total products</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={fetchProducts} style={s.refreshBtn}>🔄 Refresh</button>
            <button onClick={openAdd} style={s.addBtn}>+ Add Product</button>
          </div>
        </div>

        {/* Filters */}
        <div style={s.filterRow}>
          <input
            style={s.searchInput}
            placeholder="Search by name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={s.select}
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <p style={s.emptyMsg}>Loading products...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: "40px" }}>🏸</p>
            <p style={{ color: "#444", fontSize: "14px" }}>No products found</p>
            <button onClick={openAdd} style={{ ...s.addBtn, marginTop: "16px" }}>+ Add First Product</button>
          </div>
        ) : (
          <div style={s.grid}>
            {filtered.map((product) => (
              <div key={product.id} style={s.productCard}>

                {/* Image */}
                <div style={s.imgWrap}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={s.img}
                      onError={(e) => e.target.style.display = "none"}
                    />
                  ) : (
                    <div style={s.noImg}>🏸</div>
                  )}
                  {/* Badges */}
                  <div style={s.badges}>
                    {product.isNew && <span style={{ ...s.badge, background: "#0066FF" }}>New</span>}
                    {product.isBestSeller && <span style={{ ...s.badge, background: "#FF9800" }}>Best Seller</span>}
                    {product.isFeatured && <span style={{ ...s.badge, background: "#9C27B0" }}>Featured</span>}
                  </div>
                </div>

                {/* Info */}
                <div style={s.cardBody}>
                  <p style={s.cardBrand}>{product.brand} · {product.category}</p>
                  <p style={s.cardName}>{product.name}</p>
                  <div style={s.cardPriceRow}>
                    <span style={s.cardPrice}>₹{Number(product.price).toLocaleString()}</span>
                    {product.oldPrice > product.price && (
                      <span style={s.cardOldPrice}>₹{Number(product.oldPrice).toLocaleString()}</span>
                    )}
                    {product.discount > 0 && (
                      <span style={s.cardDiscount}>-{product.discount}%</span>
                    )}
                  </div>
                  <div style={s.cardMeta}>
                    <span style={{ color: "#FFD700" }}>⭐ {product.rating}</span>
                    <span style={{ color: "#555" }}>Stock: {product.stock}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={s.cardActions}>
                  <button
                    onClick={() => openEdit(product)}
                    style={s.editBtn}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    style={s.deleteBtn}
                  >
                    🗑️ Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* ADD/EDIT FORM MODAL */}
      {showForm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editId ? "✏️ Edit Product" : "➕ Add Product"}</h2>
              <button onClick={() => setShowForm(false)} style={s.closeBtn}>✕</button>
            </div>

            <div style={s.modalBody}>
              <div style={f.row}>
                {inp("name", "Product Name")}
                {inp("brand", "Brand")}
              </div>

              <div style={f.fieldWrap}>
                <label style={f.label}>Category</label>
                <select
                  style={f.input}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={f.row}>
                {inp("price", "Price (₹)", "number")}
                {inp("oldPrice", "Old Price (₹)", "number")}
                {inp("discount", "Discount (%)", "number")}
              </div>

              <div style={f.row}>
                {inp("rating", "Rating (0-5)", "number")}
                {inp("reviews", "Reviews Count", "number")}
                {inp("stock", "Stock Quantity", "number")}
              </div>

              {inp("image", "Image URL or Path")}

              <div style={f.fieldWrap}>
                <label style={f.label}>Description</label>
                <textarea
                  style={{ ...f.input, height: "80px", resize: "vertical" }}
                  placeholder="Product description..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>

              {/* Toggles */}
              <div style={f.toggleRow}>
                {[
                  { key: "isNew", label: "🆕 New Arrival" },
                  { key: "isBestSeller", label: "🔥 Best Seller" },
                  { key: "isFeatured", label: "⭐ Featured" },
                ].map((t) => (
                  <label key={t.key} style={f.toggle}>
                    <input
                      type="checkbox"
                      checked={form[t.key]}
                      onChange={(e) => set(t.key, e.target.checked)}
                      style={{ marginRight: "8px" }}
                    />
                    <span style={{ color: "#ccc", fontSize: "13px" }}>{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={s.modalFooter}>
              <button onClick={() => setShowForm(false)} style={s.cancelBtn}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={s.saveBtn}>
                {saving ? "Saving..." : editId ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div style={s.overlay}>
          <div style={{ ...s.modal, maxWidth: "400px" }}>
            <div style={{ textAlign: "center", padding: "32px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗑️</div>
              <h3 style={{ color: "#fff", fontSize: "20px", marginBottom: "10px" }}>Delete Product?</h3>
              <p style={{ color: "#666", fontSize: "14px", marginBottom: "28px" }}>
                This action cannot be undone. The product will be permanently removed from Firestore.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button onClick={() => setDeleteConfirm(null)} style={s.cancelBtn}>Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} style={{ ...s.saveBtn, background: "#F44336" }}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
  addBtn: { padding: "10px 20px", background: "#00FF9C", border: "none", borderRadius: "10px", color: "#000", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  filterRow: { display: "flex", gap: "12px", marginBottom: "24px" },
  searchInput: { flex: 1, padding: "11px 16px", background: "#111", border: "1px solid #1e1e1e", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "Inter, sans-serif" },
  select: { padding: "11px 16px", background: "#111", border: "1px solid #1e1e1e", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  emptyMsg: { fontSize: "14px", color: "#444", textAlign: "center", padding: "40px 0" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" },
  productCard: { background: "#111", borderRadius: "16px", border: "1px solid #1e1e1e", overflow: "hidden", transition: "border-color 0.2s" },
  imgWrap: { position: "relative", height: "160px", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" },
  img: { width: "100%", height: "100%", objectFit: "contain", padding: "12px" },
  noImg: { fontSize: "48px" },
  badges: { position: "absolute", top: "8px", left: "8px", display: "flex", flexDirection: "column", gap: "4px" },
  badge: { fontSize: "10px", fontWeight: "700", color: "#fff", padding: "2px 8px", borderRadius: "6px" },
  cardBody: { padding: "14px 16px" },
  cardBrand: { fontSize: "11px", color: "#555", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" },
  cardName: { fontSize: "14px", fontWeight: "700", color: "#fff", margin: "0 0 8px", lineHeight: 1.4 },
  cardPriceRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" },
  cardPrice: { fontSize: "16px", fontWeight: "800", color: "#00FF9C" },
  cardOldPrice: { fontSize: "12px", color: "#444", textDecoration: "line-through" },
  cardDiscount: { fontSize: "11px", color: "#FF9800", fontWeight: "700" },
  cardMeta: { display: "flex", justifyContent: "space-between", fontSize: "12px" },
  cardActions: { display: "flex", gap: "8px", padding: "12px 16px", borderTop: "1px solid #1a1a1a" },
  editBtn: { flex: 1, padding: "8px", background: "#0a1628", border: "1px solid #0066FF33", borderRadius: "8px", color: "#0066FF", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  deleteBtn: { flex: 1, padding: "8px", background: "#2b0d0d", border: "1px solid #F4433633", borderRadius: "8px", color: "#F44336", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
  modal: { background: "#111", borderRadius: "20px", border: "1px solid #1e1e1e", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 28px", borderBottom: "1px solid #1e1e1e" },
  modalTitle: { fontSize: "18px", fontWeight: "800", color: "#fff", margin: 0 },
  closeBtn: { background: "none", border: "none", color: "#555", fontSize: "20px", cursor: "pointer" },
  modalBody: { padding: "24px 28px", overflowY: "auto", flex: 1 },
  modalFooter: { display: "flex", gap: "12px", justifyContent: "flex-end", padding: "20px 28px", borderTop: "1px solid #1e1e1e" },
  cancelBtn: { padding: "10px 24px", background: "none", border: "1px solid #2a2a2a", borderRadius: "10px", color: "#888", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  saveBtn: { padding: "10px 28px", background: "#00FF9C", border: "none", borderRadius: "10px", color: "#000", fontSize: "14px", fontWeight: "800", cursor: "pointer", fontFamily: "Inter, sans-serif" },
};

const f = {
  row: { display: "flex", gap: "12px" },
  fieldWrap: { flex: 1, marginBottom: "16px" },
  label: { display: "block", fontSize: "11px", color: "#555", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" },
  input: { width: "100%", padding: "10px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "Inter, sans-serif" },
  toggleRow: { display: "flex", gap: "20px", flexWrap: "wrap" },
  toggle: { display: "flex", alignItems: "center", cursor: "pointer" },
};
