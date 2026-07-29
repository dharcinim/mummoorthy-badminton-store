import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";

function WishlistPage() {

  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  return (

    <div
      style={{
        padding: "32px 40px",
        minHeight: "80vh",
        background: "#f7f7f7",
      }}
    >

      {/* TOP ROW */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >

        <div>

          <span
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#0a0a0a",
            }}
          >
            My Wishlist
          </span>

          <span
            style={{
              fontSize: "14px",
              color: "#888",
              marginLeft: "10px",
            }}
          >
            {wishlist.length} item
            {wishlist.length !== 1 ? "s" : ""}
          </span>

        </div>

        {wishlist.length > 0 && (

          <button
            onClick={() =>
              wishlist.forEach((item) =>
                toggleWishlist(item.productVariantId)
              )
            }
            style={{
              fontSize: "13px",
              color: "#e00",
              background: "none",
              border: "1px solid #fcc",
              padding: "6px 16px",
              borderRadius: "20px",
              cursor: "pointer",
            }}
          >
            Clear all
          </button>

        )}

      </div>
            {/* EMPTY STATE */}

      {wishlist.length === 0 ? (

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 20px",
            textAlign: "center",
          }}
        >

          <div
            style={{
              fontSize: "64px",
              marginBottom: "16px",
              opacity: 0.25,
            }}
          >
            🤍
          </div>

          <h2
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#0a0a0a",
              marginBottom: "8px",
            }}
          >
            Your wishlist is empty
          </h2>

          <p
            style={{
              fontSize: "14px",
              color: "#888",
              marginBottom: "24px",
            }}
          >
            Like products to save them here
          </p>

          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 28px",
              background: "#0a0a0a",
              color: "#fff",
              border: "none",
              borderRadius: "24px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Continue Shopping
          </button>

        </div>

      ) : (

                <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >

          {wishlist.map((item) => {

            const discount =
              item.mrp > item.sellingPrice
                ? Math.round(
                    ((item.mrp - item.sellingPrice) / item.mrp) * 100
                  )
                : 0;

            return (

              <div
                key={item.wishlistId}
                onClick={() => navigate(`/products/${item.productId}`)}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "14px",
                  position: "relative",
                  cursor: "pointer",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 20px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(0,0,0,0.05)";
                }}
              >

                {/* REMOVE */}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item.productVariantId);
                  }}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "none",
                    border: "none",
                    fontSize: "16px",
                    cursor: "pointer",
                    color: "#ccc",
                    lineHeight: 1,
                  }}
                  title="Remove from wishlist"
                >
                  ✕
                </button>

                {/* IMAGE */}

                <div
                  style={{
                    height: "150px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f5f5",
                    borderRadius: "8px",
                    marginBottom: "12px",
                  }}
                >

                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />

                </div>

                                {/* NAME */}

                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#0a0a0a",
                    marginBottom: "6px",
                  }}
                >
                  {item.productName}
                </h3>

                {/* PRICE */}

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#bbb",
                      textDecoration: "line-through",
                    }}
                  >
                    ₹{item.mrp}
                  </span>

                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "700",
                      color: "#0a0a0a",
                    }}
                  >
                    ₹{item.sellingPrice}
                  </span>

                  {discount > 0 && (
                    <span
                      style={{
                        fontSize: "11px",
                        background: "#ff3b3b",
                        color: "#fff",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      -{discount}%
                    </span>
                  )}
                </div>

                {/* STARS */}

                <div
                  style={{
                    color: "#f5a623",
                    fontSize: "12px",
                    marginBottom: "10px",
                  }}
                >
                  ⭐⭐⭐⭐☆
                </div>

                {/* ADD TO CART */}

                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    addToCart({
                      productVariantId: item.productVariantId,
                      quantity: 1,
                    });
                  }}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "#0a0a0a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Add to Cart
                </button>

              </div>

            );

          })}

        </div>

      )}

    </div>

  );

}

export default WishlistPage;