// pages/drive.tsx

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { google } from "googleapis";

// Component Frontend: Hiển thị danh sách files trên Google Drive
const DrivePage = () => {
  const { data: session, status } = useSession();
  const [files, setFiles] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (session) {
      // Lấy danh sách file từ API
      fetch("/api/drive")
        .then((response) => response.json())
        .then((data) => setFiles(data))
        .catch((error) => console.error("Error fetching drive files", error));
    }
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Google Drive Files</h1>
      <ul>
        {files.map((file) => (
          <li key={file.id}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DrivePage;

// API: Kết nối với Google Drive API để lấy danh sách file
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Set up OAuth2 client with credentials and tokens
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    "http://localhost:3000/api/auth/callback/google" // Redirect URI
  );

  oauth2Client.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  try {
    const response = await drive.files.list({
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
    });
    res.status(200).json(response.data.files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
