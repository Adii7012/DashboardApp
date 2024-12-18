import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, firestore } from '../firebaseConfig';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (!userDoc.exists()) {
        setError('User data not found. Please contact support.');
        return;
      }

      const userData = userDoc.data();
      const role = userData?.role;

      // Check if the user is a teacher
      if (role === 'teacher') {
        if (userData?.status === 'approved') {
          // If the teacher is approved, navigate to the teacher dashboard
          navigate('/teacher-dashboard');
        } else {
          // If the teacher is not approved
          setError('Your account is pending approval. Please wait for admin approval.');
        }
      } else if (role === 'student') {
        // If the user is a student, navigate to the student dashboard
        navigate('/student-dashboard');
      } else if (role === 'admin') {
        // If the user is an admin, navigate to the admin panel
        navigate('/admin-panel');
      } else {
        setError('Invalid account status. Please contact support.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
};

export default LoginPage;
