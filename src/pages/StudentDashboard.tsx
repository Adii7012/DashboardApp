import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './StudentDashboard.css';

const StudentDashboard: React.FC = () => {
  const [folders, setFolders] = useState<any[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'folders'));
        const folderData: any[] = [];
        querySnapshot.forEach((docSnap) => {
          folderData.push({ id: docSnap.id, ...docSnap.data() });
        });
        setFolders(folderData);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };

    fetchFolders();
  }, []);

  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>
      <div className="folder-grid">
        {folders.length === 0 ? (
          <p>No folders available</p>
        ) : (
          folders.map((folder) => (
            <div key={folder.id} className="folder">
              {folder.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
