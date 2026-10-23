import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Rackets",      image: "https://res.cloudinary.com/hwrjcjaf/image/upload/v1792737330/Racket_ayhrrp.webp" },
  { name: "Shoes",        image: "https://res.cloudinary.com/hwrjcjaf/image/upload/v1792737336/Shoe_uxibaz.webp" },
  { name: "Shuttlecocks", image: "https://res.cloudinary.com/hwrjcjaf/image/upload/v1792737331/shuttle_v64xtb.webp" },
  { name: "Strings",      image: "https://res.cloudinary.com/hwrjcjaf/image/upload/v1792737329/String_b1cop4.webp" },
  { name: "Grips",        image: "https://res.cloudinary.com/hwrjcjaf/image/upload/v1792737327/Grip_oopi8b.webp" },
  { name: "Clothing",     image: "https://res.cloudinary.com/hwrjcjaf/image/upload/v1792737330/TShrit_xz11ip.webp" },
  { name: "Accessories",  image: "https://res.cloudinary.com/hwrjcjaf/image/upload/v1792737331/Socks_c3rkvb.webp" },  
  { name: "Kits",         image: "https://res.cloudinary.com/hwrjcjaf/image/upload/v1792737332/Kit_jhubxh.webp" },
];

function Categories() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>

      <h2 style={styles.heading}>Shop by Category</h2>

      <div style={styles.grid}>
        {categories.map((item, index) => (
          <div
            key={index}
            style={{
              ...styles.card,
              backgroundImage: item.image ? `url(${item.image})` : undefined
            }}
            onClick={() => navigate(`/category/${item.name.toLowerCase()}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
            }}
          >
            <div style={styles.overlay}></div>
            <p style={styles.text}>{item.name}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Categories;

const styles = {
  container: {
    padding: "60px 60px",
    background: "#fff"
  },

  heading: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "30px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px"
  },

  card: {
    height: "160px",
    borderRadius: "14px",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    padding: "12px",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    overflow: "hidden"
  },

  text: {
    position: "relative",
    fontSize: "14px",
    fontWeight: "600"
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)"
  }
};
