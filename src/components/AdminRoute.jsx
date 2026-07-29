import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children, superAdminOnly = false }) {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const docRef = doc(db, "admins", user.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        } else {
          setRole(null);
        }
      } catch (e) {
        setRole(null);
      }
      setLoading(false);
    };
    checkRole();
  }, [user]);

  if (loading) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#0a0a0a", color: "#fff",
      fontSize: "16px", fontFamily: "Inter, sans-serif"
    }}>
      Verifying access...
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (!role) return <Navigate to="/" replace />;
  if (superAdminOnly && role !== "superadmin") return <Navigate to="/admin" replace />;

  return children;
}


    