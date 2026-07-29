import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getWishlist,
    addWishlist,
    removeWishlist,
} from "../services/wishlistService";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";


export const WishlistContext = createContext();



export function WishlistProvider({ children }) {

    const { user } = useAuth();
    const customerId = user?.customerId;

    const [wishlist, setWishlist] = useState([]);

    const clearWishlist = () => {
    setWishlist([]);
    };

   useEffect(() => {
    if (customerId) {
        loadWishlist();
    } else {
        setWishlist([]);
    }
}, [customerId]);

    

    const loadWishlist = async () => {
        try {
            if (!customerId) return;
            console.log("Loading wishlist for:", customerId);

            const data = await getWishlist(customerId);
            console.log("Wishlist Response:", data);
            setWishlist(data);
        } catch (err) {
            console.error(err);
        }
    };

    const isLiked = (variantId) => {
    return wishlist.some(
        item => item.productVariantId === variantId
    );
};

            const isProductLiked = (productId) => {
    return wishlist.some(
        item => item.productId === productId
    );
};

    const toggleWishlist = async (variantId) => {

        console.log("Customer ID:", customerId);
console.log("Variant ID:", variantId);

        try {

            const existing = wishlist.find(
            item => item.productVariantId === variantId
             );

            if (existing) {

                await removeWishlist(existing.wishlistId);
                toast.info("Removed from wishlist");


            } else {

                if (!customerId) {
                        toast.error("Please login first");
                        return;
                    }

                await addWishlist(customerId, variantId);
                toast.success("Added to wishlist");

            }

            await loadWishlist();

        } catch (err) {

            console.error(err);

        }



    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                toggleWishlist,
                isLiked,
                isProductLiked,
                loadWishlist,
                clearWishlist
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => useContext(WishlistContext);