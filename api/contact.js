export default async function handler(req, res) {
    // 1. Ensure it's a POST request
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    try {
        // 2. Get name and phone from the request body (Vercel automatically parses JSON)
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: 'Name and phone are required.' });
        }

        // 3. Prepare to call your third-party API
        const THIRD_PARTY_API_URL = process.env.THIRD_PARTY_API_URL || 'YOUR_THIRD_PARTY_API_ENDPOINT_HERE';
        const THIRD_PARTY_API_KEY = process.env.THIRD_PARTY_API_KEY;

        const apiPayload = {
            userName: name,
            contactNumber: phone,
        };

        const apiHeaders = {
            'Content-Type': 'application/json',
        };

        if (THIRD_PARTY_API_KEY) {
            apiHeaders['Authorization'] = `Bearer ${THIRD_PARTY_API_KEY}`;
        }

        console.log(`Calling third-party API at ${THIRD_PARTY_API_URL} with payload:`, apiPayload);

        // 4. Call the third-party API
        const thirdPartyResponse = await fetch(THIRD_PARTY_API_URL, {
            method: 'POST',
            headers: apiHeaders,
            body: JSON.stringify(apiPayload),
        });

        // 5. Get the response body from the third-party API
        let thirdPartyResponseBody;
        const contentType = thirdPartyResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            thirdPartyResponseBody = await thirdPartyResponse.json();
        } else {
            thirdPartyResponseBody = await thirdPartyResponse.text();
        }

        console.log(`Third-party API responded with status: ${thirdPartyResponse.status}`);

        // 6. Send the third-party API's status and body back to your frontend
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }

        res.status(thirdPartyResponse.status).json(thirdPartyResponseBody);

    } catch (error) {
        console.error('Error in backend function:', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
}
