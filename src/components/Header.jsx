import React, { useContext, useState } from "react";
import { FiShoppingCart, FiSearch, FiHeart, FiUser , FiPackage, FiLogOut} from "react-icons/fi";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ----------------------------------------------------------------------------
// Design tokens — single source of truth for the header's visual language.
// ----------------------------------------------------------------------------
const COLORS = {
  background: "#FFFFFF",
  primary: "#00C853",
  primaryHover: "#00B248",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  borderSoft: "#ECECEC",
  badge: "#FF3B30",
  hoverSurface: "#F3F4F6",
};

const ADMIN_EMAILS = ["dharcinim@gmail.com", "mummoorthysaw@gmail.com"];

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
    height: "80px",
    padding: "0 40px",
    background: COLORS.background,
    borderBottom: `1px solid ${COLORS.borderSoft}`,
    boxSizing: "border-box",
    position: "relative",
    zIndex: 10,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: "220px",
    cursor: "pointer",
    flexShrink: 0,
  },
  logo: {
    width: "52px",
    height: "52px",
    minWidth: "52px",
    borderRadius: "50%",
    background: "#fff",
    border: `1px solid ${COLORS.borderSoft}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: "14px",
    fontWeight: 800,
    color: COLORS.primary,
    letterSpacing: "0.5px",
  },
  brandText: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.25,
  },
  brandLine1: {
    fontSize: "22px",
    fontWeight: 800,
    color: COLORS.textPrimary,
  },
  brandLine2: {
    fontSize: "13px",
    fontWeight: 500,
    color: COLORS.textSecondary,
    letterSpacing: "0.4px",
  },
  searchWrap: {
    flex: 1,
    maxWidth: "600px",
    margin: "0 32px",
    position: "relative",
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 48px 12px 22px",
    borderRadius: "999px",
    border: `1.5px solid ${COLORS.border}`,
    outline: "none",
    fontSize: "14px",
    color: COLORS.textPrimary,
  },
  searchBtn: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px",
    borderRadius: "50%",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    minWidth: "200px",
    justifyContent: "flex-end",
    flexShrink: 0,
  },
  iconBtn: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "50%",
  },
  badge: {
    position: "absolute",
    top: "-2px",
    right: "-2px",
    background: COLORS.badge,
    color: "#fff",
    fontSize: "10px",
    fontWeight: 700,
    minWidth: "16px",
    height: "16px",
    padding: "0 4px",
    borderRadius: "999px",
    border: "2px solid #fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  },
  userGroup: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  greeting: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    fontWeight: 600,
    color: COLORS.textPrimary,
    whiteSpace: "nowrap",
  },
  adminBtn: {
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
    color: "#fff",
    background: COLORS.primary,
    padding: "6px 16px",
    borderRadius: "999px",
    whiteSpace: "nowrap",
  },
  navLink: {
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    color: COLORS.textPrimary,
    whiteSpace: "nowrap",
  },
  logoutLink: {
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    color: "#e00",
    whiteSpace: "nowrap",
  },
  loginLink: {
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    color: COLORS.textPrimary,
    whiteSpace: "nowrap",
  },
};

function Header() {
  const { cart, clearCart } = useContext(CartContext);
  const { wishlist, clearWishlist } = useWishlist();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  return (
    <>
      <style>{`
        .mmb-header {
          box-shadow: 0 2px 8px rgba(17, 24, 39, 0.04);
          transition: box-shadow 0.25s ease;
        }
        .mmb-header:hover {
          box-shadow: 0 4px 18px rgba(17, 24, 39, 0.08);
        }

        .mmb-brand {
          transition: transform 0.25s ease;
        }
        .mmb-brand:hover {
          transform: scale(1.03);
        }
        .mmb-brand:hover .mmb-logo {
          transform: rotate(-8deg) scale(1.06);
          box-shadow: 0 4px 14px rgba(17, 24, 39, 0.14);
        }

        .mmb-logo {
          box-shadow: 0 2px 6px rgba(17, 24, 39, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .mmb-search-input {
          box-shadow: 0 1px 4px rgba(17, 24, 39, 0.04);
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .mmb-search-input:focus {
          border-color: ${COLORS.primary};
          box-shadow: 0 0 0 4px rgba(0, 200, 83, 0.12);
        }
        .mmb-search-btn svg {
          transition: transform 0.2s ease;
        }
        .mmb-search-btn:hover svg {
          transform: scale(1.12);
        }

        .mmb-icon-btn {
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .mmb-icon-btn:hover {
          transform: scale(1.08);
          background: ${COLORS.hoverSurface};
        }

        .mmb-admin-btn {
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .mmb-admin-btn:hover {
          background: ${COLORS.primaryHover};
          transform: scale(1.05);
        }

        .mmb-nav-link {
          transition: color 0.2s ease;
        }
        .mmb-nav-link:hover {
          color: ${COLORS.primary};
        }

        .mmb-logout-link {
          transition: opacity 0.2s ease;
        }
        .mmb-logout-link:hover {
          opacity: 0.75;
        }

        .mmb-login-link {
          transition: color 0.2s ease;
        }
        .mmb-login-link:hover {
          color: ${COLORS.primary};
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .mmb-header {
            padding: 0 24px !important;
            gap: 16px !important;
          }
          .mmb-logo {
            width: 44px !important;
            height: 44px !important;
            min-width: 44px !important;
          }
          .mmb-search-wrap {
            margin: 0 20px !important;
          }
          .mmb-actions {
            gap: 12px !important;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .mmb-header {
            flex-wrap: wrap !important;
            height: auto !important;
            padding: 14px 16px !important;
            row-gap: 14px !important;
          }
          .mmb-brand {
            order: 1;
            min-width: 0 !important;
            flex: 1 1 auto;
          }
          .mmb-actions {
            order: 2;
            min-width: 0 !important;
          }
          .mmb-search-wrap {
            order: 3;
            flex-basis: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
          }
          .mmb-brand-line1 {
            font-size: 18px !important;
          }
          .mmb-greeting-text {
            display: none;
          }
        }
      `}</style>

      <div className="mmb-header" style={styles.header}>
        {/* LEFT — Brand identity */}
        <div
          className="mmb-brand"
          onClick={() => navigate("/")}
          style={styles.brand}
        >
          <div className="mmb-logo" style={styles.logo}>
            <span style={styles.logoText}>MMB</span>
          </div>
          <div style={styles.brandText}>
            <span className="mmb-brand-line1" style={styles.brandLine1}>
              Mummoorthy
            </span>
            <span style={styles.brandLine2}>Badminton Store</span>
          </div>
        </div>

        {/* CENTER — Search */}
        <div className="mmb-search-wrap" style={styles.searchWrap}>
          <input
            className="mmb-search-input"
            placeholder="Search rackets, shoes, shuttlecocks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={styles.searchInput}
          />
          <button
            className="mmb-search-btn"
            onClick={handleSearch}
            style={styles.searchBtn}
            aria-label="Search"
          >
            <FiSearch size={18} color={COLORS.textSecondary} />
          </button>
        </div>

        {/* RIGHT — Actions */}
        <div className="mmb-actions" style={styles.actions}>
          {/* Wishlist */}
          <div
            id="wishlist-icon"
            className="mmb-icon-btn"
            onClick={() => navigate("/wishlist")}
            style={styles.iconBtn}
            aria-label="Wishlist"
          >
            <FiHeart size={20} color={COLORS.textPrimary} />
            {wishlist.length > 0 && (
              <span style={styles.badge}>{wishlist.length}</span>
            )}
          </div>

          {/* Cart */}
          <div
            id="cart-icon"
            className="mmb-icon-btn"
            onClick={() => navigate("/cart")}
            style={styles.iconBtn}
            aria-label="Cart"
          >
            <FiShoppingCart size={20} color={COLORS.textPrimary} />
            {totalItems > 0 && (
              <span style={styles.badge}>{totalItems}</span>
            )}
          </div>

          {/* Login / User menu */}
          {user ? (
            <div style={styles.userGroup}>
              <span style={styles.greeting}>
                <FiUser size={14} color={COLORS.textSecondary} />
                <span className="mmb-greeting-text">
                  Hi, {user.name?.split(" ")[0]}
                </span>
              </span>

              {isAdmin && (
                <span
                  className="mmb-admin-btn"
                  onClick={() => navigate("/admin")}
                  style={styles.adminBtn}
                >
                  Admin
                </span>
              )}

              <span
                className="mmb-nav-link"
                onClick={() => navigate("/orders")}
                style={styles.navLink}
              >
                <FiPackage size={14} />
                My Orders
              </span>

              <span
                className="mmb-logout-link"
                onClick={async () => {
                  clearCart();
                  clearWishlist();
                  await logout();
                  navigate("/");
                }}
                style={styles.logoutLink}
              >
                <FiLogOut size={14} />
                Logout
              </span>
            </div>
          ) : (
            <span
              className="mmb-login-link"
              onClick={() => navigate("/login")}
              style={styles.loginLink}
            >
              Login
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
