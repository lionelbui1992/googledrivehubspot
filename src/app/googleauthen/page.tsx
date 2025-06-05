'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function GoogleDriveAuthPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleGoogleDriveAuth = async () => {
      const code = searchParams.get('code');

      if (!code) {
        // Bắt đầu OAuth
        const clientId = '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ssl2dco4k4q419ui0.apps.googleusercontent.com';
        const redirectUri = encodeURIComponent('https://googledrivehubspot.vercel.app/googleauthen');
        const scope = encodeURIComponent('https://www.googleapis.com/auth/drive.file');
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

        window.location.href = authUrl;
        return;
      }

      try {
        // Đổi code lấy access_token (bạn cần endpoint backend cho phần này)
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const { access_token } = await res.json();

        // Gọi Google Drive API để tạo thư mục
        const parentFolderId = '1Qa1M9xWTPDbT22f1dNIGk0YsVe2MzXDe'; // <-- Thay bằng ID thật

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
        console.log('Folder được tạo:', folderData);
        alert(`Tạo thư mục thành công: ${folderData.name}`);

      } catch (err) {
        console.error('Lỗi xác thực hoặc tạo thư mục:', err);
      }
    };

    handleGoogleDriveAuth();
  }, [searchParams]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Đang xác thực với Google và tạo thư mục...</h1>
    </div>
  );
}
