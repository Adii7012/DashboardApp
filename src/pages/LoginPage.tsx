// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user is an admin by fetching user role from Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const role = userData?.role;

        if (role === 'admin') {
          navigate('/admin-panel');  // Redirect to admin panel
        } else if (role === 'teacher') {
          navigate('/teacher-dashboard');  // Redirect to teacher dashboard
        } else {
          navigate('/student-dashboard');  // Redirect to student dashboard
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Failed to login: ' + error.message);
      } else {
        alert('An unknown error occurred during login.');
      }
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
};

export default LoginPage;
