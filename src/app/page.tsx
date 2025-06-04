import { Suspense } from 'react'
import HubspotClient from './hubspot-client'

export default function Home() {
  return (
    <Suspense fallback={<div>Đang tải HubSpot...</div>}>
      <HubspotClient />
    </Suspense>
  )
}
