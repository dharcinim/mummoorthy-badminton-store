import api from "./api";

export const getCustomerByFirebaseUid = async (uid) => {
    const response = await api.get(`/customers/firebase/${uid}`);
    return response.data;
};

export const createCustomer = async (customer) => {
     console.log("Creating customer:", customer);
    const response = await api.post("/customers", customer);
     console.log("Create customer response:", response.data);
    return response.data;
};