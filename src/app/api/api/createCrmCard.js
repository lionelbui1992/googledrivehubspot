// pages/api/createCrmCard.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { accessToken } = req.body; // Get the access token passed from frontend

      // CRM Card Data (the data that will be posted to create the card)
      const crmCardData = {
        type: "crm-card",
        data: {
          title: "Google Drive Integration",
          description: "View and manage your Google Drive files directly from HubSpot.",
          uid: "google-drive-integration-card",
          location: "crm.record.tab", // The card will appear in the contact record tab
          module: {
            file: "GoogleDriveCard.jsx", // This is where your React component will be referenced
          },
          objectTypes: [
            { name: "contacts" } // The card will be available for Contacts
          ]
        }
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
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error creating CRM card:", error);
      res.status(500).json({ error: 'Failed to create CRM card' });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
