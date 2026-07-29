import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CartProvider from "./context/CartContext";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import TopStrip from "./components/TopStrip";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import NewArrivals from "./pages/NewArrivals";
import BestSellers from "./pages/BestSellers";
import Collections from "./pages/Collections";
import Brands from "./pages/Brands";
import Services from "./pages/Services";
import Tracking from "./pages/Tracking";
import Categories from "./pages/Categories";
import { WishlistProvider } from "./context/WishlistContext";
import WishlistPage from "./pages/WishlistPage";
import Checkout from "./pages/Checkout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RacketStringing from "./pages/RacketStringing";
import RacketRepair    from "./pages/RacketRepair";
import Coaching        from "./pages/Coaching";
import AdminRoute from "./components/AdminRoute";
import AdminPanel from "./pages/admin/AdminPanel";
import ActivityLog from "./pages/admin/ActivityLog";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageUsers from "./pages/admin/ManageUsers";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/Orderdetails";
import { ToastContainer } from "react-toastify";


function App() {
  const [search, setSearch] = useState("");

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>

            {/* Global header — shows on every page */}
            <div style={{ position: "sticky", top: 0, zIndex: 1000 }}>
              <TopStrip /> 
              <Header
                search={search}
                setSearch={setSearch}
               />
              <Navbar />
            </div>

            <Routes>
                {/* Public routes */}
                <Route path="/"                    element={<Home search={search}  />}           />
                <Route path="/products"            element={<Products />}       />
                <Route path="/products/:id"        element={<ProductDetail />}  />
                <Route path="/category/:category"  element={<CategoryPage />}   />
                <Route path="/categories"          element={<Categories />}     />
                <Route path="/new-arrivals"        element={<NewArrivals />}    />
                <Route path="/best-sellers"        element={<BestSellers />}    />
                <Route path="/collections"         element={<Collections />}    />
                <Route path="/brands"              element={<Brands />}         />
                <Route path="/services"            element={<Services />}       />
                <Route path="/login"               element={<LoginPage />}      />
                <Route path="/orders" element={<ProtectedRoute><MyOrders isDark={true} /></ProtectedRoute>} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/orders/:orderId" element={<OrderDetails />} />

                {/* Service pages */}
                <Route path="/services/stringing"  element={<ProtectedRoute><RacketStringing /></ProtectedRoute>} />
                <Route path="/services/repair"     element={<ProtectedRoute><RacketRepair /></ProtectedRoute>}    />
                <Route path="/services/coaching"   element={<ProtectedRoute><Coaching /></ProtectedRoute>}        />

                {/* Protected routes */}
                <Route path="/cart"      element={<ProtectedRoute><Cart /></ProtectedRoute>}         />
                <Route path="/checkout"  element={<ProtectedRoute><Checkout /></ProtectedRoute>}     />
                <Route path="/wishlist"  element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
                <Route path="/admin/bookings" element={<AdminRoute><ManageBookings /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
                <Route path="/admin/activity" element={<AdminRoute superAdminOnly={true}><ActivityLog /></AdminRoute>} />
                
                

          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />

          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;