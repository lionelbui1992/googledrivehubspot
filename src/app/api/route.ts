import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    title: "New CRM Card",
    fetch: {
      targetUrl: "https://googledrivehubspot.vercel.app/api",
      objectTypes: [
        {
          name: "contacts",
          propertiesToSend: ["firstname", "email", "lastname"]
        }
      ]
    }
  })
}
