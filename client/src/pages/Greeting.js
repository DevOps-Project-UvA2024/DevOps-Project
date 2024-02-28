import React, { useContext, useState } from 'react';
import StoreContext from '../store/StoreContext';

const Greeting = () => {
  const { state } = useContext(StoreContext);
  // const [downloadUrl] = useState('');

  // const handleDownload = async (fileKey) => {
  //   try {
  //     const response = await fetch(`api/users/user/download/${fileKey}`, {
  //       credentials: 'include' // if you're using cookies for auth
  //     });
  //     if (!response.ok) {
  //       throw new Error(`Server responded with status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     // Redirect or navigate to the URL as soon as it's received
  //     window.location.href = data.url; // This will start the download immediately
  //   } catch (error) {
  //     console.error('Error during file download:', error);
  //   }
  // };

  // Call this function when the user clicks the download button
  // const downloadFile = () => {
  //   if (downloadUrl) {
  //     window.location.href = downloadUrl; // This will start the download
  //   } else {
  //     // The fileKey should be known, either passed through state or defined
  //     const fileKey = 'mcaskickconditions.jpg';
  //     handleDownload(fileKey);
  //   }
  // };

  console.log(state);

  return (
    <div>
      {state.user ? (
        <>
          <h1>Hello, {state.user.username}</h1>
          {/* <button onClick={downloadFile}>Download File</button> */}
        </>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
};

export default Greeting;