import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/*  A quiet, court-inspired palette: deep racket-string green for      */
/*  primary actions, warm neutral greys for structure, a restrained    */
/*  gold for rating, and calm status colors for stock.                */
/* ------------------------------------------------------------------ */
const COLORS = {
  green: "#1B5E3F",
  greenHover: "#164A32",
  greenSoftBg: "#E8F3EC",
  greenSoftText: "#1B6E43",
  amberSoftBg: "#FDF2E3",
  amberSoftText: "#B4630A",
  redSoftBg: "#FCEAEA",
  redSoftText: "#B0362E",
  discountBg: "#E8483A",
  gold: "#C9971F",
  darkBg: "#15181B",
  darkSurface: "#1E2226",
  darkBorder: "rgba(255,255,255,0.08)",
  lightBorder: "rgba(20,20,20,0.07)",
};

const FONT_STACK =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

/* ------------------------------------------------------------------ */
/*  Small presentational helpers (no external icon libraries)          */
/* ------------------------------------------------------------------ */
function StarIcon({ filled, half, size = 14 }) {
  const id = React.useId ? React.useId() : `star-${Math.random()}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      {half && (
        <defs>
          <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor={COLORS.gold} />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 2.5l2.9 6.02 6.6.87-4.85 4.6 1.28 6.56L12 17.6l-5.93 3.05 1.28-6.56-4.85-4.6 6.6-.87L12 2.5z"
        fill={half ? `url(#${id})` : filled ? COLORS.gold : "none"}
        stroke={filled || half ? COLORS.gold : "#C7CBD1"}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RatingStars({ rating = 0, size = 14 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<StarIcon key={i} filled size={size} />);
    else if (rating >= i - 0.5) stars.push(<StarIcon key={i} half size={size} />);
    else stars.push(<StarIcon key={i} size={size} />);
  }
  return <div style={{ display: "flex", gap: "2px" }}>{stars}</div>;
}

function HeartIcon({ liked, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M12 20.5s-7.5-4.6-10.1-9.1C.4 8.6 1.6 5.4 4.6 4.4c2-.66 4 .04 5.4 1.9 1.4-1.86 3.4-2.56 5.4-1.9 3 1 4.2 4.2 2.7 7-2.6 4.5-10.1 9.1-10.1 9.1z"
        fill={liked ? COLORS.discountBg : "none"}
        stroke={liked ? COLORS.discountBg : "#8A8F98"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
function ProductCard({ product, showNew, showBest, isDark }) {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { toggleWishlist, isProductLiked } = useWishlist();
  const { user } = useAuth();

  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isWishlistHovered, setIsWishlistHovered] = useState(false);

  const liked = isProductLiked(product.id);

  const stockCount = typeof product.stock === "number" ? product.stock : null;
  const isOutOfStock = stockCount === 0;
  const isLowStock = stockCount !== null && stockCount > 0 && stockCount <= 5;

  const stockLabel = isOutOfStock
    ? "Out of Stock"
    : isLowStock
    ? `Only ${stockCount} Left`
    : "In Stock";

  const stockColors = isOutOfStock
    ? { bg: COLORS.redSoftBg, text: COLORS.redSoftText }
    : isLowStock
    ? { bg: COLORS.amberSoftBg, text: COLORS.amberSoftText }
    : { bg: COLORS.greenSoftBg, text: COLORS.greenSoftText };

  const rating = product.rating ?? 4.5;
  const reviewCount = product.reviewCount ?? 0;

  const surface = isDark ? COLORS.darkSurface : "#FFFFFF";
  const textPrimary = isDark ? "#F5F6F7" : "#14171A";
  const textMuted = isDark ? "#9AA0A6" : "#6B7280";
  const border = isDark ? COLORS.darkBorder : COLORS.lightBorder;

  const goToProduct = () => navigate(`/products/${product.id}`);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    toggleWishlist(product.id);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    if (isOutOfStock) return;
    navigate(`/products/${product.id}`);
    const cartIcon = document.getElementById("cart-icon");
    if (cartIcon) {
      cartIcon.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div
      onClick={goToProduct}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: surface,
        color: textPrimary,
        borderRadius: "16px",
        padding: "20px",
        border: `1px solid ${border}`,
        cursor: "pointer",
        fontFamily: FONT_STACK,
        boxShadow: isCardHovered
          ? "0 16px 32px rgba(0,0,0,0.14)"
          : "0 2px 10px rgba(0,0,0,0.06)",
        transform: isCardHovered ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.28s ease, box-shadow 0.28s ease",
      }}
    >
      {/* Top row: badge + wishlist */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {showNew && <span style={styles.newBadge}>New</span>}
          {showBest && <span style={styles.bestBadge}>Best Seller</span>}
        </div>

        <button
          type="button"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleWishlistClick}
          onMouseEnter={() => setIsWishlistHovered(true)}
          onMouseLeave={() => setIsWishlistHovered(false)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            border: "none",
            background: isWishlistHovered
              ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)")
              : "transparent",
            cursor: "pointer",
            transition: "background 0.2s ease, transform 0.2s ease",
            transform: isWishlistHovered ? "scale(1.12)" : "scale(1)",
          }}
        >
          <HeartIcon liked={liked} />
        </button>
      </div>

      {/* Image */}
      <div
        style={{
          height: "190px",
          margin: "8px 0 16px",
          borderRadius: "10px",
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            maxWidth: "88%",
            maxHeight: "88%",
            objectFit: "contain",
            transition: "transform 0.35s ease",
            transform: isCardHovered ? "scale(1.06)" : "scale(1)",
          }}
        />
      </div>

      {/* Brand */}
      {product.brand && (
        <div
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: textMuted,
            marginBottom: "4px",
          }}
        >
          {product.brand}
        </div>
      )}

      {/* Name */}
      <h3
        style={{
          margin: "0 0 6px",
          fontSize: "16px",
          fontWeight: 600,
          lineHeight: 1.35,
          minHeight: "2.7em",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {product.name}
      </h3>

      {/* Rating */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
        <RatingStars rating={rating} />
        <span style={{ fontSize: "13px", fontWeight: 600, color: textPrimary }}>
          {rating.toFixed ? rating.toFixed(1) : rating}
        </span>
        {reviewCount > 0 && (
          <span style={{ fontSize: "12px", color: textMuted }}>({reviewCount})</span>
        )}
      </div>

      {/* Price row */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
        {product.mrp > product.sellingPrice && (
          <span style={{ fontSize: "13px", textDecoration: "line-through", color: textMuted }}>
            ₹{product.mrp}
          </span>
        )}
        <span style={{ fontSize: "20px", fontWeight: 700, color: textPrimary }}>
          ₹{product.sellingPrice}
        </span>
        {product.discount > 0 && (
          <span style={styles.discount}>{product.discount}% OFF</span>
        )}
      </div>

      {/* Stock */}
      <div style={{ marginTop: "10px" }}>
        <span
          style={{
            display: "inline-block",
            fontSize: "12px",
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: "20px",
            background: stockColors.bg,
            color: stockColors.text,
          }}
        >
          {stockLabel}
        </span>
      </div>

      {/* Add to cart */}
      <button
        type="button"
        onClick={handleAddToCart}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        disabled={isOutOfStock}
        style={{
          marginTop: "16px",
          width: "100%",
          padding: "12px",
          fontSize: "14px",
          fontWeight: 600,
          borderRadius: "10px",
          border: "none",
          color: "#FFFFFF",
          background: isOutOfStock
            ? "#B9BEC5"
            : isButtonHovered
            ? COLORS.greenHover
            : COLORS.green,
          cursor: isOutOfStock ? "not-allowed" : "pointer",
          transition: "background 0.2s ease",
        }}
      >
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}

export default ProductCard;

/* ------------------------------------------------------------------ */
/*  Reusable style constants                                           */
/* ------------------------------------------------------------------ */
const badgeBase = {
  fontSize: "10.5px",
  fontWeight: 700,
  letterSpacing: "0.03em",
  padding: "4px 10px",
  borderRadius: "20px",
  textTransform: "uppercase",
};

const styles = {
  newBadge: {
    ...badgeBase,
    background: COLORS.greenSoftBg,
    color: COLORS.greenSoftText,
  },
  bestBadge: {
    ...badgeBase,
    background: COLORS.amberSoftBg,
    color: COLORS.amberSoftText,
  },
  discount: {
    fontSize: "12px",
    fontWeight: 700,
    color: COLORS.discountBg,
  },
};
