import api from "./api";

export const placeOrder = async (orderData) => {
    const response = await api.post(
        "/checkout/place-order",
        orderData
    );

    return response.data;
};