import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// The new handler for POST requests to create the CRM card
export async function POST(req: NextRequest) {
  try {
    const { accessToken } = await req.json(); // Get the access token from the request body

    // CRM Card Data
    const crmCardData = {
      type: 'crm-card',
      data: {
        title: 'Google Drive Integration',
        description: 'View and manage your Google Drive files directly from HubSpot.',
        uid: 'google-drive-integration-card',
        location: 'crm.record.tab', // The card will appear in the contact record tab
        module: {
          file: 'GoogleDriveCard.jsx', // Replace this with your actual React component file
        },
        objectTypes: [
          { name: 'contacts' }, // The card will be available for Contacts
        ],
      },
    };

    // Making the request to HubSpot API to create the CRM card
    const response = await axios.post(
      'https://api.hubapi.com/crm/v3/objects/engagements/cards',
      crmCardData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Send back the HubSpot API response (success or failure)
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error creating CRM card:', error);
    return NextResponse.json(
      { error: 'Failed to create CRM card' },
      { status: 500 }
    );
  }
}
