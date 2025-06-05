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

        // Now, use the server-side API route to fetch contacts
        const contactsRes = await axios.get('/api/getContacts', {
          params: {
            accessToken: token,
          },
        })

        setContacts(contactsRes.data.results || [])
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

      {contacts.length > 0 && (
        <div>
          <h3>Danh sách contacts:</h3>
          <ul>
            {contacts.map((c) => (
              <li key={c.id}>
                {c.properties?.firstname || 'Chưa đặt tên'} {c.properties?.lastname || ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
