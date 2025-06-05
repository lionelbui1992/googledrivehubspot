'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'

const REDIRECT_URI = 'https://googledrivehubspot.vercel.app/'

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
            client_id: 'e0d482e1-4b29-49cc-8656-4fa24dfe6db3',
            client_secret: '34e57500-9caa-4af3-b89b-25ca125df248',
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
        console.log('Access Token:', token);

        try {
            const response = await axios.post('/api/crmcart', {
              accessToken: token, // The access token obtained after OAuth
            });

            console.log('CRM Card created successfully:', response.data);
          } catch (error) {
            console.error('Error creating CRM card:', error);
          }

      } catch (err: any) {
        setError(err?.response?.data?.message || 'Lỗi khi gọi HubSpot')
      }
    }

    fetchToken()
  }, [searchParams, accessToken])

  const handleConnect = () => {
    const authUrl = `https://app-eu1.hubspot.com/oauth/authorize?client_id=e0d482e1-4b29-49cc-8656-4fa24dfe6db3&redirect_uri=https://googledrivehubspot.vercel.app/&scope=crm.objects.contacts.write%20crm.objects.contacts.read`
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
