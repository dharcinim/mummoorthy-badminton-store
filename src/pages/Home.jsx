import React, { useState } from "react";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Categories from "../components/Categories";
import NewArrivals from "../components/NewArrivals";
import BestSellers from "../components/BestSellers";
import Collections from "../components/Collections";
import Brands from "../components/Brands";
import Footer from "../components/Footer";


function Home() {
  
  return (
    <>
      <Hero />
      <Categories />
      <Services />
      <NewArrivals />
      <BestSellers />
      <Collections />
      <Brands />
      <Footer />
    </>
  );
}

export default Home;