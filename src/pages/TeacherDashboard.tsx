import React, { useState, useEffect } from 'react';
import { firestore, storage, auth } from '../firebaseConfig'; // Import storage and auth
import { collection, getDocs, deleteDoc, doc, getDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AddFolderButton from '../components/AddFolderButton';
import './TeacherDashboard.css'; // Import the CSS file for styling

const TeacherDashboard: React.FC = () => {
  const [folders, setFolders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<any | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileDescription, setFileDescription] = useState<string>('');
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false); // State to track upload status

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

    // Get current user's role from Firestore
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setCurrentUserRole(userSnap.data().role);
        }
      }
    };

    fetchUserRole();
  }, []);

  // Handle folder click to show file upload and files
  const handleFolderClick = async (folderId: string) => {
    try {
      const folderDoc = await getDoc(doc(firestore, 'folders', folderId));
      setSelectedFolder({ id: folderDoc.id, ...folderDoc.data() });

      // Fetch files for this folder
      const filesSnapshot = await getDocs(collection(firestore, 'folders', folderId, 'files'));
      const filesData: any[] = [];
      filesSnapshot.forEach((fileDoc) => {
        filesData.push({ id: fileDoc.id, ...fileDoc.data() });
      });
      setFiles(filesData);
    } catch (error) {
      console.error('Error fetching folder or files:', error);
    }
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!fileToUpload || !selectedFolder) {
      alert('Please select a file and folder first.');
      return;
    }

    setIsUploading(true); // Start the loading state

    try {
      // Upload the file to Firebase Storage
      const fileRef = ref(storage, `folders/${selectedFolder.id}/${fileToUpload.name}`);
      await uploadBytes(fileRef, fileToUpload);

      // Get the download URL of the uploaded file
      const fileUrl = await getDownloadURL(fileRef);

      // Add the file document to Firestore
      const fileDocRef = await addDoc(collection(firestore, 'folders', selectedFolder.id, 'files'), {
        name: fileName || fileToUpload.name,
        description: fileDescription,
        url: fileUrl,
        createdAt: new Date(),
      });

      // Update the file list state
      setFiles((prevFiles) => [
        ...prevFiles,
        { id: fileDocRef.id, name: fileName || fileToUpload.name, url: fileUrl, description: fileDescription },
      ]);

      // Show success alert
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      // Show failure alert
      alert('File upload failed. Please try again.');
    } finally {
      setIsUploading(false); // End the loading state
    }
  };

  // Function to delete a folder with confirmation
  const handleDelete = async (folderId: string) => {
    if (currentUserRole !== 'teacher') {
      alert('You are not authorized to delete folders');
      return;
    }

    const confirmation = window.confirm('Are you sure you want to delete this folder?');

    if (confirmation) {
      try {
        await deleteDoc(doc(firestore, 'folders', folderId));
        setFolders(folders.filter((folder) => folder.id !== folderId));
        alert('Folder deleted successfully');
      } catch (error) {
        console.error('Error deleting folder:', error);
        alert('Failed to delete folder');
      }
    }
  };

  return (
    <div>
      <div className="folder-container">
        <h1>Teacher Dashboard</h1>
        <h2>Available Folders</h2>
        <AddFolderButton />
        {folders.length === 0 ? (
          <p>No folders available</p>
        ) : (
          folders.map((folder) => (
            <div className="folder" key={folder.id} onClick={() => handleFolderClick(folder.id)}>
              <p>{folder.name}</p>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(folder.id); }}>Delete</button>
            </div>
          ))
        )}
      </div>

      {selectedFolder && (
        <div className="upload-container">
          <div className="file-list">
            <h4>Files in "{selectedFolder.name}" Folder:</h4>
            <ul>
              {files.length === 0 ? (
                <p>No files uploaded</p>
              ) : (
                files.map((file) => (
                  <li key={file.id}>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.name} - {file.description}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="upload-form">
            <h3>Upload File</h3>
            <input
              type="text"
              placeholder="File Name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
            <textarea
              placeholder="File Description"
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
            ></textarea>
            <input type="file" onChange={handleFileChange} />
            <button 
              onClick={handleFileUpload} 
              disabled={!fileToUpload || isUploading} // Disable if no file is selected or if uploading
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </button>
            {isUploading && <div className="spinner"></div>} {/* Circular spinner */}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
