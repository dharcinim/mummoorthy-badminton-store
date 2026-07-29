
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cart, increaseQty, decreaseQty, removeItem } = useContext(CartContext);
  const navigate = useNavigate();
  const subtotal = cart.reduce(
  (sum, item) => sum + item.sellingPrice * item.quantity,
  0
  );
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🛒 Your Cart</h1>
      <p style={styles.subtitle}>
        {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
      </p>

      {cart.length === 0 ? (
        /* ── EMPTY STATE ── */
        <div style={styles.empty}>
          <div style={{ fontSize: "80px" }}>🏸</div>
          <h2 style={{ marginTop: "16px", color: "#111" }}>Your cart is empty</h2>
          <p style={{ color: "#6B7280", marginTop: "8px" }}>
            Looks like you haven't added anything yet.
          </p>
          <button
            onClick={() => navigate("/products")}
            style={styles.shopBtn}
          >
            Continue Shopping →
          </button>
        </div>
      ) : (
        <div style={styles.layout}>

          {/* ── CART ITEMS ─────────────────────────────── */}
          <div style={styles.itemsSection}>
            {/* Free shipping notice */}
            {shipping > 0 && (
              <div style={styles.freeShipBanner}>
                🚚 Add ₹{(999 - subtotal).toLocaleString()} more for FREE shipping!
              </div>
            )}
            {shipping === 0 && (
              <div style={{ ...styles.freeShipBanner, background: "#e8f5e9", color: "#2e7d32" }}>
                🎉 You've unlocked FREE shipping!
              </div>
            )}

            {cart.map((item) => (
              <div key={item.cartItemId} style={styles.cartItem}>
                {/* Image */}
                <div style={styles.imgWrap}>
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    style={styles.itemImg}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/90x90?text=No+Img";
                    }}
                  />
                </div>

                {/* Info */}
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemName}>{item.productName}</h3>
                  <p style={styles.itemBrand}>{item.brand || ""}</p>
                  <p style={styles.itemPrice}>₹{item.sellingPrice.toLocaleString()}</p>
                </div>

                {/* Quantity control */}
                <div style={styles.qtyControl}>
                  <button
                    onClick={() => decreaseQty(item.cartItemId)}
                    style={styles.qtyBtn}
                  >
                    −
                  </button>
                  <span style={styles.qtyNum}>{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.cartItemId)}
                    style={styles.qtyBtn}
                  >
                    +
                  </button>
                </div>

                {/* Line total + remove */}
                <div style={styles.itemRight}>
                  <span style={styles.lineTotal}>
                    ₹{(item.totalPrice).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    style={styles.removeBtn}
                    title="Remove item"
                  >
                    🗑 Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => navigate("/products")}
              style={styles.continueBtn}
            >
              ← Continue Shopping
            </button>
          </div>

          {/* ── ORDER SUMMARY ──────────────────────────── */}
          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>

            <div style={styles.summaryRow}>
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? "#00c853" : "#111" }}>
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </div>

            {/* Savings */}
            {false && (
              <div style={{ ...styles.summaryRow, color: "#00c853", fontWeight: "600" }}>
                <span>Total Savings</span>
                <span>
                  -₹
                  {cart
                    .reduce(
                      (sum, item) =>
                        sum +
                        ((item.oldPrice || item.price) - item.price) *
                          item.quantity,
                      0
                    )
                    .toLocaleString()}
                </span>
              </div>
            )}

            <hr style={styles.divider} />

            <div style={styles.totalRow}>
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              style={styles.checkoutBtn}
            >
              Proceed to Checkout →
            </button>

            {/* Trust badges */}
            <div style={styles.trustSection}>
              <div style={styles.trustItem}>🔒 Secure Checkout</div>
              <div style={styles.trustItem}>↩ 7-Day Returns</div>
              <div style={styles.trustItem}>✅ 100% Genuine Products</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;

// ─── STYLES ──────────────────────────────────────────────────
const styles = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 20px 60px",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#111",
    margin: 0,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: "15px",
    marginTop: "6px",
    marginBottom: "28px",
  },
  empty: {
    textAlign: "center",
    padding: "80px 20px",
  },
  shopBtn: {
    marginTop: "24px",
    padding: "14px 32px",
    background: "#0066FF",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "16px",
  },
  layout: {
    display: "flex",
    gap: "32px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  itemsSection: {
    flex: 1,
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  freeShipBanner: {
    background: "#e3f2fd",
    color: "#1565c0",
    padding: "12px 18px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
  },
  cartItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "#fff",
    borderRadius: "14px",
    padding: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    flexWrap: "wrap",
  },
  imgWrap: {
    background: "#F5F7FA",
    borderRadius: "10px",
    padding: "10px",
    flexShrink: 0,
  },
  itemImg: {
    width: "80px",
    height: "80px",
    objectFit: "contain",
  },
  itemInfo: {
    flex: 1,
    minWidth: "140px",
  },
  itemName: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111",
    margin: "0 0 4px",
  },
  itemBrand: {
    fontSize: "12px",
    color: "#0066FF",
    margin: "0 0 4px",
  },
  itemPrice: {
    fontSize: "15px",
    color: "#6B7280",
    margin: 0,
  },
  qtyControl: {
    display: "flex",
    alignItems: "center",
    border: "2px solid #E0E0E0",
    borderRadius: "8px",
    overflow: "hidden",
  },
  qtyBtn: {
    width: "36px",
    height: "36px",
    background: "#F5F7FA",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "700",
  },
  qtyNum: {
    width: "40px",
    textAlign: "center",
    fontWeight: "700",
    fontSize: "15px",
  },
  itemRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
    minWidth: "90px",
  },
  lineTotal: {
    fontWeight: "800",
    fontSize: "17px",
    color: "#111",
  },
  removeBtn: {
    background: "none",
    border: "none",
    color: "#f44336",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    padding: 0,
  },
  continueBtn: {
    alignSelf: "flex-start",
    background: "none",
    border: "2px solid #E0E0E0",
    borderRadius: "8px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    color: "#111",
    marginTop: "8px",
  },
  summary: {
    width: "320px",
    minWidth: "280px",
    background: "#fff",
    borderRadius: "16px",
    padding: "28px 24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    position: "sticky",
    top: "100px",
  },
  summaryTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#111",
    marginTop: 0,
    marginBottom: "20px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "15px",
    color: "#374151",
    marginBottom: "12px",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #E0E0E0",
    margin: "16px 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "20px",
    fontWeight: "800",
    color: "#111",
    marginBottom: "24px",
  },
  checkoutBtn: {
    width: "100%",
    padding: "15px",
    background: "#0066FF",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "16px",
    transition: "background 0.2s",
  },
  trustSection: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  trustItem: {
    fontSize: "13px",
    color: "#6B7280",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
};
