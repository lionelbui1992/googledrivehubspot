'use client';

import { Suspense } from 'react';
import GoogleDriveAuthHandler from './GoogleDriveAuthHandler';

export default function GoogleDriveAuthPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Đang xác thực với Google và tạo thư mục...</h1>
      <Suspense fallback={<p>Đang xử lý...</p>}>
        <GoogleDriveAuthHandler />
      </Suspense>
    </div>
  );
}
