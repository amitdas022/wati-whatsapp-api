// Define this flag at the top. Set to true for testing, false for actual API calls.
const api_test_mode = false;

export default async function handler(req, res) {
    // 1. Ensure it's a POST request
    // Handle OPTIONS for CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Allow', ['POST', 'OPTIONS']);
        res.setHeader('Access-Control-Allow-Origin', '*'); // Be more specific in production
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Add other headers as needed
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST', 'OPTIONS']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    try {
        // 2. Get name and phone from the request body (Vercel automatically parses JSON)
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: 'Name and phone are required.' });
        }

        // 3. Prepare to call your third-party API
        const watiApiBaseUrl = process.env.THIRD_PARTY_API_URL;
        const watiApiToken = process.env.THIRD_PARTY_API_KEY;

        if (!watiApiBaseUrl || !watiApiToken) {
            console.error('THIRD_PARTY_API_URL or THIRD_PARTY_API_KEY environment variable is not set.');
            return res.status(500).json({ message: 'Server configuration error: Missing API URL.' });
        }

        // Construct the WATI API URL
        const watiApiUrl = `${watiApiBaseUrl}?whatsappNumber=${phone}`;

        // Construct the WATI API payload
        const watiApiPayload = {
            template_name: "free_trial_broadcast", // You might want to make this configurable
            broadcast_name: "Welcome - DEMO",      // Or this
            parameters: [
                { name: "name", value: name },
                { name: "phone", value: phone }
            ]
        };

        // Construct the WATI API headers
        const watiApiHeaders = {
            'Content-Type': 'application/json-patch+json',
            'Authorization': `${watiApiToken}`
        };

        console.log(`Preparing to call WATI API at ${watiApiUrl}`);

        if (api_test_mode) {
            // In test mode, log the request details and return a mock success
            console.log(`
            --- API TEST MODE: Request Details ---
            Would attempt to call: fetch('${watiApiUrl}', {
                method: 'POST',
                headers: ${JSON.stringify(watiApiHeaders, null, 2)},
                body: JSON.stringify(${JSON.stringify(watiApiPayload, null, 2)})
            });
            ------------------------------------
            `);

            return res.status(200).json({
                message: 'API Test Mode: Request logged to console, not sent to third-party API.',
                simulatedRequest: {
                    url: watiApiUrl,
                    method: 'POST',
                    headers: watiApiHeaders,
                    body: watiApiPayload
                }
            });
        } else {
            // 4. Call the third-party API (actual call)
            console.log('Making actual API call to WATI...');
            const thirdPartyResponse = await fetch(watiApiUrl, {
                method: 'POST',
                headers: watiApiHeaders,
                body: JSON.stringify(watiApiPayload),
            });
            
            // 5. Get the response body from the third-party API
            let thirdPartyResponseBody;
            const contentType = thirdPartyResponse.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                thirdPartyResponseBody = await thirdPartyResponse.json();
            } else {
                thirdPartyResponseBody = await thirdPartyResponse.text();
            }

            console.log(`Third-party API responded with status: ${thirdPartyResponse.status}, body:`, thirdPartyResponseBody);

            // 6. Send the third-party API's status and body back to your frontend
            res.status(thirdPartyResponse.status).json(thirdPartyResponseBody);
        }

    } catch (error) {
        console.error('Error in backend function:', error.message, error.stack);
        // Avoid exposing detailed internal errors to the client in production
        res.status(500).json({ message: 'An internal server error occurred. Please try again later.' });
    }
}
