'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'

const REDIRECT_URI = 'https://googledrivehubspot.vercel.app/'
const CLIENT_ID = 'e0d482e1-4b29-49cc-8656-4fa24dfe6db3' // Replace with your HubSpot client ID
const CLIENT_SECRET = '34e57500-9caa-4af3-b89b-25ca125df248' // Replace with your HubSpot client secret

export default function HubspotClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [contacts, setContacts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code || accessToken) return

    const fetchToken = async () => {
      try {
        const res = await axios.post(
          'https://api.hubapi.com/oauth/v1/token',
          new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )

        const token = res.data.access_token
        setAccessToken(token)
        localStorage.setItem('hubspot_token', token)

        console.log("Access Token:", token)

        // Create the CRM card after authentication
        const crmCardData = {
          type: "crm-card",
          data: {
            title: "Google Drive Integration by HubSpot", 
            description: "View and manage your Google Drive files directly from HubSpot.",
            uid: "google_drive_integration", // Unique identifier for the card
            icon: "https://www.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png", // URL to the icon image
            location: "crm.record.tab", // Specify the location in HubSpot (e.g., Contact tab)
            module: {
              file: "GoogleDriveCard.jsx", // Replace this with your actual React component file
            },
            objectTypes: [
              { name: "contacts" }, // This card will be available for Contacts
            ],
          }
        }

        // Post request to create the CRM card in HubSpot
        const cardResponse = await axios.post(
          'https://api.hubapi.com/crm/v3/objects/engagements/cards', 
          crmCardData, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )

        console.log("CRM Card created:", cardResponse.data)

      } catch (err: any) {
        setError(err?.response?.data?.message || 'Lỗi khi gọi HubSpot')
      }
    }

    fetchToken()
  }, [searchParams, accessToken])

  const handleConnect = () => {
    const authUrl = `https://app-eu1.hubspot.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=crm.objects.contacts.write%20crm.objects.contacts.read`
    window.location.href = authUrl
  }

  return (
    <main className={styles.main}>
      <h1>Kết nối HubSpot</h1>
      <button onClick={handleConnect} className={styles.button}>
        Cài đặt / Kết nối
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {accessToken && (
        <div>
          <h3>Access Token:</h3>
          <code style={{ wordBreak: 'break-all' }}>{accessToken}</code>
        </div>
      )}

    </main>
  )
}
