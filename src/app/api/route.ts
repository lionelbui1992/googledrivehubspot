// /pages/api/hubspot-card.js
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    type: "IFRAME",
    width: 890,
    height: 200,
    uri: "https://googledrivehubspot.vercel.app/iframe-content", // <- trang bạn tự tạo
    label: "Google Drive",
    associatedObjectProperties: ["hs_object_id"]
  })
}
