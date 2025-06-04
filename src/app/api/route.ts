import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    type: "IFRAME",
    width: 890,
    height: 748,
    uri: "https://example.com/iframe-contents",
    label: "Edit",
    associatedObjectProperties: ["some_crm_property"]
  })
}