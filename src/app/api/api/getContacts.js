import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { accessToken } = req.query;

      // Make the request to HubSpot API from the server (no CORS issue)
      const response = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Send back the response data from HubSpot API
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching contacts from HubSpot:', error);
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  } else {
    // Handle unsupported HTTP methods (e.g., POST)
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
