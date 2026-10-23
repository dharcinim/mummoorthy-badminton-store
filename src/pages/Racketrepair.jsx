import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const repairTypes = [
  { id: 1,  title: "Grommet Replacement", desc: "Worn or cracked grommets replaced to protect your strings.", price: 80, time: "30 min" },
  { id: 2,  title: "Grip Replacement", desc: "Old grip removed and replaced with fresh premium grip tape.", price: 120, time: "15 min" },
  { id: 3,  title: "Frame Crack Repair", desc: "Minor frame cracks sealed and reinforced using epoxy.", price: 350, time: "2–3 hrs" },
  { id: 4,  title: "Cap Guard Fix", desc: "Loose or broken cap guard replaced or re-glued.", price: 60, time: "20 min" },
  { id: 5,  title: "String Bed Replacement", desc: "Complete re-stringing after frame repair.", price: 299, time: "2–4 hrs" },
  { id: 6,  title: "Full Racket Service", desc: "Complete inspection + grommet + grip + cleaning.", price: 499, time: "Same day" },
];

const faqs = [
  { q: "Can a cracked frame be fixed?", a: "Minor hairline cracks can be repaired with epoxy and reinforcement. Severe structural cracks or broken frames are usually not repairable and we'll advise you honestly." },
  { q: "How do I know if my racket needs repair?", a: "Signs include: unusual vibrations, visible cracks, loose grommets, worn grip, or strings breaking too quickly. Bring it in for a free inspection." },
  { q: "Do you repair all brands?", a: "Yes — we repair Yonex, Li-Ning, Victor, Apacs, Kawasaki, and all other brands regardless of where you purchased it." },
  { q: "What if the repair isn't possible?", a: "We'll let you know before doing any work. You won't be charged for inspections on unrepair-able rackets." },
];

export default function RacketRepair() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const toggle = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const selectedItems = repairTypes.filter((r) => selected.includes(r.id));
  const total = selectedItems.reduce((s, r) => s + r.price, 0);
  const advanceAmount = Number((total * 0.5).toFixed(2));
  const balanceAmount = Number((total - advanceAmount).toFixed(2));

  const handleBook = async () => {
  if (!form.name || !form.phone || !form.date || !form.time || selectedItems.length === 0) {
    setBookingError("Please select at least one repair, date, and time slot.");
    return;
  }
  setBookingError("");
  try {
    await addDoc(collection(db, "bookings"), {
      type: "repair",
      name: form.name,
      phone: form.phone,
      date: form.date,
      time: form.time,
      notes: form.notes,
      services: selectedItems.map((i) => i.title),
      total,
      advanceAmount,
      balanceAmount,
      paymentStatus: "Pending Payment",
      status: "Pending Payment",
      createdAt: new Date().toISOString(),
    });
  } catch (e) { console.error(e); setBookingError("We could not save your booking. Please try again."); return; }
  setSubmitted(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  if (submitted) {
    return (
      <div style={pg.successPage}>
        <div style={pg.successBox}>
          <div style={pg.successIcon}>✓</div>
          <h2 style={pg.successTitle}>Repair Request Received</h2>
          <p style={pg.successSub}>
            Hi <strong>{form.name}</strong>! Your repair request is for <strong>{form.date}</strong> at <strong>{form.time}</strong>.
            This request is pending payment; the appointment is not confirmed yet.
          </p>
          {selectedItems.length > 0 && (
            <div style={pg.successDetails}>
              {selectedItems.map((item) => (
                <div key={item.id} style={pg.successRow}>
                  <span>{item.title}</span>
                  <span style={{ color: "#00FF9C" }}>₹{item.price}</span>
                </div>
              ))}
              <div style={{ ...pg.successRow, borderTop: "1px solid #222", paddingTop: "10px", marginTop: "4px", fontWeight: "800", fontSize: "16px" }}>
                <span>Estimated Total</span>
                <span style={{ color: "#00FF9C" }}>₹{total.toFixed(2)}</span>
              </div>
              <div style={pg.successRow}><span>50% advance (online)</span><span style={{ color: "#00FF9C" }}>₹{advanceAmount.toFixed(2)}</span></div>
              <div style={pg.successRow}><span>Balance at shop</span><span>₹{balanceAmount.toFixed(2)}</span></div>
            </div>
          )}
          <p style={{ color: "#888", fontSize: "13px" }}>Online payment is not integrated yet. We will contact you to confirm next steps.</p>
          <button onClick={() => navigate("/")} style={pg.homeBtn}>← Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={pg.page}>
      {/* HERO */}
      <div style={pg.hero}>
        <div style={pg.heroOverlay} />
        <div style={pg.heroContent}>
          <div style={pg.heroBadge}>EXPERT REPAIR SERVICE</div>
          <h1 style={pg.heroTitle}>Racket Repair</h1>
          <p style={pg.heroSub}>
            Bring your racket back to life. Our certified technicians fix frames,
            grips, grommets, and more — quickly and affordably.
          </p>
          <div style={pg.heroStats}>
            {[
              { num: "2000+", label: "Rackets Repaired" },
              { num: "Free", label: "Inspection" },
              { num: "Same Day", label: "Most Repairs" },
              { num: "All Brands", label: "Supported" },
            ].map((s, i) => (
              <div key={i} style={pg.stat}>
                <div style={pg.statNum}>{s.num}</div>
                <div style={pg.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={pg.body}>
        {/* REPAIR TYPES */}
        <section style={pg.section}>
          <div style={pg.sectionBadge}>REPAIR MENU</div>
          <h2 style={pg.sectionTitle}>Select Repair Services</h2>
          <p style={pg.sectionSub}>Select what you need — or bring the racket in for a free diagnosis.</p>

          <div style={pg.repairGrid}>
            {repairTypes.map((r) => (
              <div
                key={r.id}
                onClick={() => toggle(r.id)}
                style={{
                  ...pg.repairCard,
                  border: selected.includes(r.id) ? "2px solid #00FF9C" : "2px solid #1e1e1e",
                  background: selected.includes(r.id) ? "#0d1f14" : "#111",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={pg.repairIcon}>{r.icon}</span>
                  {selected.includes(r.id) && <span style={pg.tick}>✓</span>}
                </div>
                <h3 style={pg.repairTitle}>{r.title}</h3>
                <p style={pg.repairDesc}>{r.desc}</p>
                <div style={pg.repairFooter}>
                  <span style={pg.repairPrice}>₹{r.price}</span>
                  <span style={pg.repairTime}>⏱ {r.time}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedItems.length > 0 && (
            <div style={pg.selectionBar}>
              <span>{selectedItems.length} service{selectedItems.length > 1 ? "s" : ""} selected</span>
              <span style={{ color: "#00FF9C", fontWeight: "800" }}>Estimated: ₹{total}</span>
            </div>
          )}
        </section>

        {/* BOOKING */}
        <section style={pg.section}>
          <div style={pg.sectionBadge}>BOOK REPAIR</div>
          <h2 style={pg.sectionTitle}>Schedule Drop-off</h2>

          <div style={pg.formLayout}>
            <div style={pg.formCard}>
              <div style={pg.formGroup}>
                <label style={pg.formLabel}>Full Name *</label>
                <input style={pg.formInput} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={pg.formGroup}>
                <label style={pg.formLabel}>Phone Number *</label>
                <input style={pg.formInput} placeholder="Mobile number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div style={pg.formGroup}>
                <label style={pg.formLabel}>Drop-off Date *</label>
                <input type="date" style={pg.formInput} value={form.date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div style={pg.formGroup}>
                <label style={pg.formLabel}>Preferred Time *</label>
                <select style={pg.formInput} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
                  <option value="">Select time</option>
                  {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={pg.formGroup}>
                <label style={pg.formLabel}>Describe the Problem</label>
                <textarea style={{ ...pg.formInput, height: "90px", resize: "vertical" }} placeholder="e.g. cracked frame near throat, broken grommet on 3rd row..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>

            <div style={pg.bookingSummary}>
              <h3 style={pg.summaryTitle}>Service Summary</h3>
              {selectedItems.length === 0 ? (
                <p style={{ color: "#444", fontSize: "13px", marginBottom: "16px" }}>No services selected yet.<br />Select above or we'll diagnose in-store.</p>
              ) : (
                selectedItems.map((item) => (
                  <div key={item.id} style={pg.summaryItem}>
                    <span style={pg.summaryKey}>{item.icon} {item.title}</span>
                    <span style={pg.summaryVal}>₹{item.price}</span>
                  </div>
                ))
              )}
              <div style={pg.summaryDivider} />
              <div style={{ ...pg.summaryItem, fontWeight: "800", fontSize: "16px" }}>
                <span>Estimated Total</span>
                <span style={{ color: "#00FF9C" }}>₹{total || "Free inspection"}</span>
              </div>
              <div style={pg.summaryItem}><span style={pg.summaryKey}>50% Advance</span><span style={{ ...pg.summaryVal, color: "#00FF9C" }}>₹{advanceAmount.toFixed(2)}</span></div>
              <div style={pg.summaryItem}><span style={pg.summaryKey}>Balance at shop</span><span style={pg.summaryVal}>₹{balanceAmount.toFixed(2)}</span></div>
              <div style={pg.summaryNote}>Payment gateway is not integrated yet. Booking remains pending payment.</div>
              {bookingError && <p role="alert" style={{ color: "#ff6b6b", fontSize: "12px" }}>{bookingError}</p>}
              <button
                onClick={handleBook}
                disabled={!form.name || !form.phone || !form.date || !form.time || selectedItems.length === 0}
                style={{ ...pg.bookBtn, opacity: (!form.name || !form.phone || !form.date || !form.time || selectedItems.length === 0) ? 0.5 : 1, cursor: (!form.name || !form.phone || !form.date || !form.time || selectedItems.length === 0) ? "not-allowed" : "pointer" }}
              >
                Book Repair Drop-off →
              </button>
              <div style={pg.trustRow}>
                <span style={pg.trustItem}> ✓ Free inspection</span>
                <span style={pg.trustItem}> ✓ No fix, no charge</span>
                <span style={pg.trustItem}> ✓ 30-day repair warranty</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ ...pg.section, marginBottom: 0 }}>
          <div style={pg.sectionBadge}>FAQ</div>
          <h2 style={pg.sectionTitle}>Common Questions</h2>
          <div style={pg.faqList}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ ...pg.faqItem, borderColor: openFaq === i ? "#00FF9C33" : "#1e1e1e" }}>
                <button style={pg.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span style={{ ...pg.faqArrow, transform: openFaq === i ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                </button>
                {openFaq === i && <p style={pg.faqA}>{faq.a}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const pg = {
  page: { background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#fff" },
  hero: { position: "relative", background: "linear-gradient(135deg, #0a0a0a 0%, #1a0f0f 50%, #0a0a0a 100%)", padding: "80px 40px 60px", borderBottom: "1px solid #1a1a1a", overflow: "hidden" },
  heroOverlay: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 50%, rgba(255,100,0,0.05) 0%, transparent 70%)", pointerEvents: "none" },
  heroContent: { position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto", textAlign: "center" },
  heroBadge: { display: "inline-block", fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#FF6B35", border: "1px solid #FF6B35", borderRadius: "999px", padding: "5px 16px", marginBottom: "20px" },
  heroTitle: { fontSize: "52px", fontWeight: "900", margin: "0 0 16px", letterSpacing: "-1px", lineHeight: 1.1 },
  heroSub: { fontSize: "17px", color: "#888", lineHeight: 1.8, margin: "0 0 40px" },
  heroStats: { display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" },
  stat: { textAlign: "center" },
  statNum: { fontSize: "28px", fontWeight: "800", color: "#FF6B35" },
  statLabel: { fontSize: "12px", color: "#666", marginTop: "4px" },
  body: { maxWidth: "1100px", margin: "0 auto", padding: "60px 20px 80px" },
  section: { marginBottom: "80px" },
  sectionBadge: { display: "inline-block", fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#FF6B35", border: "1px solid #FF6B3533", borderRadius: "999px", padding: "4px 14px", marginBottom: "14px" },
  sectionTitle: { fontSize: "32px", fontWeight: "800", margin: "0 0 8px", color: "#fff" },
  sectionSub: { fontSize: "15px", color: "#666", marginBottom: "36px" },
  repairGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" },
  repairCard: { borderRadius: "16px", padding: "22px", cursor: "pointer", transition: "all 0.2s" },
  repairIcon: { fontSize: "13px", fontWeight: "800", color: "#FF6B35", background: "#FF6B3515", padding: "6px 10px", borderRadius: "8px", marginBottom: "12px", display: "inline-block", letterSpacing: "0.5px" },
  tick: { background: "#00FF9C", color: "#000", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800" },
  repairTitle: { fontSize: "15px", fontWeight: "700", color: "#fff", marginBottom: "6px" },
  repairDesc: { fontSize: "12px", color: "#666", lineHeight: 1.7, marginBottom: "14px" },
  repairFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  repairPrice: { fontSize: "18px", fontWeight: "800", color: "#FF6B35" },
  repairTime: { fontSize: "12px", color: "#555" },
  selectionBar: { background: "#0d1f14", border: "1px solid #00FF9C33", borderRadius: "10px", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#ccc", fontSize: "14px" },
  formLayout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px", alignItems: "start" },
  formCard: { background: "#111", borderRadius: "20px", padding: "32px", border: "1px solid #1e1e1e" },
  formGroup: { marginBottom: "18px" },
  formLabel: { display: "block", fontSize: "12px", fontWeight: "600", color: "#888", marginBottom: "8px", letterSpacing: "0.5px", textTransform: "uppercase" },
  formInput: { width: "100%", padding: "12px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" },
  bookingSummary: { background: "#111", borderRadius: "20px", padding: "28px", border: "1px solid #1e1e1e", position: "sticky", top: "100px" },
  summaryTitle: { fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "20px" },
  summaryItem: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "14px" },
  summaryKey: { color: "#666" },
  summaryVal: { color: "#ccc", fontWeight: "600" },
  summaryDivider: { height: "1px", background: "#1e1e1e", margin: "16px 0" },
  summaryNote: { fontSize: "12px", color: "#444", textAlign: "center", margin: "12px 0 20px", lineHeight: 1.6 },
  bookBtn: { width: "100%", padding: "14px", background: "#FF6B35", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", transition: "all 0.2s", marginBottom: "16px" },
  trustRow: { display: "flex", flexDirection: "column", gap: "8px" },
  trustItem: { fontSize: "12px", color: "#555" },
  faqList: { display: "flex", flexDirection: "column", gap: "8px" },
  faqItem: { background: "#111", borderRadius: "12px", border: "1px solid", overflow: "hidden", transition: "border-color 0.2s" },
  faqQ: { width: "100%", padding: "18px 20px", background: "none", border: "none", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", textAlign: "left" },
  faqArrow: { color: "#FF6B35", fontSize: "12px", transition: "transform 0.2s", flexShrink: 0 },
  faqA: { padding: "0 20px 18px", fontSize: "13px", color: "#777", lineHeight: 1.8, margin: 0 },
  successPage: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", padding: "40px 20px" },
  successBox: { background: "#111", borderRadius: "24px", padding: "48px 40px", maxWidth: "480px", width: "100%", textAlign: "center", border: "1px solid #1e1e1e" },
  successIcon: { width: "72px", height: "72px", borderRadius: "50%", background: "#FF6B35", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "800", margin: "0 auto 20px" },
  successTitle: { fontSize: "28px", fontWeight: "800", color: "#fff", marginBottom: "12px" },
  successSub: { fontSize: "15px", color: "#888", lineHeight: 1.8, marginBottom: "24px" },
  successDetails: { background: "#0d0d0d", borderRadius: "12px", padding: "20px", marginBottom: "20px" },
  successRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#888", marginBottom: "10px" },
  homeBtn: { padding: "13px 32px", background: "#FF6B35", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer" },
};
