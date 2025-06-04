import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    title: "New CRM Card",
    fetch: {
      targetUrl: "https://www.example.com/demo-fetch",
      objectTypes: [
        {
          name: "contacts",
          propertiesToSend: ["firstname", "email", "lastname"]
        }
      ]
    }
  })
}
