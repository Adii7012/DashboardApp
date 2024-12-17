// src/components/ProtectedRoute.tsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';  // Use Navigate for redirect
import { auth, firestore } from '../firebaseConfig'; // Ensure Firebase is correctly imported
import { doc, getDoc } from 'firebase/firestore';

interface ProtectedRouteProps {
  element: React.ReactNode;
  role: 'admin' | 'teacher' | 'student';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, role }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        // Get user data from Firestore to check their role
        const userDocRef = doc(firestore, 'users', user.uid);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const userRole = userData?.role; // 'admin', 'teacher', or 'student'
          setUserRole(userRole);
        }
      }
      setLoading(false);
    };

    checkUserRole();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user does not match the required role, redirect to login or home
  if (userRole !== role) {
    return <Navigate to="/" />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
