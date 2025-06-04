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
            client_id: '3c24e4a5-2677-4e9a-9022-f72c0218f80a',
            client_secret: process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_SECRET!,
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

        const contactsRes = await axios.get(
          'https://api.hubapi.com/crm/v3/objects/contacts',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setContacts(contactsRes.data.results || [])
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Lỗi khi gọi HubSpot')
      }
    }

    fetchToken()
  }, [searchParams, accessToken])

  const handleConnect = () => {
    const authUrl = `https://app-eu1.hubspot.com/oauth/authorize?client_id=3c24e4a5-2677-4e9a-9022-f72c0218f80a&redirect_uri=${REDIRECT_URI}&scope=crm.objects.contacts.write%20crm.schemas.contacts.write%20oauth%20crm.schemas.contacts.read%20crm.objects.contacts.read`
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
