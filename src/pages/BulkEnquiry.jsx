import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Tag,
  Truck,
  Headset,
  Shirt,
  Wrench,
  Trophy,
} from "lucide-react";

/* ------------------------------------------------------------------
   MMB THEME TOKENS — pulled directly from the brief. Do not add colors.
------------------------------------------------------------------- */
const THEME = {
  primaryBlue: "#1e6cff",
  hoverBlue: "#1557d6",
  accentGreen: "#00e676",
  hoverGreen: "#00c96a",
  white: "#ffffff",
  lightGray: "#f8f9fa",
  darkText: "#1a1a1a",
  secondaryText: "#666666",
};

/* ------------------------------------------------------------------
   CONTENT — replace phone/whatsapp/email/address with real MMB details
------------------------------------------------------------------- */
const CONTACT_CARDS = [
  {
    icon: Phone,
    title: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "+91 98765 43210",
    href: "https://wa.me/919876543210",
  },
  {
    icon: Mail,
    title: "Email",
    value: "sales@mummoorthybadminton.com",
    href: "mailto:sales@mummoorthybadminton.com",
  },
  {
    icon: MapPin,
    title: "Store Address",
    value: "Kumbakonam, Tamil Nadu",
    href: "https://maps.google.com/?q=Mummoorthy+Badminton+Store+Kumbakonam",
  },
];

const BENEFITS = [
  { icon: ShieldCheck, label: "Genuine Products" },
  { icon: Tag, label: "GST Billing" },
  { icon: Tag, label: "Wholesale Pricing" },
  { icon: Truck, label: "Fast Shipping" },
  { icon: Headset, label: "Dedicated Sales Support" },
  { icon: Shirt, label: "Team Jerseys" },
  { icon: Wrench, label: "Professional Stringing" },
  { icon: Trophy, label: "Tournament Supply" },
];

const MIN_ORDERS = [
  "10+ Rackets",
  "20+ Shoes",
  "50+ Shuttle Tubes",
  "100+ Accessories",
  "200+ Grips",
];

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/* ------------------------------------------------------------------
   MODAL COMPONENT
------------------------------------------------------------------- */
function BulkEnquiry({ isOpen, onClose }) {
  const [rendered, setRendered] = useState(isOpen);
  const [entered, setEntered] = useState(false);
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const closeBtnRef = useRef(null);
  const triggerRef = useRef(null);

  // Mount / animate-in, unmount / animate-out
  useEffect(() => {
    let raf1, raf2, timeout;
    if (isOpen) {
      triggerRef.current = document.activeElement;
      setRendered(true);
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setEntered(true));
      });
    } else if (rendered) {
      setEntered(false);
      timeout = setTimeout(() => setRendered(false), 350);
    }
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Lock body scroll while open
  useEffect(() => {
    if (rendered) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [rendered]);

  // Focus management: move focus in, trap tab, restore on close
  useEffect(() => {
    if (rendered && entered) {
      closeBtnRef.current?.focus();
    }
    if (!rendered) {
      triggerRef.current?.focus?.();
    }
  }, [rendered, entered]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "Tab" && cardRef.current) {
        const focusables = cardRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  if (!rendered) return null;

  return (
    <div
      ref={overlayRef}
      className={`mmb-overlay${entered ? " is-visible" : ""}`}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={cardRef}
        className={`mmb-card${entered ? " is-visible" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mmb-bulk-title"
        aria-describedby="mmb-bulk-subtitle"
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="mmb-close-btn"
          aria-label="Close bulk enquiry dialog"
          onClick={onClose}
        >
          <X size={20} strokeWidth={1.75} />
        </button>

        <div className="mmb-scroll">
          {/* Header */}
          <header className="mmb-header">
            <p className="mmb-eyebrow">Bulk &amp; Institutional</p>
            <h2 id="mmb-bulk-title" className="mmb-title">
              Bulk Orders &amp; Institutional Sales
            </h2>
            <p id="mmb-bulk-subtitle" className="mmb-subtitle">
              Special pricing for Academies, Schools, Colleges, Clubs,
              Tournaments &amp; Corporate Events
            </p>
          </header>

          {/* Contact section */}
          <section className="mmb-section" aria-label="Contact options">
            <h3 className="mmb-section-title">Talk to Our Sales Team</h3>
            <div className="mmb-contact-grid">
              {CONTACT_CARDS.map(({ icon: Icon, title, value, href }) => (
                <a
                  key={title}
                  href={href}
                  className="mmb-contact-card"
                  target={title === "Store Address" ? "_blank" : undefined}
                  rel={title === "Store Address" ? "noopener noreferrer" : undefined}
                >
                  <span className="mmb-contact-icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <span className="mmb-contact-text">
                    <span className="mmb-contact-title">{title}</span>
                    <span className="mmb-contact-value">{value}</span>
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section className="mmb-section" aria-label="Bulk order benefits">
            <h3 className="mmb-section-title">Why Buy Bulk From MMB</h3>
            <div className="mmb-benefits-grid">
              {BENEFITS.map(({ icon: Icon, label }) => (
                <div className="mmb-benefit-card" key={label}>
                  <Icon
                    className="mmb-benefit-icon"
                    size={18}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Minimum order suggestions */}
          <section className="mmb-section" aria-label="Minimum order suggestions">
            <h3 className="mmb-section-title">Minimum Order Suggestions</h3>
            <div className="mmb-chip-row">
              {MIN_ORDERS.map((chip) => (
                <span className="mmb-chip" key={chip}>
                  {chip}
                </span>
              ))}
            </div>
          </section>

          {/* CTAs */}
          <footer className="mmb-footer">
            <a href="tel:+919876543210" className="mmb-btn mmb-btn-primary">
              <Phone size={18} strokeWidth={1.75} aria-hidden="true" />
              Contact Sales
            </a>
            <a
              href="https://wa.me/919876543210"
              className="mmb-btn mmb-btn-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} strokeWidth={1.75} aria-hidden="true" />
              WhatsApp
            </a>
            <button type="button" className="mmb-btn mmb-btn-outline" onClick={onClose}>
              Close
            </button>
          </footer>
        </div>
      </div>

      <style>{`
        .mmb-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(26, 26, 26, 0);
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
          transition: background 350ms ease-in-out, backdrop-filter 350ms ease-in-out;
        }
        .mmb-overlay.is-visible {
          background: rgba(26, 26, 26, 0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        .mmb-card {
          width: 100%;
          max-width: 620px;
          max-height: min(88vh, 760px);
          background: rgba(255, 255, 255, 0.86);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 20px;
          box-shadow: 0 24px 60px rgba(26, 26, 26, 0.22), 0 2px 8px rgba(26, 26, 26, 0.06);
          position: relative;
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 350ms ease-in-out, transform 350ms ease-in-out;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .mmb-card.is-visible {
          opacity: 1;
          transform: scale(1);
        }

        .mmb-scroll {
          overflow-y: auto;
          padding: 40px 40px 32px;
        }

        .mmb-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 2;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: 1px solid rgba(26, 26, 26, 0.08);
          background: rgba(255, 255, 255, 0.7);
          color: ${THEME.darkText};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 200ms ease, transform 200ms ease, border-color 200ms ease;
        }
        .mmb-close-btn:hover {
          background: ${THEME.white};
          border-color: rgba(30, 108, 255, 0.35);
          transform: rotate(90deg);
        }
        .mmb-close-btn:focus-visible {
          outline: 2px solid ${THEME.primaryBlue};
          outline-offset: 2px;
        }

        .mmb-header {
          padding-right: 32px;
          margin-bottom: 28px;
        }
        .mmb-eyebrow {
          margin: 0 0 8px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${THEME.primaryBlue};
        }
        .mmb-title {
          margin: 0 0 10px;
          font-size: 28px;
          line-height: 1.2;
          font-weight: 800;
          color: ${THEME.darkText};
          letter-spacing: -0.01em;
        }
        .mmb-subtitle {
          margin: 0;
          font-size: 15px;
          line-height: 1.6;
          color: ${THEME.secondaryText};
          max-width: 46ch;
        }

        .mmb-section {
          margin-bottom: 28px;
        }
        .mmb-section:last-of-type {
          margin-bottom: 32px;
        }
        .mmb-section-title {
          margin: 0 0 14px;
          font-size: 15px;
          font-weight: 700;
          color: ${THEME.darkText};
        }

        .mmb-contact-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .mmb-contact-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 14px;
          background: ${THEME.lightGray};
          border: 1px solid rgba(26, 26, 26, 0.06);
          text-decoration: none;
          color: inherit;
          transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease, background 200ms ease;
        }
        .mmb-contact-card:hover {
          transform: translateY(-2px);
          background: ${THEME.white};
          border-color: rgba(30, 108, 255, 0.3);
          box-shadow: 0 8px 20px rgba(30, 108, 255, 0.12);
        }
        .mmb-contact-card:focus-visible {
          outline: 2px solid ${THEME.primaryBlue};
          outline-offset: 2px;
        }
        .mmb-contact-icon {
          flex-shrink: 0;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(30, 108, 255, 0.1);
          color: ${THEME.primaryBlue};
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mmb-contact-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .mmb-contact-title {
          font-size: 12px;
          font-weight: 600;
          color: ${THEME.secondaryText};
        }
        .mmb-contact-value {
          font-size: 14px;
          font-weight: 600;
          color: ${THEME.darkText};
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .mmb-benefits-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .mmb-benefit-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          background: ${THEME.white};
          border: 1px solid rgba(26, 26, 26, 0.08);
          font-size: 13.5px;
          font-weight: 600;
          color: ${THEME.darkText};
        }
        .mmb-benefit-icon {
          color: ${THEME.accentGreen};
          flex-shrink: 0;
        }

        .mmb-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .mmb-chip {
          padding: 8px 16px;
          border-radius: 999px;
          background: rgba(30, 108, 255, 0.08);
          color: ${THEME.primaryBlue};
          font-size: 13px;
          font-weight: 700;
          border: 1px solid rgba(30, 108, 255, 0.18);
        }

        .mmb-footer {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .mmb-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 22px;
          border-radius: 12px;
          font-size: 14.5px;
          font-weight: 700;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background 200ms ease, transform 200ms ease, box-shadow 200ms ease;
          flex: 1 1 auto;
          white-space: nowrap;
        }
        .mmb-btn:focus-visible {
          outline: 2px solid ${THEME.darkText};
          outline-offset: 2px;
        }
        .mmb-btn-primary {
          background: ${THEME.primaryBlue};
          color: ${THEME.white};
          box-shadow: 0 8px 20px rgba(30, 108, 255, 0.28);
        }
        .mmb-btn-primary:hover {
          background: ${THEME.hoverBlue};
          transform: translateY(-1px);
        }
        .mmb-btn-whatsapp {
          background: ${THEME.accentGreen};
          color: ${THEME.darkText};
        }
        .mmb-btn-whatsapp:hover {
          background: ${THEME.hoverGreen};
          transform: translateY(-1px);
        }
        .mmb-btn-outline {
          background: transparent;
          color: ${THEME.darkText};
          border: 1.5px solid rgba(26, 26, 26, 0.18);
          flex: 0 1 auto;
        }
        .mmb-btn-outline:hover {
          background: rgba(26, 26, 26, 0.04);
          border-color: rgba(26, 26, 26, 0.32);
        }

        @media (prefers-reduced-motion: reduce) {
          .mmb-overlay, .mmb-card, .mmb-close-btn, .mmb-btn, .mmb-contact-card {
            transition: none !important;
          }
        }

        /* Tablet */
        @media (max-width: 900px) {
          .mmb-card { max-width: 520px; }
        }

        /* Mobile: bottom sheet */
        @media (max-width: 640px) {
          .mmb-overlay {
            align-items: flex-end;
            padding: 0;
          }
          .mmb-card {
            max-width: 100%;
            width: 100%;
            max-height: 92vh;
            border-radius: 20px 20px 0 0;
            transform: translateY(24px);
          }
          .mmb-card.is-visible {
            transform: translateY(0);
          }
          .mmb-scroll {
            padding: 28px 20px 24px;
          }
          .mmb-title { font-size: 23px; }
          .mmb-contact-grid,
          .mmb-benefits-grid {
            grid-template-columns: 1fr;
          }
          .mmb-footer {
            flex-direction: column;
          }
          .mmb-btn-outline { flex: 1 1 auto; }
        }
      `}</style>
    </div>
  );
}
export default BulkEnquiry;


   