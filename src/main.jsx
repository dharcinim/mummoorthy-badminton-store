import React from "react";
import "./styles/index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import CartProvider from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <AuthProvider>
    <WishlistProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </WishlistProvider>
  </AuthProvider>
</React.StrictMode>
);