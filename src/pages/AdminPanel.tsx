// src/pages/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const AdminPanel: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // Fetch all users and filter for teachers with status "pending"
        const querySnapshot = await getDocs(collection(firestore, 'users'));
        const teacherData: any[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.role === 'teacher' && data.status === 'pending') {
            teacherData.push({ id: docSnap.id, ...data });
          }
        });
        setTeachers(teacherData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teachers: ", error);
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleApproval = async (teacherId: string) => {
    try {
      const teacherRef = doc(firestore, 'users', teacherId);
      await updateDoc(teacherRef, { status: 'approved' });

      // Remove the approved teacher from the pending list
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
    } catch (error) {
      console.error("Error approving teacher: ", error);
    }
  };

  const handleRejection = async (teacherId: string) => {
    try {
      const teacherRef = doc(firestore, 'users', teacherId);
      await updateDoc(teacherRef, { status: 'rejected' });

      // Remove the rejected teacher from the pending list
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
    } catch (error) {
      console.error("Error rejecting teacher: ", error);
    }
  };

  if (loading) {
    return <div>Loading teachers...</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>Pending Teachers</h2>
      <ul>
        {teachers.length === 0 ? (
          <li>No pending teachers</li>
        ) : (
          teachers.map((teacher) => (
            <li key={teacher.id}>
              <p>Name: {teacher.name}</p>
              <p>Email: {teacher.email}</p>
              <button onClick={() => handleApproval(teacher.id)}>Approve</button>
              <button onClick={() => handleRejection(teacher.id)}>Reject</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AdminPanel;
