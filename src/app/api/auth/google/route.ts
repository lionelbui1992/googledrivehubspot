// src/app/api/auth/google/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  //const client_id = process.env.GOOGLE_CLIENT_ID!;
    const client_id = '759567949674-r8uiv70eekku45fssl2dco4k4q419ui0.apps.googleusercontent.com';
  //const client_secret = process.env.GOOGLE_CLIENT_SECRET!;
    const client_secret = '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';
  const redirect_uri = 'https://gdrive.onextdigital.com/googleauthen';

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id,
      client_secret,
      redirect_uri,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenRes.json();

  return NextResponse.json({
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    id_token: tokenData.id_token, 
  });
}
