import React, { useState, useContext , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import { placeOrder } from "../services/orderWorkflowService";
import { toast } from "react-toastify";


const steps = ["Delivery", "Payment", "Review"];

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", phone: "", address: "", city: "", state: "", pincode: "",
    payMethod: "upi", upi: "", cardNum: "", cardName: "", expiry: "", cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [placing, setPlacing] = useState(false);
  useEffect(() => {
    if (placed) {
        toast.success("Order placed successfully");
    }
}, [placed]);
  const subtotal = cart.reduce((s, i) => s + i.totalPrice, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const savings = 0;
  const total = subtotal + shipping;

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validateStep0 = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Invalid email";
    if (!form.phone.match(/^\d{10}$/)) e.phone = "10-digit number";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!form.pincode.match(/^\d{6}$/)) e.pincode = "6-digit pincode";
    return e;
  };

  const validateStep1 = () => {
    const e = {};
    if (form.payMethod === "upi" && !form.upi.match(/^[\w.\-]+@[\w]+$/)) e.upi = "Invalid UPI ID";
    if (form.payMethod === "card") {
      if (!form.cardNum.match(/^\d{16}$/)) e.cardNum = "16-digit card number";
      if (!form.cardName.trim()) e.cardName = "Required";
      if (!form.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = "MM/YY format";
      if (!form.cvv.match(/^\d{3}$/)) e.cvv = "3 digits";
    }
    return e;
  };

  // Save order 
  const saveOrder = async () => {

  setPlacing(true);

  try {

    console.log("Logged in user:", user);

    const orderData = {
      customerId: user?.customerId,
      fullName: form.name,
      phoneNumber: form.phone,
      addressLine1: form.address,
      addressLine2: "",
      city: form.city,
      state: form.state,
      country: "India",
      postalCode: form.pincode,
      paymentMethod: form.payMethod.toUpperCase()
    };

    console.log("Order Request:", orderData);

    const response = await placeOrder(orderData);

    setOrderId(response.orderNumber);

    await clearCart();

    setPlaced(true);

  } catch (error) {

    console.error(error);

    const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to place order.";

    toast.error(message);

  }

  setPlacing(false);

};

  
  const next = () => {
    const e = step === 0 ? validateStep0() : step === 1 ? validateStep1() : {};
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    if (step < 2) setStep(step + 1);
    else saveOrder();
  };

  const inp = (key, placeholder, type = "text", extra = {}) => (
    <div style={s.fieldWrap}>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        style={{ ...s.input, ...(errors[key] ? s.inputErr : {}) }}
        {...extra}
      />
      {errors[key] && <span style={s.errMsg}>{errors[key]}</span>}
    </div>
  );

  if (placed){  return (
    <div style={s.successPage}>
      <div style={s.successBox}>
        <div style={s.successIcon}>✓</div>
        <h2 style={s.successTitle}>Order Placed!</h2>
        
        <p style={s.successSub}>Thank you, {form.name.split(" ")[0]}! Your order will arrive in 3–5 business days.</p>
        <p style={s.successAmt}>₹{total.toLocaleString()} paid via {form.payMethod === "upi" ? "UPI" : form.payMethod === "card" ? "Card" : "Cash on Delivery"}</p>
        {orderId && <p style={s.orderIdText}>Order ID: <strong>#{orderId.slice(0, 8).toUpperCase()}</strong></p>}
        <div style={s.successBtns}>
          <button onClick={() => navigate("/")} style={s.homeBtn}>Continue Shopping</button>
          <button onClick={() => navigate("/orders")} style={{ ...s.homeBtn, background: "#00c853" }}>
            View Order Details →
          </button>
        </div>
      </div>
    </div>
  );
}

  return (
    <div style={s.page}>

      {/* STEPPER */}
      <div style={s.stepper}>
        {steps.map((label, i) => (
          <div key={i} style={s.stepWrap}>
            <div style={{ ...s.stepDot, ...(i <= step ? s.stepActive : {}) }}>
              {i < step ? "✓" : i + 1}
            </div>
            <span style={{ ...s.stepLabel, ...(i <= step ? { color: "#0a0a0a", fontWeight: "600" } : {}) }}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <div style={{ ...s.stepLine, ...(i < step ? s.stepLineDone : {}) }} />
            )}
          </div>
        ))}
      </div>

      <div style={s.layout}>

        {/* LEFT — FORM */}
        <div style={s.formSection}>

          {/* STEP 0: DELIVERY */}
          {step === 0 && (
            <div style={s.card}>
              <h2 style={s.cardTitle}>Delivery Details</h2>
              <div style={s.row}>
                {inp("name", "Full Name")}
                {inp("email", "Email Address", "email")}
              </div>
              <div style={s.row}>
                {inp("phone", "Phone Number", "tel")}
                {inp("pincode", "Pincode", "text")}
              </div>
              {inp("address", "Full Address (House No, Street, Area)")}
              <div style={s.row}>
                {inp("city", "City")}
                {inp("state", "State")}
              </div>
            </div>
          )}

          {/* STEP 1: PAYMENT */}
          {step === 1 && (
            <div style={s.card}>
              <h2 style={s.cardTitle}>Payment Method</h2>
              <div style={s.payMethods}>
                {[
                  { key: "upi", label: "UPI" },
                  { key: "card", label: "Card" },
                  { key: "cod", label: "Cash on Delivery" },
                ].map((m) => (
                  <div
                    key={m.key}
                    onClick={() => set("payMethod", m.key)}
                    style={{ ...s.payOption, ...(form.payMethod === m.key ? s.paySelected : {}) }}
                  >
                     <span style={{ fontSize: "14px", fontWeight: "700" }}>{m.label}</span>
                  </div>
                ))}
              </div>

              {form.payMethod === "upi" && (
                <div style={{ marginTop: "20px" }}>
                  <p style={s.payHint}>Enter your UPI ID (e.g. name@upi)</p>
                  {inp("upi", "yourname@upi")}
                </div>
              )}

              {form.payMethod === "card" && (
                <div style={{ marginTop: "20px" }}>
                  {inp("cardNum", "Card Number (16 digits)", "text", { maxLength: 16 })}
                  {inp("cardName", "Name on Card")}
                  <div style={s.row}>
                    {inp("expiry", "MM/YY")}
                    {inp("cvv", "CVV", "password", { maxLength: 3 })}
                  </div>
                </div>
              )}

              {form.payMethod === "cod" && (
                <div style={s.codNote}>
                  
                  <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                    Pay in cash when your order is delivered. Extra ₹30 COD charge may apply.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: REVIEW */}
          {step === 2 && (
            <div style={s.card}>
              <h2 style={s.cardTitle}>Review Order</h2>

              <div style={s.reviewSection}>
                <div style={s.reviewHead}>
                  <span style={s.reviewLabel}> Delivering to</span>
                  <button onClick={() => setStep(0)} style={s.editBtn}>Edit</button>
                </div>
                <p style={s.reviewText}>{form.name} · {form.phone}</p>
                <p style={s.reviewText}>{form.address}, {form.city}, {form.state} – {form.pincode}</p>
              </div>

              <div style={s.reviewSection}>
                <div style={s.reviewHead}>
                  <span style={s.reviewLabel}> Payment</span>
                  <button onClick={() => setStep(1)} style={s.editBtn}>Edit</button>
                </div>
                <p style={s.reviewText}>
                  {form.payMethod === "upi" && `UPI — ${form.upi}`}
                  {form.payMethod === "card" && `Card ending in ${form.cardNum.slice(-4)}`}
                  {form.payMethod === "cod" && "Cash on Delivery"}
                </p>
              </div>

              <div style={s.reviewSection}>
                <span style={s.reviewLabel}> Items ({cart.length})</span>
                {cart.map((item) => (
                  <div key={item.cartItemId} style={s.reviewItem}>
                    <img src={item.imageUrl || "/assets/no-image.png" || "/assets/no-image.webp "} alt={item.productName} style={s.reviewImg}
                      onError={(e) => e.target.style.display = "none"} />
                     <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#0a0a0a",
                        }}
                      >
                        {item.productName}
                      </p>

                      <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                        ₹{item.sellingPrice.toLocaleString()} each
                      </p>
                    </div>

                    <span style={{ fontSize: "14px", fontWeight: "700" }}>
                      ₹{item.totalPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NAV BUTTONS */}
          <div style={s.navBtns}>
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} style={s.backBtn}>← Back</button>
            )}
            <button onClick={next} disabled={placing} style={{ ...s.nextBtn, opacity: placing ? 0.7 : 1 }}>
              {placing ? "Placing Order..." : step === 2 ? "Place Order " : "Continue →"}
            </button>
          </div>
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div style={s.summary}>
          <h3 style={s.summaryTitle}>Order Summary</h3>

          {cart.map((item) => (
            <div key={item.cartItemId} style={s.summaryItem}>
              <div style={s.summaryImgWrap}>
                <img src={item.imageUrl ||"/assets/no-image.png" || "/assets/no-image.webp" } alt={item.productName} style={s.summaryImg}
                  onError={(e) => e.target.style.display = "none"} />
                <span style={s.qtyBadge}>{item.quantity}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#0a0a0a" }}>{item.productName}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                  ₹{item.sellingPrice.toLocaleString()} each
                </p>
              </div>
              
            </div>
          ))}

          <div style={s.divider} />
          <div style={s.sumRow}><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div style={s.sumRow}>
            <span>Shipping</span>
            <span style={{ color: shipping === 0 ? "#00a63e" : "#0a0a0a" }}>
              {shipping === 0 ? "FREE" : `₹${shipping}`}
            </span>
          </div>
          {savings > 0 && (
            <div style={{ ...s.sumRow, color: "#00a63e", fontWeight: "600" }}>
              <span>You Save</span><span>-₹{savings.toLocaleString()}</span>
            </div>
          )}
          <div style={s.divider} />
          <div style={s.totalRow}>
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          <div style={s.trust}>
            <span> Secure Checkout</span>
            <span>↩ 7-Day Returns</span>
            <span> 100% Genuine</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

const s = {
  page: { maxWidth: "1100px", margin: "0 auto", padding: "32px 20px 80px", fontFamily: "sans-serif" },

  stepper: { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "40px", gap: 0 },
  stepWrap: { display: "flex", alignItems: "center", gap: "8px" },
  stepDot: {
    width: "32px", height: "32px", borderRadius: "50%", background: "#e5e7eb",
    color: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", fontWeight: "700", flexShrink: 0,
  },
  stepActive: { background: "#0a0a0a", color: "#fff" },
  stepLabel: { fontSize: "13px", color: "#9ca3af", whiteSpace: "nowrap" },
  stepLine: { width: "60px", height: "2px", background: "#e5e7eb", margin: "0 8px" },
  stepLineDone: { background: "#0a0a0a" },

  layout: { display: "flex", gap: "28px", alignItems: "flex-start", flexWrap: "wrap" },
  formSection: { flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", gap: "16px" },

  card: { background: "#fff", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" },
  cardTitle: { fontSize: "18px", fontWeight: "800", color: "#0a0a0a", margin: "0 0 20px" },

  row: { display: "flex", gap: "12px", flexWrap: "wrap" },
  fieldWrap: { flex: 1, minWidth: "140px", marginBottom: "14px", position: "relative" },
  input: {
    width: "100%", padding: "12px 14px", border: "1.5px solid #e5e7eb", borderRadius: "10px",
    fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "sans-serif",
    transition: "border-color 0.2s",
  },
  inputErr: { borderColor: "#f44336" },
  errMsg: { position: "absolute", bottom: "-16px", left: "2px", fontSize: "11px", color: "#f44336" },

  payMethods: { display: "flex", gap: "12px", flexWrap: "wrap" },
  payOption: {
    flex: 1, minWidth: "100px", padding: "14px 12px", border: "1.5px solid #e5e7eb",
    borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center",
    gap: "6px", cursor: "pointer", transition: "0.2s",
  },
  paySelected: { border: "2px solid #0a0a0a", background: "#f9f9f9" },
  payHint: { fontSize: "13px", color: "#888", margin: "0 0 10px" },
  codNote: {
    display: "flex", alignItems: "center", gap: "14px", background: "#f9fafb",
    borderRadius: "12px", padding: "18px", marginTop: "20px",
  },

  reviewSection: { borderBottom: "1px solid #f0f0f0", paddingBottom: "16px", marginBottom: "16px" },
  reviewHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  reviewLabel: { fontSize: "13px", fontWeight: "700", color: "#0a0a0a" },
  editBtn: { fontSize: "12px", color: "#0066ff", background: "none", border: "none", cursor: "pointer", fontWeight: "600" },
  reviewText: { margin: "2px 0", fontSize: "13px", color: "#555" },
  reviewItem: { display: "flex", alignItems: "center", gap: "12px", marginTop: "10px" },
  reviewImg: { width: "44px", height: "44px", objectFit: "contain", background: "#f5f5f5", borderRadius: "8px", padding: "4px" },

  navBtns: { display: "flex", gap: "12px", justifyContent: "flex-end" },
  backBtn: {
    padding: "12px 24px", background: "none", border: "2px solid #e5e7eb",
    borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px",
  },
  nextBtn: {
    padding: "12px 32px", background: "#0a0a0a", color: "#fff", border: "none",
    borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "15px",
  },

  summary: {
    width: "300px", minWidth: "260px", background: "#fff", borderRadius: "16px",
    padding: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", position: "sticky", top: "100px",
  },
  summaryTitle: { fontSize: "16px", fontWeight: "800", color: "#0a0a0a", margin: "0 0 16px" },
  summaryItem: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" },
  summaryImgWrap: { position: "relative", flexShrink: 0 },
  summaryImg: { width: "48px", height: "48px", objectFit: "contain", background: "#f5f5f5", borderRadius: "8px", padding: "4px" },
  qtyBadge: {
    position: "absolute", top: "-6px", right: "-6px", background: "#0a0a0a", color: "#fff",
    fontSize: "10px", width: "18px", height: "18px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700",
  },
  divider: { border: "none", borderTop: "1px solid #f0f0f0", margin: "14px 0" },
  sumRow: { display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#555", marginBottom: "8px" },
  totalRow: { display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "800", color: "#0a0a0a", marginBottom: "16px" },
  trust: { display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#888", marginTop: "16px", borderTop: "1px solid #f0f0f0", paddingTop: "14px" },

  successPage: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" },
  successBox: { textAlign: "center", maxWidth: "400px" },
  successIcon: {
    width: "72px", height: "72px", background: "#0a0a0a", color: "#fff", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px",
    margin: "0 auto 20px", fontWeight: "700",
  },
  successTitle: { fontSize: "26px", fontWeight: "800", color: "#0a0a0a", margin: "0 0 10px" },
  successSub: { fontSize: "15px", color: "#555", margin: "0 0 8px" },
  successAmt: { fontSize: "14px", color: "#888", margin: "0 0 8px" },
  orderIdText: { fontSize: "13px", color: "#0066ff", margin: "0 0 24px" },
  successBtns: { display: "flex", gap: "12px", justifyContent: "center" },
  homeBtn: {
    padding: "12px 28px", background: "#0a0a0a", color: "#fff", border: "none",
    borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "15px",
  },
};
