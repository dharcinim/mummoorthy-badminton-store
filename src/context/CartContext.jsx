
import React,{ createContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart as addToCartApi,
  updateQuantity,
  removeItem as removeItemApi,
  clearCart as clearCartApi
} from "../services/cartService";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";


// Create context
export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  
  const { user } = useAuth();
  const customerId = user?.customerId;

  useEffect(() => {
    if (customerId) {
        loadCart();
    } else {
        setCart([]);
    }
   }, [customerId]);



const loadCart = async () => {

    try {

        const response = await getCart(customerId);

        setCart(response);

    } catch (error) {

        console.error(error);

    }

};

  console.log(cart); //  for checking cart
  // ADD TO CART
  const addToCart = async (product) => {
  console.log(JSON.stringify(product, null, 2));


    try {

        await addToCartApi(

            customerId,

            product.productVariantId,

            product.quantity

        );
         console.log("Add API completed");
        await loadCart();
        toast.success("Product added to cart");

    } catch (error) {

        console.error(error);

    }

};
//increase quantity
const increaseQty = async (cartItemId) => {

  const item = cart.find(i => i.cartItemId === cartItemId);

  if (!item) return;

  try {

    await updateQuantity(
      cartItemId,
      item.quantity + 1
    );

    await loadCart();
    toast.success("Quantity updated");

  } catch (error) {

    console.error(error);

  }

};
//decrease quantity
const decreaseQty = async (cartItemId) => {

  const item = cart.find(i => i.cartItemId === cartItemId);

  if (!item) return;

  if (item.quantity === 1) {

    await removeItem(cartItemId);

    return;

  }

  try {

    await updateQuantity(
      cartItemId,
      item.quantity - 1
    );

    await loadCart();
    toast.info("Quantity updated");

  } catch (error) {

    console.error(error);

  }

};

//Remove Item
const removeItem = async (cartItemId) => {

  try {

    await removeItemApi(cartItemId);

    await loadCart();
    toast.success("Item removed from cart");

  } catch (error) {

    console.error(error);

  }

};

//Clear Cart
const clearCart = async () => {

  try {

    await clearCartApi(customerId);
     setCart([]);   // Clear React state immediately
    //await loadCart();
    if (showToast) {
      toast.success("Cart cleared");
    }

  } catch (error) {

    console.error(error);

  }

};

return (
  <CartContext.Provider
    value={{
      cart,
      addToCart,
      increaseQty,
      decreaseQty,
      removeItem,
      clearCart,
    }}
  >
    {children}
  </CartContext.Provider>
);
}