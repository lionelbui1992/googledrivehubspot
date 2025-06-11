'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function GoogleDriveAuthHandler() {
  const searchParams = useSearchParams();
  const [folderName, setFolderName] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) return;

    const handleGoogleDriveAuth = async () => {
      console.log('Authorization code:', code);

      try {
        // Gửi code đến API backend để lấy access token
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!res.ok) {
          throw new Error('Failed to exchange code for token');
        }

        const { access_token } = await res.json();
        setAccessToken(access_token);
        console.log('Access Token:', access_token);

        // Tạo thư mục mới trong Google Drive
        const parentFolderId = '1Qa1M9xWTPDbT22f1dNIGk0YsVe2MzXDe'; // Thay đổi ID nếu cần

        const folderRes = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Folder-Moi',
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolderId],
          }),
        });

        const folderData = await folderRes.json();

        if (!folderRes.ok) {
          console.error('Google Drive API error:', folderData);
          throw new Error(folderData.error?.message || 'Failed to create folder');
        }

        setFolderName(folderData.name);

        // Xoá query code để tránh lặp lại
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err: any) {
        console.error('Lỗi xác thực hoặc tạo thư mục:', err);
        setError(err.message || 'Lỗi xác thực hoặc tạo thư mục');
      }
    };

    handleGoogleDriveAuth();
  }, [searchParams]);

  const handleAuthClick = () => {
    const clientId = '759567949674-r8uiv70eekku45fssl2dco4k4q419ui0.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent('https://gdrive.onextdigital.com/googleauthen');
    const scope = encodeURIComponent('https://www.googleapis.com/auth/drive.file');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

    window.location.href = authUrl;
  };

  return (
    <div className="mt-4 space-y-4">
      {!accessToken && (
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
