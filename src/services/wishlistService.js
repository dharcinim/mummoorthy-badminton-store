import api from "./api";

// Get Wishlist
export const getWishlist = async (customerId) => {
    const response = await api.get(
        `/wishlist/customer/${customerId}`
    );

    return response.data;
};

// Add Wishlist
export const addWishlist = async (
    customerId,
    productVariantId
) => {

    console.log("=== ADD WISHLIST ===");

    console.log({
        customerId,
        productVariantId,
    });

    const response = await api.post(
        "/wishlist/add",
        {
            customerId,
            productVariantId,
        }
    );

    return response.data;
};

// Remove Wishlist
export const removeWishlist = async (
    wishlistId
) => {

    return await api.delete(
        `/wishlist/${wishlistId}`
    );

};