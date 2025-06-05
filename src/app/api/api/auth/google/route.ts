// src/app/api/auth/google/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  const client_id = process.env.GOOGLE_CLIENT_ID!;
  const client_secret = process.env.GOOGLE_CLIENT_SECRET!;
  const redirect_uri = 'https://googledrivehubspot.vercel.app/googleauthen';

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
