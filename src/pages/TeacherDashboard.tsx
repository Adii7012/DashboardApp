import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import AddFolderButton from '../components/AddFolderButton'; // Adjust path if necessary
import './TeacherDashboard.css'; // Import the CSS file for styling

const TeacherDashboard: React.FC = () => {
  const [folders, setFolders] = useState<any[]>([]);

  // Fetch folders from Firestore
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
    <div className="dashboard-container">
      <h1>Teacher Dashboard</h1>
      <AddFolderButton />

      <h2>Available Folders</h2>
      <div className="folder-grid">
        {folders.length === 0 ? (
          <p>No folders available</p>
        ) : (
          folders.map((folder) => (
            <div className="folder-card" key={folder.id}>
              <h3>{folder.name}</h3>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
