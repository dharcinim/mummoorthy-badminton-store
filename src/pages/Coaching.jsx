import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const plans = [
  {
    id: 1,
    name: "Beginner",
    tag: "Start Here",
    price: 999,
    per: "month",
    sessions: "8 sessions/month",
    duration: "60 min each",
    color: "#4CAF50",
    features: [
      "Basic footwork & stance",
      "Grip & swing technique",
      "Clear, drop, drive shots",
      "Court rules & scoring",
      "Group batch (4–6 players)",
      "Video feedback monthly",
    ],
  },
  {
    id: 2,
    name: "Intermediate",
    tag: "Most Popular",
    price: 1799,
    per: "month",
    sessions: "12 sessions/month",
    duration: "75 min each",
    color: "#00FF9C",
    popular: true,
    features: [
      "Advanced footwork drills",
      "Smash, net kill, lifts",
      "Multi-shuttle feeding",
      "Match play & analysis",
      "Small group (2–3 players)",
      "Weekly video breakdown",
      "Monthly progress report",
    ],
  },
  {
    id: 3,
    name: "Advanced",
    tag: "Competitive",
    price: 2999,
    per: "month",
    sessions: "16 sessions/month",
    duration: "90 min each",
    color: "#FF9800",
    features: [
      "Tournament preparation",
      "Tactical game planning",
      "Physical conditioning drills",
      "1-on-1 personalized coaching",
      "Video analysis every session",
      "Diet & fitness guidance",
      "Tournament entry support",
      "Priority slot booking",
    ],
  },
];

const coaches = [
  {
    name: "Arjun Krishnamurthy",
    title: "Head Coach",
    exp: "12 years",
    cert: "BAI Level 3 Certified",
    achievement: "State Champion 2015, 2017",
    
  },
  {
    name: "Priya Venkatesh",
    title: "Junior Coach",
    exp: "7 years",
    cert: "BAI Level 2 Certified",
    achievement: "District Champion 2019",
   
  },
  {
    name: "Rajan Subramanian",
    title: "Fitness Coach",
    exp: "9 years",
    cert: "NSCA Certified",
    achievement: "Ex-National Player",
    
  },
];

const faqs = [
  { q: "What age groups do you coach?", a: "We coach all ages from 6 years to 60+. Kids batches, adult batches, and senior batches are all available at different timings." },
  { q: "Do I need to bring my own equipment?", a: "For the first 2 trial sessions, we provide rackets and shuttles. After joining, you'll need your own racket. We'll help you pick the right one from our store." },
  { q: "Can I do a trial class before joining?", a: "Absolutely. We offer 1 free trial session. Just walk in or book a slot below. No commitment required." },
  { q: "What are the batch timings?", a: "Morning: 6–8 AM, Evening: 5–8 PM on weekdays. Weekends: 7 AM–12 PM. Specific batch allocation based on your level and availability." },
];

export default function Coaching() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", age: "", level: "beginner", date: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleBook = async () => {
  if (!form.name || !form.phone || !form.date) return;
  try {
    await addDoc(collection(db, "bookings"), {
      type: "coaching",
      name: form.name,
      phone: form.phone,
      age: form.age,
      level: form.level,
      date: form.date,
      plan: selectedPlan ? selectedPlan.name : "Not selected",
      monthlyFee: selectedPlan ? selectedPlan.price : 0,
      status: "Pending",
      createdAt: new Date().toISOString(),
    });
  } catch (e) { console.error(e); }
  setSubmitted(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  if (submitted) {
    return (
      <div style={pg.successPage}>
        <div style={pg.successBox}>
          <div style={pg.successIcon}>✓</div>
          <h2 style={pg.successTitle}>You're In!</h2>
          <p style={pg.successSub}>
            Welcome <strong>{form.name}</strong>! Your trial / enrollment session is scheduled for <strong>{form.date}</strong>.
            Our coach will call you on <strong>{form.phone}</strong>.
          </p>
          {selectedPlan && (
            <div style={pg.successDetails}>
              <div style={pg.successRow}>
                <span>Plan</span><span style={{ color: "#00FF9C" }}>{selectedPlan.name}</span>
              </div>
              <div style={pg.successRow}>
                <span>Monthly Fee</span><span style={{ color: "#00FF9C", fontWeight: "800" }}>₹{selectedPlan.price}/mo</span>
              </div>
            </div>
          )}
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
          <div style={pg.heroBadge}>PRO CERTIFIED COACHING</div>
          <h1 style={pg.heroTitle}>Badminton Coaching</h1>
          <p style={pg.heroSub}>
            Train with BAI-certified coaches. Build technique, speed, and match intelligence
            from beginner to competitive level.
          </p>
          <div style={pg.heroStats}>
            {[
              { num: "300+", label: "Active Students" },
              { num: "3", label: "Expert Coaches" },
              { num: "BAI", label: "Certified" },
              { num: "Free", label: "Trial Session" },
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

        {/* COACHES */}
        <section style={pg.section}>
          <div style={pg.sectionBadge}>MEET THE COACHES</div>
          <h2 style={pg.sectionTitle}>Learn From The Best</h2>
          <div style={pg.coachGrid}>
            {coaches.map((c, i) => (
              <div key={i} style={pg.coachCard}>
                <div style={pg.coachEmoji}>{c.initials}</div>
                <h3 style={pg.coachName}>{c.name}</h3>
                <div style={pg.coachTitle}>{c.title}</div>
                <div style={pg.coachMeta}>
                  <span style={pg.coachBadge}> {c.cert}</span>
                  <span style={pg.coachBadge}>⏱ {c.exp} experience</span>
                  <span style={pg.coachBadge}> {c.achievement}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PLANS */}
        <section style={pg.section}>
          <div style={pg.sectionBadge}>COACHING PLANS</div>
          <h2 style={pg.sectionTitle}>Choose Your Plan</h2>
          <p style={pg.sectionSub}>All plans include court access, shuttle supply, and coach feedback.</p>

          <div style={pg.planGrid}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}
                style={{
                  ...pg.planCard,
                  border: selectedPlan?.id === plan.id
                    ? `2px solid ${plan.color}`
                    : plan.popular ? `2px solid ${plan.color}55` : "2px solid #1e1e1e",
                  transform: plan.popular ? "scale(1.03)" : "scale(1)",
                  boxShadow: plan.popular ? `0 0 30px ${plan.color}15` : "none",
                }}
              >
                {plan.popular && (
                  <div style={{ ...pg.popularBadge, background: plan.color }}> Most Popular</div>
                )}
                <div style={{ ...pg.planTag, color: plan.color, borderColor: plan.color + "33", background: plan.color + "11" }}>
                  {plan.tag}
                </div>
                <h3 style={pg.planName}>{plan.name}</h3>
                <div style={pg.planPrice}>
                  <span style={{ ...pg.planAmount, color: plan.color }}>₹{plan.price}</span>
                  <span style={pg.planPer}>/{plan.per}</span>
                </div>
                <div style={pg.planSessions}>
                  <span> {plan.sessions}</span>
                  <span>⏱ {plan.duration}</span>
                </div>
                <div style={pg.planDivider} />
                <ul style={pg.planFeatures}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={pg.planFeature}>
                      <span style={{ color: plan.color }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                {selectedPlan?.id === plan.id && (
                  <div style={{ ...pg.selectedBadge, background: plan.color }}>Selected ✓</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ENROLLMENT FORM */}
        <section style={pg.section}>
          <div style={pg.sectionBadge}>ENROLL / TRIAL</div>
          <h2 style={pg.sectionTitle}>Book a Session</h2>
          <p style={pg.sectionSub}>First session is FREE. No commitment required.</p>

          <div style={pg.formLayout}>
            <div style={pg.formCard}>
              <div style={pg.formGroup}>
                <label style={pg.formLabel}>Full Name *</label>
                <input style={pg.formInput} placeholder="Player's name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={pg.formRow}>
                <div style={{ ...pg.formGroup, flex: 1 }}>
                  <label style={pg.formLabel}>Phone *</label>
                  <input style={pg.formInput} placeholder="Mobile number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div style={{ ...pg.formGroup, flex: 1 }}>
                  <label style={pg.formLabel}>Age</label>
                  <input style={pg.formInput} placeholder="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                </div>
              </div>
              <div style={pg.formRow}>
                <div style={{ ...pg.formGroup, flex: 1 }}>
                  <label style={pg.formLabel}>Current Level</label>
                  <select style={pg.formSelect} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="competitive">Competitive</option>
                  </select>
                </div>
                <div style={{ ...pg.formGroup, flex: 1 }}>
                  <label style={pg.formLabel}>Preferred Date *</label>
                  <input type="date" style={pg.formInput} value={form.date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
            </div>

            <div style={pg.bookingSummary}>
              <h3 style={pg.summaryTitle}>Enrollment Summary</h3>
              <div style={pg.summaryItem}>
                <span style={pg.summaryKey}>Plan</span>
                <span style={pg.summaryVal}>{selectedPlan ? selectedPlan.name : <span style={{ color: "#444", fontStyle: "italic" }}>Not selected</span>}</span>
              </div>
              <div style={pg.summaryItem}>
                <span style={pg.summaryKey}>Monthly Fee</span>
                <span style={{ ...pg.summaryVal, color: "#00FF9C", fontWeight: "800" }}>
                  {selectedPlan ? `₹${selectedPlan.price}/mo` : "—"}
                </span>
              </div>
              <div style={pg.summaryDivider} />
              <div style={pg.trialNote}>
                 <strong>First session FREE</strong><br />
                Come in, meet the coach, and decide if you want to enroll.
              </div>
              <button
                onClick={handleBook}
                disabled={!form.name || !form.phone || !form.date}
                style={{ ...pg.bookBtn, opacity: (!form.name || !form.phone || !form.date) ? 0.5 : 1, cursor: (!form.name || !form.phone || !form.date) ? "not-allowed" : "pointer" }}
              >
                Book Trial Session →
              </button>
              <div style={pg.trustRow}>
                <span style={pg.trustItem}> 1 free trial class</span>
                <span style={pg.trustItem}> No long-term lock-in</span>
                <span style={pg.trustItem}> Equipment provided</span>
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
  hero: { position: "relative", background: "linear-gradient(135deg, #0a0a0a 0%, #0a0f1a 50%, #0a0a0a 100%)", padding: "80px 40px 60px", borderBottom: "1px solid #1a1a1a", overflow: "hidden" },
  heroOverlay: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)", pointerEvents: "none" },
  heroContent: { position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto", textAlign: "center" },
  heroBadge: { display: "inline-block", fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#6366F1", border: "1px solid #6366F1", borderRadius: "999px", padding: "5px 16px", marginBottom: "20px" },
  heroTitle: { fontSize: "52px", fontWeight: "900", margin: "0 0 16px", letterSpacing: "-1px", lineHeight: 1.1 },
  heroSub: { fontSize: "17px", color: "#888", lineHeight: 1.8, margin: "0 0 40px" },
  heroStats: { display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" },
  stat: { textAlign: "center" },
  statNum: { fontSize: "28px", fontWeight: "800", color: "#6366F1" },
  statLabel: { fontSize: "12px", color: "#666", marginTop: "4px" },
  body: { maxWidth: "1100px", margin: "0 auto", padding: "60px 20px 80px" },
  section: { marginBottom: "80px" },
  sectionBadge: { display: "inline-block", fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#6366F1", border: "1px solid #6366F133", borderRadius: "999px", padding: "4px 14px", marginBottom: "14px" },
  sectionTitle: { fontSize: "32px", fontWeight: "800", margin: "0 0 8px", color: "#fff" },
  sectionSub: { fontSize: "15px", color: "#666", marginBottom: "36px" },
  coachGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
  coachCard: { background: "#111", borderRadius: "20px", padding: "28px 24px", border: "1px solid #1e1e1e", textAlign: "center" },
  coachEmoji: { width: "56px", height: "56px", borderRadius: "50%", background: "#6366F1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "16px", margin: "0 auto 14px", letterSpacing: "0.5px" },
  coachName: { fontSize: "17px", fontWeight: "700", color: "#fff", marginBottom: "4px" },
  coachTitle: { fontSize: "12px", color: "#6366F1", fontWeight: "600", marginBottom: "14px", letterSpacing: "1px", textTransform: "uppercase" },
  coachMeta: { display: "flex", flexDirection: "column", gap: "6px" },
  coachBadge: { fontSize: "12px", color: "#666", background: "#1a1a1a", padding: "5px 10px", borderRadius: "8px" },
  planGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", alignItems: "start" },
  planCard: { background: "#111", borderRadius: "20px", padding: "28px 24px", cursor: "pointer", transition: "all 0.2s", position: "relative" },
  popularBadge: { position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", fontSize: "11px", fontWeight: "700", color: "#000", padding: "4px 14px", borderRadius: "999px", whiteSpace: "nowrap" },
  planTag: { display: "inline-block", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", padding: "3px 10px", borderRadius: "999px", border: "1px solid", textTransform: "uppercase", marginBottom: "14px" },
  planName: { fontSize: "22px", fontWeight: "800", color: "#fff", marginBottom: "10px" },
  planPrice: { display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "12px" },
  planAmount: { fontSize: "36px", fontWeight: "900" },
  planPer: { fontSize: "14px", color: "#666" },
  planSessions: { display: "flex", gap: "12px", fontSize: "13px", color: "#888", marginBottom: "16px", flexWrap: "wrap" },
  planDivider: { height: "1px", background: "#1e1e1e", margin: "16px 0" },
  planFeatures: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" },
  planFeature: { fontSize: "13px", color: "#aaa", display: "flex", gap: "8px", alignItems: "flex-start" },
  selectedBadge: { marginTop: "16px", textAlign: "center", color: "#000", fontWeight: "800", fontSize: "13px", padding: "8px", borderRadius: "8px" },
  formLayout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px", alignItems: "start" },
  formCard: { background: "#111", borderRadius: "20px", padding: "32px", border: "1px solid #1e1e1e" },
  formGroup: { marginBottom: "18px" },
  formRow: { display: "flex", gap: "16px" },
  formLabel: { display: "block", fontSize: "12px", fontWeight: "600", color: "#888", marginBottom: "8px", letterSpacing: "0.5px", textTransform: "uppercase" },
  formInput: { width: "100%", padding: "12px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" },
  formSelect: { width: "100%", padding: "12px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", cursor: "pointer" },
  bookingSummary: { background: "#111", borderRadius: "20px", padding: "28px", border: "1px solid #1e1e1e", position: "sticky", top: "100px" },
  summaryTitle: { fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "20px" },
  summaryItem: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "14px" },
  summaryKey: { color: "#666" },
  summaryVal: { color: "#ccc", fontWeight: "600" },
  summaryDivider: { height: "1px", background: "#1e1e1e", margin: "16px 0" },
  trialNote: { fontSize: "13px", color: "#888", background: "#0d1f14", border: "1px solid #00FF9C22", borderRadius: "10px", padding: "14px", lineHeight: 1.7, marginBottom: "20px" },
  bookBtn: { width: "100%", padding: "14px", background: "#6366F1", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", transition: "all 0.2s", marginBottom: "16px" },
  trustRow: { display: "flex", flexDirection: "column", gap: "8px" },
  trustItem: { fontSize: "12px", color: "#555" },
  faqList: { display: "flex", flexDirection: "column", gap: "8px" },
  faqItem: { background: "#111", borderRadius: "12px", border: "1px solid", overflow: "hidden", transition: "border-color 0.2s" },
  faqQ: { width: "100%", padding: "18px 20px", background: "none", border: "none", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", textAlign: "left" },
  faqArrow: { color: "#6366F1", fontSize: "12px", transition: "transform 0.2s", flexShrink: 0 },
  faqA: { padding: "0 20px 18px", fontSize: "13px", color: "#777", lineHeight: 1.8, margin: 0 },
  successPage: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", padding: "40px 20px" },
  successBox: { background: "#111", borderRadius: "24px", padding: "48px 40px", maxWidth: "480px", width: "100%", textAlign: "center", border: "1px solid #1e1e1e" },
  successIcon: { fontSize: "56px", marginBottom: "20px" },
  successTitle: { fontSize: "28px", fontWeight: "800", color: "#fff", marginBottom: "12px" },
  successSub: { fontSize: "15px", color: "#888", lineHeight: 1.8, marginBottom: "24px" },
  successDetails: { background: "#0d0d0d", borderRadius: "12px", padding: "20px", marginBottom: "20px" },
  successRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#888", marginBottom: "10px" },
  homeBtn: { padding: "13px 32px", background: "#6366F1", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer" },
};
