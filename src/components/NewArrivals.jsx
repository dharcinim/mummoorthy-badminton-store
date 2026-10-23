import React, { useRef, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "../services/productService";

function NewArrivals() {

  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadProducts();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -280 : 280,
        behavior: "smooth",
      });
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.topRow}>
        <h2 style={styles.heading}>New Arrivals</h2>

        <div style={styles.arrowContainer}>
          <button style={styles.arrow} onClick={() => scroll("left")}>←</button>
          <button style={styles.arrow} onClick={() => scroll("right")}>→</button>
        </div>
      </div>

      
<div style={styles.scroll} ref={scrollRef}>
  {products
    .filter(
      (item) =>
        item.newArrival === true &&
        item.active === true
    )
    .map((item) => (
      <div key={item.id} style={styles.cardWrapper}>
        <ProductCard product={item} showNew={true} />
      </div>
    ))}
</div>


    </div>
  );
}

export default NewArrivals;

const styles = {
  container: {
    padding: "60px 20px",
    background: "#fdfbfbfc",
    color: "#090909",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  heading: {
    fontSize: "26px",
    fontWeight: "700",
    margin: 0,
  },

  arrowContainer: {
    display: "flex",
    gap: "10px",
  },

  arrow: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    border: "none",
    background: "#1a1a1a",
    color: "#fff",
    cursor: "pointer",
    fontSize: "18px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },

  scroll: {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
    paddingBottom: "10px",
    scrollBehavior: "smooth",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },

  cardWrapper: {
    minWidth: "250px",
    flexShrink: 0,
  },
};