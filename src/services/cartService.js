import api from "./api";
// Add product to cart
export const addToCart = async (customerId, productVariantId, quantity = 1) => {

    const payload = {
        customerId,
        productVariantId,
        quantity
    };

    console.log("Payload:", payload);

    const response = await api.post("/carts/add", payload);

    return response.data;
};
// Get customer cart
export const getCart = async (customerId) => {

    const response =
        await api.get(`/carts/response/${customerId}`);

    return response.data;

};

// Update quantity
export const updateQuantity = async (cartItemId, quantity) => {
    const response = await api.put(
        `/carts/item/${cartItemId}?quantity=${quantity}`
    );

    return response.data;
};

// Remove item
export const removeItem = async (cartItemId) => {
    const response = await api.delete(`/carts/item/${cartItemId}`);

    return response.data;
};

// Clear cart
export const clearCart = async (customerId) => {
    const response = await api.delete(`/carts/customer/${customerId}`);

    return response.data;
};