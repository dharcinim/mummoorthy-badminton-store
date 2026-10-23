
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BulkEnquiry from "../pages/BulkEnquiry"; 

function Hero() {
  const navigate = useNavigate();
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  return (
    <div style={styles.hero}>

      {/* Overlay */}
      <div style={styles.overlay}></div>

      {/* Content */}
      <div style={styles.content}>
        
        <h1 style={styles.heading}>
          SMASH <span style={styles.highlight}>THE LIMITS</span>
        </h1>

        <p style={styles.subtext}>
          Professional Badminton Gear • Authorized Dealer • Direct Supply
        </p>

        <div style={styles.buttonGroup}>

          <button
            style={styles.primaryBtn}
            onMouseEnter={(e) => {
              e.target.style.background = "#1557d6";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#1e6cff";
              e.target.style.transform = "scale(1)";

            }}
            onClick={() => navigate("/products")}
          >
            Explore Products
          </button>

          <button
            style={styles.outlineBtn}
            onMouseEnter={(e) => {
              e.target.style.background = "#00e676";
              e.target.style.color = "#000";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#00e676";
              e.target.style.transform = "scale(1)";
            }}
            onClick={() => setIsBulkOpen(true)}
          >
            Bulk Enquiry
          </button>

        </div>

      </div>
      <BulkEnquiry isOpen={isBulkOpen} onClose={() => setIsBulkOpen(false)} />
    </div>
  );
}

export default Hero;
const styles = {
  hero: {
    position: "relative",
    width: "100%",
    height: "550px",
    backgroundImage: `url(https://res.cloudinary.com/hwrjcjaf/image/upload/v1792737368/Hero_tmtn1e.webp)`, // 🔥 change to your image path
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    padding: "0 60px",
    color: "#fff",
    boxSizing: "border-box"   // ✅ FIX
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2))"
  },

  content: {
    position: "relative",
    zIndex: 2,
    maxWidth: "600px"
  },

  heading: {
    fontSize: "48px",
    fontWeight: "800",
    marginBottom: "15px"
  },

  highlight: {
    color: "#00e676"
  },

  subtext: {
    fontSize: "16px",
    color: "#ddd",
    marginBottom: "25px"
  },

  buttonGroup: {
    display: "flex",
    gap: "15px"
  },

  primaryBtn: {
    padding: "12px 25px",
    borderRadius: "30px",
    border: "none",
    background: "#1e6cff",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer"
  },


  

    outlineBtn: {
    padding: "12px 25px",
    borderRadius: "30px",
    border: "2px solid #00e676",
    background: "transparent",
    color: "#00e676",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease"
    },
  
};