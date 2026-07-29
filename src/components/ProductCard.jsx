import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // ← ADD THIS
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";


function ProductCard({ product, showNew, showBest, isDark }) {
  console.log(product);
  console.log(product.SellingPrice);
  console.log(product.sellingPrice);
  console.log(product);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate(); // ← ADD THIS
  const { toggleWishlist, isProductLiked } = useWishlist();

  const liked = isProductLiked(product.id);
  const { user } = useAuth();

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)} // ← ADD THIS
      style={{
        background: isDark ? "#1a1a1a" : "#fff",
        color: isDark ? "#fff" : "#000",
        borderRadius: "12px",
        padding: "15px",
        position: "relative",
        transition: "0.3s",
        cursor: "pointer",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
      }}
    >

      {/* 🔝 TOP ROW */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {/* LEFT: Badge */}
        <div>
          {showNew && (
            <span style={styles.newBadge}>NEW</span>
          )}

          {showBest && (
            <span style={styles.bestBadge}>BEST SELLER</span>
          )}
        </div>

        {/* RIGHT: Wishlist */}
        {/* the button*/}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (!user) { navigate("/login"); return; }
            navigate(`/products/${product.id}`);
            const wishlistIcon = document.getElementById("wishlist-icon");
            if (wishlistIcon) {
              wishlistIcon.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }}
          style={{ fontSize: "18px", cursor: "pointer" }}
        >
          {liked ? "❤️" : "🤍"}
        </div>
      </div>

      {/* 🖼 IMAGE */}
      <div
        style={{
          height: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain"
          }}
        />
      </div>

      {/* 💸 DISCOUNT */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end"
        }}
      >
        <span style={styles.discount}>-{product.discount}%</span>
      </div>

      {/* 📝 PRODUCT NAME */}
      <h3
        style={{
          margin: "10px 0 5px",
          fontSize: "16px"
        }}
      >
        {product.name}
      </h3>

      {/* 💰 PRICE */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center"
        }}
      >
        <span
          style={{
            textDecoration: "line-through",
            color: isDark ? "#ccc" : "#999"
          }}
        >
          ₹{product.mrp }
        </span>

        <span
          style={{
            fontWeight: "bold",
            color: isDark ? "#fff" : "#000"
          }}
        >
          ₹{product.sellingPrice}
        </span>
      </div>

      {/* ⭐ RATING */}
      <div
        style={{
          marginTop: "5px",
          color: "#f5a623"
        }}
      >
        ⭐⭐⭐⭐☆
      </div>

      {/* 🛒 ADD TO CART */}
      <button
        onClick={(e) => {
        e.stopPropagation();
        if (!user) { navigate("/login"); return; }
        navigate(`/products/${product.id}`);
        const cartIcon = document.getElementById("cart-icon");
        if (cartIcon) {
          cartIcon.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        }}
        
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "8px",
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;

const styles = {
  newBadge: {
    background: "linear-gradient(45deg, #00e676, #00c853)",
    color: "#000",
    fontSize: "11px",
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: "600"
  },

  bestBadge: {
    background: "linear-gradient(45deg, #ff9800, #ff5722)",
    color: "#fff",
    fontSize: "11px",
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: "600"
  },

  discount: {
    background: "#ff3b3b",
    color: "#fff",
    fontSize: "12px",
    padding: "3px 8px",
    borderRadius: "5px"
  }
};