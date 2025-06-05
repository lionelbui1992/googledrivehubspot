// app/crmcard/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// This function handles POST requests to create a CRM card
export async function POST(req: NextRequest) {
  try {
    // Get the access token from the request body
    const { accessToken } = await req.json();

    if (!accessToken) {
      // If access token is missing, return a bad request response
      return NextResponse.json(
        { error: 'Access token is required.' },
        { status: 400 } // Bad Request
      );
    }

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

    console.log('Sending request to HubSpot API:', crmCardData);

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

    console.log('HubSpot API response:', response.data);

    // Return the HubSpot API response (success or failure)
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    // Log and handle any errors
    console.error('Error creating CRM card:', error);
    if (error.response) {
      console.error('HubSpot API error response:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }

    return NextResponse.json(
      { error: 'Failed to create CRM card' },
      { status: 500 }
    );
  }
}
