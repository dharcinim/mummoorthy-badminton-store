import api from "./api";

export const getProduct = async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
};

export const getVariants = async (productId) => {
    const res = await api.get(`/product-variants/product/${productId}`);
    return res.data;
};

export const getProducts = async () => {
    const res = await api.get("/products");
    return res.data;
};

export const getImages = async (productId) => {

    const res = await api.get(`/product-images/product/${productId}`);

    return res.data;

};