import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";

import { getProducts } from "../services/productService";

const defaultFilters = {
  category: "All",
  brand: "All Brands",
  weight: "All",
  flexibility: "All",
  playingLevel: "All",

  sort: "newest",
  maxPrice: 20000,
  search: "",
  onlyNew: false,
  onlyBestSeller: false,
};

function Products() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  //alert("Products Render");
  const [filters, setFilters] = useState(defaultFilters);

  const [view, setView] = useState("grid");

    useEffect(() => {

    const q = searchParams.get("search");

    if (q) {

      setFilters((prev) => ({
        ...prev,
        search: q,
      }));

    }

  }, [searchParams]);

    useEffect(() => {

    const loadProducts = async () => {

      try {

        const data = await getProducts();

        const mappedProducts = data.map((p) => ({

          ...p,

          brand: p.brandName,
          category: p.categoryName,

          image: p.imageUrl,

          price: p.sellingPrice,
          oldPrice: p.mrp,

          isNew: p.newArrival,
          isBestSeller: p.bestSeller,

          weight: p.weight,
          flexibility: p.flexibility,
          playingLevel: p.playingLevel,
          balance: p.balance,
          frameMaterial: p.frameMaterial,

        }));

        setProducts(mappedProducts);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    loadProducts();

  }, []);

    const filteredProducts = useMemo(() => {
   // throw new Error("USEMEMO IS RUNNING");
    let result = [...products];
    console.log("FILTER STATE:", filters);

    

    // ---------------- SEARCH ----------------

    if (filters.search.trim() !== "") {

      const keyword = filters.search.toLowerCase();

      result = result.filter((product) =>

        product.name?.toLowerCase().includes(keyword) ||

        product.brand?.toLowerCase().includes(keyword) ||

        product.category?.toLowerCase().includes(keyword)

      );

    }

    // ---------------- CATEGORY ----------------

    if (filters.category !== "All") {

      result = result.filter(

        (product) => product.category === filters.category

      );

    }

    // ---------------- BRAND ----------------

    if (filters.brand !== "All Brands") {

      result = result.filter(

        (product) => product.brand === filters.brand

      );

    }

    // ---------------- WEIGHT ----------------

if (filters.weight !== "All") {
  result = result.filter(
    (product) => product.weight === filters.weight
  );
}

// ---------------- FLEXIBILITY ----------------

if (filters.flexibility !== "All") {
  result = result.filter(
    (product) => product.flexibility === filters.flexibility
  );
}

// ---------------- PLAYING LEVEL ----------------

if (filters.playingLevel !== "All") {
  console.log("Selected:", filters.playingLevel);

  console.table(
    result.map(p => ({
      name: p.name,
      playingLevel: p.playingLevel
    }))
  );

  result = result.filter(
    (product) => product.playingLevel?.trim() === filters.playingLevel.trim()
  );
}

    // ---------------- PRICE ----------------

    result = result.filter(

      (product) => product.price <= filters.maxPrice

    );

    // ---------------- NEW ARRIVAL ----------------

    if (filters.onlyNew) {

      result = result.filter(

        (product) => product.isNew

      );

    }

    // ---------------- BEST SELLER ----------------

    if (filters.onlyBestSeller) {

      result = result.filter(

        (product) => product.isBestSeller

      );

    }

    // ---------------- SORT ----------------

    switch (filters.sort) {

      case "price_asc":

        result.sort((a, b) => a.price - b.price);

        break;

      case "price_desc":

        result.sort((a, b) => b.price - a.price);

        break;

      default:

        result.sort((a, b) => b.id - a.id);

    }
    console.log(filters);
    return result;

  }, [products, filters]);

    if (loading) {

    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px",
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        Loading Products...
      </div>
    );

  }

  return (

    <div
  style={{
    display: "flex",
    gap: "25px",
    padding: "30px",
    background: "#f8f9fa",
    minHeight: "100vh",
  }}
>

  <div
    style={{
      width: "280px",
      flexShrink: 0,
    }}
  >

    <FilterBar
      filters={filters}
       setFilters={setFilters}
      
    />

  </div>

  <div
    style={{
      flex: 1,
    }}
  >

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >

     

      <h2>{filteredProducts.length} Products Found</h2>

      <div>

        <button
          onClick={() => setView("grid")}
          style={{
            padding: "10px 18px",
            background: view === "grid" ? "#000" : "#fff",
            color: view === "grid" ? "#fff" : "#000",
            border: "1px solid #000",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "0.3s",
            marginRight: "10px",
          }}
        >
          ⊞ Grid
        </button>

        <button
          onClick={() => setView("list")}
          style={{
              padding: "10px 18px",
              background: view === "list" ? "#000" : "#fff",
              color: view === "list" ? "#fff" : "#000",
              border: "1px solid #000",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "0.3s",
            }}
        >
          ☰ List
        </button>

      </div>

    </div>

        <div
      style={{
        display: view === "grid" ? "grid" : "flex",
        gridTemplateColumns:
          view === "grid"
            ? "repeat(auto-fill, minmax(260px, 1fr))"
            : "none",
        flexDirection: view === "list" ? "column" : undefined,
        gap: "20px",
      }}
    >
      {filteredProducts.length === 0 ? (

        <h2>No Products Found</h2>

      ) : (

        filteredProducts.map((product) => (

          <ProductCard
            key={product.id}
            product={product}
            showNew={product.isNew}
            showBest={product.isBestSeller}
          />

        ))

      )}
    </div>

  </div>

</div>

   

  );

}

export default Products;

