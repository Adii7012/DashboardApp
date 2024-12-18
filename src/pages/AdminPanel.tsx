import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const AdminPanel: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'users'));
        const teacherData: any[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.role === 'teacher') {
            teacherData.push({ id: docSnap.id, ...data });
          }
        });
        setTeachers(teacherData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const updateStatus = async (teacherId: string, newStatus: string) => {
    try {
      const teacherRef = doc(firestore, 'users', teacherId);
      await updateDoc(teacherRef, { status: newStatus });
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === teacherId ? { ...teacher, status: newStatus } : teacher
        )
      );
      alert(`Teacher status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating teacher status:', error);
    }
  };

  if (loading) {
    return <div>Loading teachers...</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>Manage Teachers</h2>
      <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%' }}>
  <thead>
    <tr>
      <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
      <th style={{ border: '1px solid black', padding: '8px' }}>Email</th>
      <th style={{ border: '1px solid black', padding: '8px' }}>Status</th>
      <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
    </tr>
  </thead>
  <tbody>
    {teachers.length === 0 ? (
      <tr>
        <td colSpan={4} style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
          No teachers found
        </td>
      </tr>
    ) : (
      teachers.map((teacher) => (
        <tr key={teacher.id}>
          <td style={{ border: '1px solid black', padding: '8px' }}>{teacher.name}</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>{teacher.email}</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>{teacher.status}</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            {teacher.status === 'pending' ? (
              <>
                <button onClick={() => updateStatus(teacher.id, 'approved')}>Approve</button>
                <button onClick={() => updateStatus(teacher.id, 'rejected')}>Reject</button>
              </>
            ) : teacher.status === 'approved' ? (
              <button onClick={() => updateStatus(teacher.id, 'pending')}>Unapprove</button>
            ) : (
              <button onClick={() => updateStatus(teacher.id, 'approved')}>Approve</button>
            )}
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>
    </div>
  );
};

export default AdminPanel;
