


import React, { useContext, useState } from "react";
import { FiShoppingCart, FiSearch } from "react-icons/fi";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";





function Header() {

  const { cart, clearCart  } = useContext(CartContext);
  const { wishlist, clearWishlist } = useWishlist();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (

    <>
    <style>{`
      @keyframes cartBounce {
        0% { transform: scale(1); }
        25% { transform: scale(1.25); }
        50% { transform: scale(0.95); }
        75% { transform: scale(1.15); }
        100% { transform: scale(1); }
      }

      .cart-bounce {
        animation: cartBounce 0.6s ease;
      }
    `}</style>



    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 60px",
      background: "#fff",
      borderBottom: "1px solid #eee"
    }}>

      {/* LEFT */}
      <div
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          minWidth: "200px",
          cursor: "pointer",
        }}>
        <span style={{
          fontWeight: "600",
          fontSize: "18px"
        }}>
          Mummoorthy Badminton Store
        </span>
      </div>

      {/* CENTER — Search Bar */}
      <div style={{
        flex: 1,
        maxWidth: "600px",
        margin: "0 40px",
        position: "relative"
      }}>
        <input
          placeholder="Search rackets, shoes, kits..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            padding: "12px 48px 12px 20px",
            borderRadius: "30px",
            border: "1px solid #ddd",
            outline: "none",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />
        {/* Search icon button */}
        <button
          onClick={handleSearch}
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px",
          }}
        >
          <FiSearch size={18} color="#888" />
        </button>
      </div>
    
      {/* RIGHT */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "25px",
        minWidth: "200px",
        justifyContent: "flex-end"
      }}>

        {/* Wishlist */}
        <div
          id="wishlist-icon"
          onClick={() => navigate("/wishlist")}
          style={{ position: "relative", cursor: "pointer" }}
        >
          <span style={{ fontSize: "20px" }}>❤️</span>
          {wishlist.length > 0 && (
            <span style={{
              position: "absolute",
              top: "-6px",
              right: "-8px",
              background: "red",
              color: "#fff",
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "50%"
            }}>
              {wishlist.length}
            </span>
          )}
        </div>

        {/* Cart */}
        <div
          id="cart-icon"
          onClick={() => navigate("/cart")}
          style={{ position: "relative", cursor: "pointer" 
            

          }}
        >
          <FiShoppingCart size={22} color="#000" />
          {totalItems > 0 && (
            <span style={{
              position: "absolute",
              top: "-6px",
              right: "-8px",
              background: "red",
              color: "#fff",
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "50%"
            }}>
              {totalItems}
            </span>
          )}
        </div>

        {/* Login / User */}
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>
              Hi, {user.name?.split(" ")[0]}
            </span>

            {/* Admin button — only for admins */}
            {["dharcinim@gmail.com", "mummoorthysaw@gmail.com"].includes(user.email) && (
              <span
                onClick={() => navigate("/admin")}
                style={{
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#000",
                  background: "#00FF9C",
                  padding: "4px 12px",
                  borderRadius: "20px",
                }}
              >
                Admin
              </span>
            )}

            {/* My Orders */}
            <span
              onClick={() => navigate("/orders")}
              style={{ cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
            >
              My Orders
            </span>

            <span
              onClick={async () => {
                 clearCart();
                 clearWishlist();
                await logout();
                navigate("/");
              }}
              style={{ cursor: "pointer", fontSize: "13px", color: "#e00", fontWeight: "600" }}
            >
              Logout
            </span>
          </div>
        ) : (
          <span
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer", fontSize: "14px", fontWeight: "600" }}
          >
            Login
          </span>
        )}

      </div>

    </div>
    </>
  );
};

export default Header;
