import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Define the POST handler for the /crmcard route
export async function POST(req: NextRequest) {
  try {
    // Get the access token from the request body
    const { accessToken } = await req.json();

    // CRM Card Data to be sent to HubSpot
    const crmCardData = {
      type: 'crm-card',
      data: {
        title: 'Google Drive Integration',
        description: 'View and manage your Google Drive files directly from HubSpot.',
        uid: 'google-drive-integration-card',
        location: 'crm.record.tab', // The card will appear in the contact record tab
        module: {
          file: 'GoogleDriveCard.jsx', // This is your actual React component file
        },
        objectTypes: [
          { name: 'contacts' }, // The card will be available for Contacts
        ],
      },
    };

    // Make the request to HubSpot API to create the CRM card
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

    // Return the HubSpot API response (success or failure)
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error creating CRM card:', error);
    return NextResponse.json(
      { error: 'Failed to create CRM card' },
      { status: 500 }
    );
  }
}
