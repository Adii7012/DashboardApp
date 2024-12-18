import React, { useState } from 'react';
import { firestore } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';

const AddFolderButton: React.FC = () => {
  const [folderName, setFolderName] = useState('');

  const handleAddFolder = async () => {
    if (!folderName.trim()) {
      alert('Folder name cannot be empty!');
      return;
    }

    try {
      // Check if a folder with the same name already exists
      const folderRef = collection(firestore, 'folders');
      const folderQuery = query(folderRef, where('name', '==', folderName));
      const querySnapshot = await getDocs(folderQuery);

      if (!querySnapshot.empty) {
        alert('A folder with this name already exists. Please choose a different name.');
        return;
      }

      // Add the new folder if no duplicate is found
      await addDoc(folderRef, {
        name: folderName,
        createdAt: Timestamp.now(),
        size: 0, // Placeholder size
      });

      alert('Folder added successfully!');
      setFolderName(''); // Clear input
    } catch (error) {
      console.error('Error adding folder:', error);
      alert('Failed to add folder');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        placeholder="Enter folder name"
      />
      <button onClick={handleAddFolder}>Add Folder</button>
    </div>
  );
};

export default AddFolderButton;
