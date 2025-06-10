'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function GoogleDriveAuthHandler() {
  const searchParams = useSearchParams();
  const [folderName, setFolderName] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Track button click state

  useEffect(() => {
    const handleGoogleDriveAuth = async () => {
      const code = searchParams.get('code');

      if (!code) {
        return;
      }

      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const { access_token } = await res.json();
        setAccessToken(access_token); // 👉 Save token

        const parentFolderId = '1Qa1M9xWTPDbT22f1dNIGk0YsVe2MzXDe';

        const folderRes = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Folder Moi',
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolderId],
          }),
        });

        const folderData = await folderRes.json();
        setFolderName(folderData.name);
      } catch (err) {
        console.error('Lỗi xác thực hoặc tạo thư mục:', err);
        setError('Lỗi xác thực hoặc tạo thư mục');
      }
    };

    if (isAuthenticated) {
      handleGoogleDriveAuth();
    }
  }, [searchParams, isAuthenticated]);

  const handleAuthClick = () => {
    const clientId = '759567949674-r8uiv70eekku45fssl2dco4k4q419ui0.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent('https://gdrive.onextdigital.com/googleauthen');
    const scope = encodeURIComponent('https://www.googleapis.com/auth/drive.file');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

    window.location.href = authUrl;
    setIsAuthenticated(true); // After clicking, set isAuthenticated to true
  };

  return (
    <div className="mt-4 space-y-4">
      {!isAuthenticated && (
        <button
          onClick={handleAuthClick}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      )}

      {folderName && (
        <p className="text-green-600 font-semibold">
          ✅ Tạo thư mục thành công: <span className="font-mono">{folderName}</span>
        </p>
      )}

      {accessToken && (
        <div className="text-blue-700 break-all">
          <p className="font-semibold">🔐 Access Token:</p>
          <code className="bg-gray-100 p-2 rounded block">{accessToken}</code>
        </div>
      )}

      {error && (
        <p className="text-red-600 font-semibold">❌ {error}</p>
      )}
    </div>
  );
}
