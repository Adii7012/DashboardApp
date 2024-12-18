// src/pages/RegistrationPage.tsx
import React, { useState } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const RegistrationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [role, setRole] = useState('student'); // Default role is student
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        name,
        dob,
        email,
        role,
        status: role === 'teacher' ? 'pending' : 'approved', // Pending approval for teachers
      });

      // Show alert based on role
      if (role === 'teacher') {
        alert('Your registration is submitted. Once approved by the admin, you will be notified.');
      } else {
        alert('Registration successful. You can now log in.');
      }

      // Redirect to the home page
      navigate('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Registration failed: ' + error.message);
      } else {
        alert('An unknown error occurred during registration.');
      }
    }
  };

  return (
    <div>
      <h1>Registration Page</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>
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
        <div>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationPage;
