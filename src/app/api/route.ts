import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    type: "IFRAME",
    width: 890,
    height: 748,
    uri: "https://example.com/iframe-contents",
    label: "Google Drive",
    associatedObjectProperties: ["some_crm_property"],

    actions: [
      {
        type: "ACTION_LINK",
        text: "Xác thực Google Drive",
        url: "https://your-domain.com/api/auth/google?userId={{objectId}}",
        openInNewTab: true
      }
    ]
  })
}
