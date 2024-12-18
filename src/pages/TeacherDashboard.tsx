import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebaseConfig'; // Ensure Firebase is correctly imported
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard: React.FC = () => {
  const [isApproved, setIsApproved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkApproval = async () => {
      const user = auth.currentUser;
      if (user) {
        // Get user data from Firestore
        const userDocRef = doc(firestore, 'users', user.uid);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const role = userData?.role;

          // Check if the teacher is approved
          if (role === 'teacher' && userData?.status === 'approved') {
            setIsApproved(true);
          } else {
            setIsApproved(false);
            navigate('/'); // Redirect if not approved
          }
        }
      }
    };

    checkApproval();
  }, [navigate]);

  if (!isApproved) {
    return <div>Your account is under review. Please wait for approval notification in your email.</div>;
  }

  return (
    <div>
      <h1>Welcome to the Teacher Dashboard</h1>
      {/* Teacher's dashboard content here */}
    </div>
  );
};

export default TeacherDashboard;
