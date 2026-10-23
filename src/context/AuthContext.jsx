import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { getCustomerByFirebaseUid, createCustomer } from "../services/customerService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Listen for auth state changes
 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {

      let backendCustomer = await getCustomerByFirebaseUid(firebaseUser.uid);

        if (!backendCustomer) {

            console.log("Customer not found. Creating...");

            const customerPayload = {
                firebaseUid: firebaseUser.uid,
                fullName: firebaseUser.displayName || "",
                email: firebaseUser.email,
                phoneNumber: "",
                profileImage: "",
                active: true,
            };

            backendCustomer = await createCustomer(customerPayload);

            console.log("Customer created:", backendCustomer);
        }

        setUser({
            uid: firebaseUser.uid,
            customerId: backendCustomer.id,
            email: firebaseUser.email,
            name: firebaseUser.displayName || backendCustomer.fullName || "",
        });

    } else {
      setUser(null);
    }

    setLoading(false);
  });

  return () => unsubscribe();
}, []);

  // Signup
 const signup = async (userData) => {
  try {
    const { name, email, password } = userData;

    const result = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(result.user, { displayName: name });

    await setDoc(doc(db, "users", result.user.uid), {
      name,
      email,
      createdAt: new Date().toISOString(),
    });
     

  const customerPayload = {
  fullName: name,
  email: email,
  firebaseUid: result.user.uid,
  phoneNumber: "",
  profileImage: "",
  active: true,
};

console.log("Customer Payload:", customerPayload);

const customer = await createCustomer(customerPayload);

console.log("Customer Response:", customer);
    

    console.log("Customer created:", customer);
    //await createCustomer(customerData);
    setUser({
      uid: result.user.uid,
      customerId: customer.id,
      name,
      email,
    });

  } catch (error) {
    console.error("Signup Error:", error);
  }
};
  // Login
  const loginWithCredentials = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Get customer from Spring Boot
    let backendCustomer = await getCustomerByFirebaseUid(result.user.uid);

      if (!backendCustomer) {

          console.log("Customer not found. Creating new customer...");

          const customerPayload = {
              firebaseUid: result.user.uid,
              fullName: result.user.displayName || "",
              email: result.user.email,
              phoneNumber: "",
              profileImage: "",
              active: true,
          };

          backendCustomer = await createCustomer(customerPayload);

          console.log("New Customer Created:", backendCustomer);
      }

      console.log("Backend Customer:", backendCustomer);

      setUser({
          uid: result.user.uid,
          customerId: backendCustomer.id,
          email: result.user.email,
          name: result.user.displayName || backendCustomer.fullName,
      });

    return true;
  } catch (error) {
    console.error("Login error:", error.message);
    return false;
  }
};

  // Logout
 const logout = async () => {
  await signOut(auth);

 console.log("Firebase currentUser:", auth.currentUser);


  setUser(null);
  toast.info("Logged out successfully");
};

  console.log("Auth User:", user);


  return (
    <AuthContext.Provider value={{ user, loading, signup, loginWithCredentials, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
