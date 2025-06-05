import React, { useState, useEffect } from 'react';

const GoogleDriveCard = () => {
  // State to manage loading, error, and file data (which is now simplified)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulating an authentication step
    const simulateAuthentication = () => {
      setTimeout(() => {
        setLoading(false);
      }, 2000); // Simulating a 2-second authentication process
    };

    simulateAuthentication();
  }, []);

  return (
    <div>
      <h3>Google Drive Integration</h3>
      {loading ? (
        <p>Authentication...</p> // Show loading message while simulating authentication
      ) : (
        <p>Authentication successful! You can now integrate Google Drive with HubSpot.</p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default GoogleDriveCard;
