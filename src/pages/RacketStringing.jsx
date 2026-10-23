import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getProducts } from "../services/productService";

// String options are loaded from the same Spring Boot catalogue as the storefront.
const stringColors = ["#FFD700", "#00FF9C", "#4FC3F7", "#FF7043", "#CE93D8", "#80CBC4"];

const tensionGuide = [
  { range: "18–22 lbs", label: "Beginner", desc: "Larger sweet spot, more power", color: "#4CAF50" },
  { range: "22–25 lbs", label: "Intermediate", desc: "Balanced power & control", color: "#FF9800" },
  { range: "25–28 lbs", label: "Advanced", desc: "Precise control, fast response", color: "#F44336" },
  { range: "28–32 lbs", label: "Professional", desc: "Maximum control & feel", color: "#9C27B0" },
];

const process = [
  { step: "01", title: "Drop Off", desc: "Bring your racket to our store. We inspect the frame, grommets, and existing string." },
  { step: "02", title: "String Selection", desc: "Choose from 20+ premium strings. Our stringer recommends the best for your game." },
  { step: "03", title: "Precision Stringing", desc: "Strung on a computerized constant-pull machine for exact tension ±0.5 lbs accuracy." },
  { step: "04", title: "Quality Check", desc: "Final tension verified, grommets inspected, frame checked for stress points." },
  { step: "05", title: "Pickup", desc: "Ready in 2–4 hours. Same-day express service available. Comes with tension label." },
];

const faqs = [
  { q: "How often should I restring my racket?", a: "A common rule: restring as many times per year as you play per week. If you play 3x/week, restring 3x/year. Serious players restring monthly." },
  { q: "What tension should I choose?", a: "Beginners: 18–22 lbs for power. Intermediate: 22–26 lbs for balance. Advanced: 26–30 lbs for control. Our stringer will assess your game and recommend." },
  { q: "How long does stringing take?", a: "Standard service: 2–4 hours. Express service (add ₹100): done within 1 hour. Pre-booking guarantees your slot." },
  { q: "Do I need to bring my own string?", a: "No. We stock 20+ premium strings from Yonex, Li-Ning, and Victor. You can also bring your own string — we charge only labor (₹150)." },
  { q: "Will stringing damage my racket?", a: "Not when done correctly. Our stringers are trained professionals. We check for frame cracks and weak grommets before stringing to prevent damage." },
];

export default function RacketStringing() {
  const navigate = useNavigate();
  const [selectedString, setSelectedString] = useState(null);
  const [availableStrings, setAvailableStrings] = useState([]);
  const [stringsLoading, setStringsLoading] = useState(true);
  const [stringsError, setStringsError] = useState("");
  const [tension, setTension] = useState(24);
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadStrings = async () => {
      setStringsLoading(true);
      setStringsError("");
      try {
        const products = await getProducts();
        const stringProducts = (Array.isArray(products) ? products : [])
          .filter((product) => {
            const category = String(product.categoryName || product.category || "").toLowerCase();
            const stock = Number(product.stock ?? 0);
            const price = Number(product.sellingPrice ?? product.price ?? 0);
            return category.includes("string")
              && product.active !== false
              && stock > 0
              && price > 0;
          })
          .map((product, index) => ({
            id: product.id,
            name: product.name,
            brand: product.brandName || product.brand || "Badminton String",
            price: Number(product.sellingPrice ?? product.price),
            gauge: product.gauge || product.shortDescription || "See product details",
            type: product.type || "Badminton String",
            feel: product.feel || "See product details",
            bestFor: product.shortDescription || "Everyday play",
            color: stringColors[index % stringColors.length],
            tag: "In Stock",
            stock: Number(product.stock),
          }));

        if (isMounted) {
          setAvailableStrings(stringProducts);
          setSelectedString((current) =>
            current ? stringProducts.find((item) => item.id === current.id) || null : null
          );
        }
      } catch (error) {
        console.error("Unable to load string products:", error);
        if (isMounted) setStringsError("Could not load strings from the store catalogue. Check that the backend is running.");
      } finally {
        if (isMounted) setStringsLoading(false);
      }
    };

    loadStrings();
    return () => { isMounted = false; };
  }, []);

  const totalPrice = selectedString ? selectedString.price + 150 : 150; // string + labor
  const advanceAmount = Number((totalPrice * 0.5).toFixed(2));
  const balanceAmount = Number((totalPrice - advanceAmount).toFixed(2));

  const handleBook = async () => {
  if (!form.name || !form.phone || !form.date || !form.time || !selectedString) {
    setBookingError("Please select an available string, date, and time slot.");
    return;
  }
  setBookingError("");
  try {
    await addDoc(collection(db, "bookings"), {
      type: "stringing",
      name: form.name,
      phone: form.phone,
      date: form.date,
      time: form.time,
      notes: form.notes,
      string: selectedString ? selectedString.name : "To be selected in-store",
      tension: tension,
      totalPrice,
      advanceAmount,
      balanceAmount,
      paymentStatus: "Pending Payment",
      status: "Pending Payment",
      createdAt: new Date().toISOString(),
    });
  } catch (e) {  console.error("BOOKING SAVE ERROR:", e.code, e.message);
  setBookingError(`${e.code || "Error"}: ${e.message}`);
  return;
}
  setSubmitted(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  if (submitted) {
    return (
      <div style={pg.successPage}>
        <div style={pg.successBox}>
          <div style={pg.successIcon}></div>
          <h2 style={pg.successTitle}>Booking Request Received</h2>
          <p style={pg.successSub}>
            Thank you, <strong>{form.name}</strong>! Your racket stringing request is saved for{" "}
            <strong>{form.date}</strong> at <strong>{form.time || "your preferred time"}</strong>.
          </p>
          <div style={pg.successDetails}>
            <div style={pg.successRow}>
              <span>String</span>
              <span>{selectedString ? selectedString.name : "To be selected in-store"}</span>
            </div>
            <div style={pg.successRow}>
              <span>Tension</span>
              <span>{tension} lbs</span>
            </div>
            <div style={pg.successRow}>
              <span>Estimated Total</span>
              <span style={{ color: "#00FF9C", fontWeight: "700" }}>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div style={pg.successRow}><span>50% advance (online)</span><span>₹{advanceAmount.toFixed(2)}</span></div>
            <div style={pg.successRow}><span>Balance at shop</span><span>₹{balanceAmount.toFixed(2)}</span></div>
          </div>
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "28px" }}>
            Payment gateway is not connected yet. Your request is pending payment and is not confirmed. We'll contact you on <strong>{form.phone}</strong>.
          </p>
          <button onClick={() => navigate("/")} style={pg.homeBtn}>← Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={pg.page}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div style={pg.hero}>
        <div style={pg.heroOverlay} />
        <div style={pg.heroContent}>
          <div style={pg.heroBadge}>PROFESSIONAL SERVICE</div>
          <h1 style={pg.heroTitle}>Racket Stringing</h1>
          <p style={pg.heroSub}>
            Computer-assisted precision stringing by certified professionals.<br />
            Get the perfect tension for your playing style.
          </p>
          <div style={pg.heroStats}>
            {[
              { num: "5000+", label: "Rackets Strung" },
              { num: "±0.5 lbs", label: "Tension Accuracy" },
              { num: "2–4 hrs", label: "Turnaround" },
              { num: "20+", label: "String Brands" },
            ].map((stat, i) => (
              <div key={i} style={pg.stat}>
                <div style={pg.statNum}>{stat.num}</div>
                <div style={pg.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={pg.body}>

        {/* ── PROCESS ────────────────────────────────────── */}
        <section style={pg.section}>
          <div style={pg.sectionBadge}>HOW IT WORKS</div>
          <h2 style={pg.sectionTitle}>Our Stringing Process</h2>
          <p style={pg.sectionSub}>Professional 5-step process ensuring quality every time</p>

          <div style={pg.processTrack}>
            {process.map((p, i) => (
              <div key={i} style={pg.processCard}>
                <div style={pg.processStep}>{p.step}</div>
                <h3 style={pg.processTitle}>{p.title}</h3>
                <p style={pg.processDesc}>{p.desc}</p>
                {i < process.length - 1 && <div style={pg.processArrow}>→</div>}
              </div>
            ))}
          </div>
        </section>

        {/* ── TENSION GUIDE ──────────────────────────────── */}
        <section style={{ ...pg.section, background: "#0d0d0d", padding: "60px 40px", borderRadius: "20px", marginBottom: "60px" }}>
          <div style={pg.sectionBadge}>TENSION GUIDE</div>
          <h2 style={{ ...pg.sectionTitle, color: "#fff" }}>Choose Your Tension</h2>
          <p style={{ ...pg.sectionSub, color: "#555" }}>Lower tension = more power. Higher tension = more control.</p>

          <div style={pg.tensionGrid}>
            {tensionGuide.map((t, i) => (
              <div key={i} style={{ ...pg.tensionCard, borderColor: t.color + "33" }}>
                <div style={{ ...pg.tensionDot, background: t.color }} />
                <div style={{ ...pg.tensionRange, color: t.color }}>{t.range}</div>
                <div style={pg.tensionLabel}>{t.label}</div>
                <div style={pg.tensionDesc}>{t.desc}</div>
              </div>
            ))}
          </div>

          <div style={pg.sliderWrap}>
            <div style={pg.sliderLabel}>
              <span style={{ color: "#888" }}>Select your tension:</span>
              <span style={{ color: "#00FF9C", fontWeight: "800", fontSize: "22px" }}>{tension} lbs</span>
            </div>
            <input
              type="range"
              min={18}
              max={32}
              step={1}
              value={tension}
              onChange={(e) => setTension(Number(e.target.value))}
              style={pg.slider}
            />
            <div style={pg.sliderEnds}>
              <span>18 lbs (Beginner)</span>
              <span>32 lbs (Pro)</span>
            </div>
          </div>
        </section>

        {/* ── STRING CATALOGUE ───────────────────────────── */}
        <section style={pg.section}>
          <div style={pg.sectionBadge}>STRING CATALOGUE</div>
          <h2 style={pg.sectionTitle}>Choose Your String</h2>
          <p style={pg.sectionSub}>Choose from badminton strings currently in stock in the store catalogue.</p>

          {stringsLoading && <p style={pg.sectionSub}>Loading available strings…</p>}
          {stringsError && <p role="alert" style={{ ...pg.sectionSub, color: "#ff6b6b" }}>{stringsError}</p>}
          {!stringsLoading && !stringsError && availableStrings.length === 0 && (
            <p style={pg.sectionSub}>No in-stock products were found in the Strings category. Please check product category and stock in the admin catalogue.</p>
          )}

          <div style={pg.stringGrid}>
            {availableStrings.map((str) => (
              <div
                key={str.id}
                onClick={() => setSelectedString(selectedString?.id === str.id ? null : str)}
                style={{
                  ...pg.stringCard,
                  border: selectedString?.id === str.id
                    ? `2px solid ${str.color}`
                    : "2px solid #1e1e1e",
                  boxShadow: selectedString?.id === str.id
                    ? `0 0 20px ${str.color}22`
                    : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ ...pg.stringTag, background: str.color + "22", color: str.color, border: `1px solid ${str.color}44` }}>
                    {str.tag}
                  </span>
                  {selectedString?.id === str.id && (
                    <span style={pg.selectedTick}>✓</span>
                  )}
                </div>

                <div style={{ ...pg.stringAccent, background: str.color }} />

                <h3 style={pg.stringName}>{str.name}</h3>
                <p style={pg.stringBrand}>{str.brand}</p>

                <div style={pg.stringMeta}>
                  <span style={pg.stringMetaItem}> {str.type}</span>
                  <span style={pg.stringMetaItem}> {str.feel}</span>
                  <span style={pg.stringMetaItem}> {str.gauge}</span>
                </div>

                <p style={pg.stringBestFor}>Best for: {str.bestFor}</p>

                <div style={pg.stringPrice}>₹{str.price}</div>
              </div>
            ))}
          </div>

          {selectedString && (
            <div style={pg.selectionSummary}>
              <span>✓ Selected: <strong>{selectedString.name}</strong></span>
              <span>String: ₹{selectedString.price} + Labor: ₹150 =</span>
              <span style={{ color: "#00FF9C", fontWeight: "800", fontSize: "18px" }}>Total: ₹{selectedString.price + 150}</span>
            </div>
          )}
        </section>

        {/* ── BOOKING FORM ───────────────────────────────── */}
        <section style={pg.section}>
          <div style={pg.sectionBadge}>BOOK APPOINTMENT</div>
          <h2 style={pg.sectionTitle}>Schedule Your Stringing</h2>
          <p style={pg.sectionSub}>Pre-book to skip the queue. Walk-ins also welcome.</p>

          <div style={pg.formLayout}>
            <div style={pg.formCard}>
              <h3 style={pg.formCardTitle}>Your Details</h3>

              <div style={pg.formGroup}>
                <label style={pg.formLabel}>Full Name *</label>
                <input
                  style={pg.formInput}
                  placeholder="e.g. Arjun Kumar"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div style={pg.formGroup}>
                <label style={pg.formLabel}>Phone Number *</label>
                <input
                  style={pg.formInput}
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div style={pg.formRow}>
                <div style={{ ...pg.formGroup, flex: 1 }}>
                  <label style={pg.formLabel}>Preferred Date *</label>
                  <input
                    type="date"
                    style={pg.formInput}
                    value={form.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div style={{ ...pg.formGroup, flex: 1 }}>
                  <label style={pg.formLabel}>Preferred Time *</label>
                  <select
                    style={pg.formSelect}
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  >
                    <option value="">Select time *</option>
                    {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={pg.formGroup}>
                <label style={pg.formLabel}>Special Notes</label>
                <textarea
                  style={{ ...pg.formInput, height: "80px", resize: "vertical" }}
                  placeholder="Any specific requirements, racket model, or preferences..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>

            {/* Booking Summary */}
            <div style={pg.bookingSummary}>
              <h3 style={pg.summaryTitle}>Booking Summary</h3>

              <div style={pg.summaryItem}>
                <span style={pg.summaryKey}>String</span>
                <span style={pg.summaryVal}>
                  {selectedString ? selectedString.name : <span style={{ color: "#555", fontStyle: "italic" }}>Not selected yet</span>}
                </span>
              </div>
              <div style={pg.summaryItem}>
                <span style={pg.summaryKey}>Tension</span>
                <span style={{ ...pg.summaryVal, color: "#00FF9C" }}>{tension} lbs</span>
              </div>
              <div style={pg.summaryItem}>
                <span style={pg.summaryKey}>Labor</span>
                <span style={pg.summaryVal}>₹150</span>
              </div>
              {selectedString && (
                <div style={pg.summaryItem}>
                  <span style={pg.summaryKey}>String Cost</span>
                  <span style={pg.summaryVal}>₹{selectedString.price}</span>
                </div>
              )}
              <div style={pg.summaryDivider} />
              <div style={{ ...pg.summaryItem, fontSize: "18px", fontWeight: "800" }}>
                <span>Estimated Total</span>
                <span style={{ color: "#00FF9C" }}>₹{totalPrice}</span>
              </div>

              <div style={pg.summaryItem}><span style={pg.summaryKey}>50% Advance</span><span style={{ ...pg.summaryVal, color: "#00FF9C" }}>₹{advanceAmount.toFixed(2)}</span></div>
              <div style={pg.summaryItem}><span style={pg.summaryKey}>Balance at shop</span><span style={pg.summaryVal}>₹{balanceAmount.toFixed(2)}</span></div>
              <div style={pg.summaryNote}>Online payment is not integrated yet. Booking remains pending payment until a real payment is verified.</div>
              {bookingError && <p role="alert" style={{ color: "#ff6b6b", fontSize: "12px" }}>{bookingError}</p>}

              <button
                onClick={handleBook}
                disabled={!form.name || !form.phone || !form.date || !form.time || !selectedString}
                style={{
                  ...pg.bookBtn,
                  opacity: (!form.name || !form.phone || !form.date || !form.time || !selectedString) ? 0.5 : 1,
                  cursor: (!form.name || !form.phone || !form.date || !form.time || !selectedString) ? "not-allowed" : "pointer",
                }}
              >
                Confirm Booking →
              </button>

              <div style={pg.trustRow}>
                <span style={pg.trustItem}> Same-day service</span>
                <span style={pg.trustItem}> Call to confirm</span>
                <span style={pg.trustItem}> Free re-string if faulty</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────── */}
        <section style={{ ...pg.section, marginBottom: "0" }}>
          <div style={pg.sectionBadge}>FAQ</div>
          <h2 style={pg.sectionTitle}>Frequently Asked Questions</h2>

          <div style={pg.faqList}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{ ...pg.faqItem, borderColor: openFaq === i ? "#00FF9C33" : "#1e1e1e" }}
              >
                <button
                  style={pg.faqQ}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span style={{ ...pg.faqArrow, transform: openFaq === i ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                </button>
                {openFaq === i && (
                  <p style={pg.faqA}>{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

// ── STYLES ───────────────────────────────────────────────────
const pg = {
  page: { background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#fff" },

  // Hero
  hero: {
    position: "relative",
    background: "linear-gradient(135deg, #0a0a0a 0%, #0f2027 50%, #0a0a0a 100%)",
    padding: "80px 40px 60px",
    borderBottom: "1px solid #1a1a1a",
    overflow: "hidden",
  },
  heroOverlay: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse at 60% 50%, rgba(0,255,156,0.06) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroContent: { position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto", textAlign: "center" },
  heroBadge: {
    display: "inline-block", fontSize: "11px", fontWeight: "700", letterSpacing: "3px",
    color: "#00FF9C", border: "1px solid #00FF9C", borderRadius: "999px",
    padding: "5px 16px", marginBottom: "20px",
  },
  heroTitle: { fontSize: "52px", fontWeight: "900", margin: "0 0 16px", letterSpacing: "-1px", lineHeight: 1.1 },
  heroSub: { fontSize: "17px", color: "#888", lineHeight: 1.8, margin: "0 0 40px" },
  heroStats: { display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" },
  stat: { textAlign: "center" },
  statNum: { fontSize: "28px", fontWeight: "800", color: "#00FF9C" },
  statLabel: { fontSize: "12px", color: "#666", marginTop: "4px", letterSpacing: "0.5px" },

  // Body
  body: { maxWidth: "1100px", margin: "0 auto", padding: "60px 20px 80px" },
  section: { marginBottom: "80px" },
  sectionBadge: {
    display: "inline-block", fontSize: "11px", fontWeight: "700", letterSpacing: "3px",
    color: "#00FF9C", border: "1px solid #00FF9C33", borderRadius: "999px",
    padding: "4px 14px", marginBottom: "14px",
  },
  sectionTitle: { fontSize: "32px", fontWeight: "800", margin: "0 0 8px", color: "#fff" },
  sectionSub: { fontSize: "15px", color: "#666", marginBottom: "36px" },

  // Process
  processTrack: { display: "flex", gap: "0", overflowX: "auto", paddingBottom: "10px" },
  processCard: {
    flex: "1", minWidth: "180px", background: "#111", borderRadius: "16px",
    padding: "24px 20px", border: "1px solid #1e1e1e", position: "relative", marginRight: "8px",
  },
  processStep: {
    fontSize: "36px", fontWeight: "900", color: "#00FF9C", opacity: 0.3,
    lineHeight: 1, marginBottom: "12px",
  },
  processTitle: { fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "8px" },
  processDesc: { fontSize: "13px", color: "#666", lineHeight: 1.7 },
  processArrow: {
    position: "absolute", right: "-16px", top: "50%", transform: "translateY(-50%)",
    color: "#00FF9C", fontSize: "20px", zIndex: 2,
  },

  // Tension
  tensionGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "36px" },
  tensionCard: {
    background: "#111", borderRadius: "14px", padding: "20px",
    border: "1px solid", transition: "all 0.2s",
  },
  tensionDot: { width: "10px", height: "10px", borderRadius: "50%", marginBottom: "12px" },
  tensionRange: { fontSize: "16px", fontWeight: "800", marginBottom: "4px" },
  tensionLabel: { fontSize: "13px", fontWeight: "600", color: "#ccc", marginBottom: "6px" },
  tensionDesc: { fontSize: "12px", color: "#666", lineHeight: 1.6 },
  sliderWrap: { background: "#111", borderRadius: "16px", padding: "28px 32px" },
  sliderLabel: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  slider: { width: "100%", accentColor: "#00FF9C", height: "6px", cursor: "pointer" },
  sliderEnds: { display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#555", marginTop: "8px" },

  // Strings
  stringGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" },
  stringCard: {
    background: "#111", borderRadius: "16px", padding: "20px",
    cursor: "pointer", transition: "all 0.2s", position: "relative",
  },
  stringTag: {
    fontSize: "10px", fontWeight: "700", letterSpacing: "1px",
    padding: "3px 10px", borderRadius: "999px", textTransform: "uppercase",
  },
  selectedTick: {
    background: "#00FF9C", color: "#000", borderRadius: "50%",
    width: "20px", height: "20px", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "11px", fontWeight: "800",
  },
  stringAccent: { height: "3px", borderRadius: "999px", margin: "12px 0", width: "40px" },
  stringName: { fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "2px" },
  stringBrand: { fontSize: "12px", color: "#555", marginBottom: "12px" },
  stringMeta: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" },
  stringMetaItem: { fontSize: "11px", color: "#888", background: "#1a1a1a", padding: "3px 8px", borderRadius: "6px" },
  stringBestFor: { fontSize: "12px", color: "#666", marginBottom: "14px" },
  stringPrice: { fontSize: "20px", fontWeight: "800", color: "#00FF9C" },
  selectionSummary: {
    background: "#0d1f14", border: "1px solid #00FF9C33", borderRadius: "12px",
    padding: "16px 24px", display: "flex", justifyContent: "space-between",
    alignItems: "center", flexWrap: "wrap", gap: "12px", color: "#ccc", fontSize: "14px",
  },

  // Form
  formLayout: { display: "grid", gridTemplateColumns: "1fr 360px", gap: "28px", alignItems: "start" },
  formCard: { background: "#111", borderRadius: "20px", padding: "32px", border: "1px solid #1e1e1e" },
  formCardTitle: { fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "24px" },
  formGroup: { marginBottom: "18px" },
  formRow: { display: "flex", gap: "16px" },
  formLabel: { display: "block", fontSize: "12px", fontWeight: "600", color: "#888", marginBottom: "8px", letterSpacing: "0.5px", textTransform: "uppercase" },
  formInput: {
    width: "100%", padding: "12px 14px", background: "#1a1a1a",
    border: "1px solid #2a2a2a", borderRadius: "10px", color: "#fff",
    fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "'Inter', sans-serif",
  },
  formSelect: {
    width: "100%", padding: "12px 14px", background: "#1a1a1a",
    border: "1px solid #2a2a2a", borderRadius: "10px", color: "#fff",
    fontSize: "14px", outline: "none", cursor: "pointer",
  },

  // Booking summary
  bookingSummary: {
    background: "#111", borderRadius: "20px", padding: "28px",
    border: "1px solid #1e1e1e", position: "sticky", top: "100px",
  },
  summaryTitle: { fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "20px" },
  summaryItem: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "14px" },
  summaryKey: { color: "#666" },
  summaryVal: { color: "#ccc", fontWeight: "600" },
  summaryDivider: { height: "1px", background: "#1e1e1e", margin: "16px 0" },
  summaryNote: { fontSize: "12px", color: "#444", textAlign: "center", margin: "12px 0 20px", lineHeight: 1.6 },
  bookBtn: {
    width: "100%", padding: "14px", background: "#00FF9C", color: "#000",
    border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800",
    transition: "all 0.2s", marginBottom: "16px",
  },
  trustRow: { display: "flex", flexDirection: "column", gap: "8px" },
  trustItem: { fontSize: "12px", color: "#555", display: "flex", alignItems: "center", gap: "6px" },

  // FAQ
  faqList: { display: "flex", flexDirection: "column", gap: "8px" },
  faqItem: { background: "#111", borderRadius: "12px", border: "1px solid", overflow: "hidden", transition: "border-color 0.2s" },
  faqQ: {
    width: "100%", padding: "18px 20px", background: "none", border: "none",
    color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer",
    display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", textAlign: "left",
  },
  faqArrow: { color: "#00FF9C", fontSize: "12px", transition: "transform 0.2s", flexShrink: 0 },
  faqA: { padding: "0 20px 18px", fontSize: "13px", color: "#777", lineHeight: 1.8, margin: 0 },

  // Success
  successPage: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", padding: "40px 20px" },
  successBox: { background: "#111", borderRadius: "24px", padding: "48px 40px", maxWidth: "480px", width: "100%", textAlign: "center", border: "1px solid #1e1e1e" },
  successIcon: { width: "72px", height: "72px", borderRadius: "50%", background: "#00FF9C", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "800", margin: "0 auto 20px" },
  successTitle: { fontSize: "28px", fontWeight: "800", color: "#fff", marginBottom: "12px" },
  successSub: { fontSize: "15px", color: "#888", lineHeight: 1.8, marginBottom: "24px" },
  successDetails: { background: "#0d0d0d", borderRadius: "12px", padding: "20px", marginBottom: "20px" },
  successRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#888", marginBottom: "10px" },
  homeBtn: {
    padding: "13px 32px", background: "#00FF9C", color: "#000",
    border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer",
  },
};
