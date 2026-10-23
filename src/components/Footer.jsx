import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const go = (path) => navigate(path);

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/products" },
    { label: "New Arrivals", path: "/new-arrivals" },
    { label: "Best Sellers", path: "/best-sellers" },
    { label: "Track Order", path: "/tracking" },
  ];

  const collections = [
    { label: "Rackets", path: "/category/rackets" },
    { label: "Shoes", path: "/category/shoes" },
    { label: "Shuttlecocks", path: "/category/shuttles" },
    { label: "Bags", path: "/category/bags" },
    { label: "Strings & Grips", path: "/category/strings" },
    { label: "Accessories", path: "/category/accessories" },
  ];

  const services = [
    { label: "Racket Stringing", path: "/services/stringing" },
    { label: "Racket Repair", path: "/services/repair" },
    { label: "Coaching Programs", path: "/services/coaching" },
    { label: "All Services", path: "/services" },
  ];

  return (
    <footer style={s.footer}>

      <div style={s.topGlow} />

      <div style={s.grid}>

        {/* Brand */}
        <div style={s.col}>
          <div style={s.logo}>
            <span style={s.logoWhite}>Mummoorthy</span>
            <span style={s.logoGreen}> Badminton</span>
          </div>
          <p style={s.about}>
            Premium badminton gear for every level — from beginners to professionals.
            Authorized dealer for Yonex, Li-Ning, Victor & Hundred.
          </p>
          <div style={s.trustRow}>
            {["Genuine Products", "Fast Delivery", "7-Day Returns"].map((t, i) => (
              <span key={i} style={s.trustBadge}>
                <span style={s.trustDot} /> {t}
              </span>
            ))}
          </div>
          <div style={s.socials}>
            {[
              { icon: "FB", label: "Facebook", color: "#1877F2" },
              { icon: "IG", label: "Instagram", color: "#E1306C" },
              { icon: "YT", label: "YouTube", color: "#FF0000" },
              { icon: "TW", label: "Twitter", color: "#1DA1F2" },
            ].map((social) => (
              <div
                key={social.label}
                title={social.label}
                style={s.socialBtn}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = social.color; e.currentTarget.style.color = social.color; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#555"; }}
              >
                {social.icon}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div style={s.col}>
          <h4 style={s.colTitle}>Quick Links</h4>
          <ul style={s.list}>
            {quickLinks.map((link) => (
              <li key={link.label} style={s.listItem} onClick={() => go(link.path)}
                onMouseEnter={(e) => e.currentTarget.style.color = "#00FF9C"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#555"}>
                <span style={s.arrow}>—</span> {link.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Collections */}
        <div style={s.col}>
          <h4 style={s.colTitle}>Collections</h4>
          <ul style={s.list}>
            {collections.map((link) => (
              <li key={link.label} style={s.listItem} onClick={() => go(link.path)}
                onMouseEnter={(e) => e.currentTarget.style.color = "#00FF9C"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#555"}>
                <span style={s.arrow}>—</span> {link.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div style={s.col}>
          <h4 style={s.colTitle}>Services</h4>
          <ul style={s.list}>
            {services.map((link) => (
              <li key={link.label} style={s.listItem} onClick={() => go(link.path)}
                onMouseEnter={(e) => e.currentTarget.style.color = "#00FF9C"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#555"}>
                <span style={s.arrow}>—</span> {link.label}
              </li>
            ))}
          </ul>
          <div style={s.hoursBox}>
            <p style={s.hoursTitle}>Store Hours</p>
            <p style={s.hoursText}>Mon – Sat: 9am – 8pm</p>
            <p style={s.hoursText}>Sunday: 10am – 6pm</p>
          </div>
        </div>

        {/* Contact */}
        <div style={s.col}>
          <h4 style={s.colTitle}>Contact Us</h4>
          <div style={s.contactList}>
            {[
              { label: "Address", text: "123 Sports Avenue,\nKumbakonam, Tamil Nadu" },
              { label: "Phone", text: "+91 98765 43210" },
              { label: "Email", text: "hello@mummoorthy.in" },
              { label: "WhatsApp", text: "+91 98765 43210" },
            ].map((item, i) => (
              <div key={i} style={s.contactItem}>
                <span style={s.contactLabel}>{item.label}</span>
                <span style={{ whiteSpace: "pre-line", color: "#555", fontSize: "13px", lineHeight: 1.6 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Newsletter */}
      <div style={s.newsletter}>
        <div>
          <p style={s.newsletterTitle}>
            Get <span style={{ color: "#00FF9C" }}>exclusive deals</span> & new arrivals
          </p>
          <p style={s.newsletterSub}>Join 5,000+ badminton players. No spam, ever.</p>
        </div>
        <div style={s.inputRow}>
          {subscribed ? (
            <div style={s.successMsg}>Subscribed successfully. Welcome aboard!</div>
          ) : (
            <>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                style={s.input}
              />
              <button onClick={handleSubscribe} style={s.subscribeBtn}>Subscribe</button>
            </>
          )}
        </div>
      </div>

      {/* Brand chips */}
      <div style={s.brandsRow}>
        <span style={s.brandsLabel}>Authorized Dealer</span>
        <div style={s.brandsLine} />
        {["Yonex", "Li-Ning", "Victor", "Hundred", "Apacs"].map((brand) => (
          <span
            key={brand}
            style={s.brandChip}
            onClick={() => navigate(`/products?search=${brand}`)}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#333"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = "#1a1a1a"; }}
          >
            {brand}
          </span>
        ))}
      </div>

      <div style={s.divider} />

      {/* Bottom */}
      <div style={s.bottomBar}>
        <p style={s.copyright}>
          © 2025 <span style={{ color: "#0066FF", fontWeight: "700" }}>Mummoorthy Badminton Store</span>. All rights reserved.
        </p>
        <div style={s.bottomLinks}>
          {["Privacy Policy", "Terms of Use", "Refund Policy", "Shipping Policy"].map((l) => (
            <span key={l} style={s.bottomLink}
              onMouseEnter={(e) => e.currentTarget.style.color = "#00FF9C"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#444"}>
              {l}
            </span>
          ))}
        </div>
      </div>

    </footer>
  );
}

const s = {
  footer: { background: "#080808", color: "#f6f3f3", padding: "0 40px 30px", fontFamily: "'Inter', sans-serif", borderTop: "1px solid #1a1a1a" },
  topGlow: { height: "1px", background: "linear-gradient(90deg, transparent, #00FF9C33, #0066FF33, transparent)", marginBottom: "60px" },
  grid: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1.5fr", gap: "40px", marginBottom: "50px" },
  col: { display: "flex", flexDirection: "column", gap: "12px" },
  logo: { fontSize: "20px", fontWeight: "800", marginBottom: "4px", letterSpacing: "-0.3px" },
  logoWhite: { color: "#fff" },
  logoGreen: { color: "#00FF9C" },
  about: { fontSize: "13px", lineHeight: "1.8", color: "#555", margin: 0 },
  trustRow: { display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" },
  trustBadge: { fontSize: "12px", color: "#444", display: "flex", alignItems: "center", gap: "6px" },
  trustDot: { width: "5px", height: "5px", borderRadius: "50%", background: "#00FF9C", display: "inline-block", flexShrink: 0 },
  socials: { display: "flex", gap: "8px", marginTop: "4px" },
  socialBtn: { width: "34px", height: "34px", borderRadius: "50%", border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#555", cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.5px" },
  colTitle: { fontSize: "11px", fontWeight: "700", color: "#fff", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px", paddingBottom: "10px", borderBottom: "1px solid #1a1a1a" },
  list: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" },
  listItem: { fontSize: "13px", color: "#555", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", transition: "color 0.2s" },
  arrow: { color: "#00FF9C", fontSize: "10px", flexShrink: 0, letterSpacing: "-2px" },
  hoursBox: { background: "#111", borderRadius: "10px", padding: "14px 16px", marginTop: "8px", border: "1px solid #1a1a1a" },
  hoursTitle: { fontSize: "11px", fontWeight: "700", color: "#fff", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "1px" },
  hoursText: { fontSize: "12px", color: "#555", margin: "3px 0" },
  contactList: { display: "flex", flexDirection: "column", gap: "14px" },
  contactItem: { display: "flex", flexDirection: "column", gap: "2px" },
  contactLabel: { fontSize: "10px", fontWeight: "700", color: "#333", textTransform: "uppercase", letterSpacing: "1px" },
  newsletter: { background: "#111", borderRadius: "16px", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", marginBottom: "28px", flexWrap: "wrap", border: "1px solid #1a1a1a" },
  newsletterTitle: { fontSize: "16px", fontWeight: "700", color: "#fff", margin: "0 0 4px" },
  newsletterSub: { fontSize: "13px", color: "#444", margin: 0 },
  inputRow: { display: "flex", gap: "10px", alignItems: "center" },
  input: { padding: "11px 18px", borderRadius: "999px", border: "1px solid #2a2a2a", background: "#1a1a1a", color: "#fff", fontSize: "13px", outline: "none", width: "240px", fontFamily: "'Inter', sans-serif" },
  subscribeBtn: { padding: "11px 28px", borderRadius: "999px", border: "none", background: "#0066FF", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" },
  successMsg: { fontSize: "13px", color: "#00FF9C", fontWeight: "600", padding: "10px 0" },
  brandsRow: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "28px" },
  brandsLabel: { fontSize: "10px", color: "#333", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", whiteSpace: "nowrap" },
  brandsLine: { height: "1px", width: "16px", background: "#2a2a2a" },
  brandChip: { fontSize: "12px", color: "#555", background: "#111", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "5px 14px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s", letterSpacing: "0.3px" },
  divider: { height: "1px", background: "#1a1a1a", marginBottom: "24px" },
  bottomBar: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" },
  copyright: { fontSize: "12px", color: "#333", margin: 0 },
  bottomLinks: { display: "flex", gap: "20px", flexWrap: "wrap" },
  bottomLink: { fontSize: "12px", color: "#444", cursor: "pointer", transition: "color 0.2s" },
};
