import api from "./api";

export const getProductsByCategory = async (categoryName) => {

    const response = await api.get(
        `/products/category/${categoryName}`
    );

    return response.data;
};