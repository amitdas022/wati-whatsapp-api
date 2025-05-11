# WATI WhatsApp API Contact Form

This project implements a simple "Contact Us" webpage that collects a user's name and phone number. Upon submission, it triggers a backend API hosted on Vercel, which then attempts to send a pre-defined WhatsApp template message using the WATI API.

**Live Demo:** [https://wati-whatsapp-api.vercel.app/](https://wati-whatsapp-api.vercel.app/)

## Project Objective

The initial goal was to allow users to define and save a custom WhatsApp message template through this interface and then use that template for sending messages. However, creating and managing WhatsApp message templates programmatically via API typically requires a verified WhatsApp Business Account and adherence to WhatsApp's commerce and business policies, which can be a significant setup process.

Due to these constraints, this project has been adapted to use an **existing, pre-approved template named `free_trial_broadcast`** for demonstration purposes when interacting with the WATI API.

## Features

*   **Simple Contact Form:** A clean, modern frontend with fields for Name and Phone Number.
*   **Country Code Selection:** Users can select their country code from a dropdown (India, USA, Netherlands included).
*   **Backend API:** A Node.js serverless function hosted on Vercel (`/api/contact`) that:
    *   Receives the name and phone number (with country code prepended).
    *   Constructs a request to the WATI API to send the `free_trial_broadcast` template.
*   **API Test Mode:** The backend includes a flag (`api_test_mode`) which, when `true`, logs the intended WATI API request to the console without actually sending it. This is useful for debugging.
*   **Responsive Design:** Basic styling for a pleasant user experience on different devices.

## Technologies Used

*   **Frontend:** HTML, CSS, JavaScript (Vanilla)
*   **Backend:** Node.js (Vercel Serverless Function)
*   **Hosting/Deployment:** Vercel
*   **Version Control:** Git & GitHub

## Setup and Running Locally

To run this project on your local machine:

1.  **Prerequisites:**
    *   Node.js and npm (or yarn) installed.
    *   Vercel CLI (can be run via `npx` or installed globally: `npm install -g vercel`).

2.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd wati-whatsapp-api
    ```

3.  **Install Dependencies:**
    The `package.json` includes `vercel` as a dependency, which is primarily for the `vercel dev` command.
    ```bash
    npm install
    ```

4.  **Set Up Local Environment Variables:**
    The backend API (`api/contact.js`) requires an API token for the WATI service.
    *   Create a file named `.env` in the root of the project.
    *   Add your WATI API token to this file. Refer to `.env.example` if provided, or use the following format:
        ```env
        # .env
        THIRD_PARTY_API_KEY=your_actual_wati_api_token_here
        ```
    *   **Important:** The `.env` file should be listed in your `.gitignore` to prevent committing secrets.

5.  **Run the Development Server:**
    Use the Vercel CLI to start a local development server. This will serve your `index.html` and run the `api/contact.js` function locally.
    ```bash
    npx vercel dev
    ```
    The application will typically be available at `http://localhost:3000`.

## Backend API (`api/contact.js`) Details

*   **Endpoint:** `/api/contact` (relative to the deployment URL)
*   **Method:** `POST`
*   **Request Body (from frontend):**
    ```json
    {
      "name": "John Doe",
      "phone": "911234567890" // Country code + phone number
    }
    ```
*   **WATI API Interaction:**
    *   The backend constructs a request to the WATI endpoint:
        `https://app-server.wati.io/api/v1/sendTemplateMessage?whatsappNumber=<phone_from_form>`
    *   It uses the `free_trial_broadcast` template.
    *   The `Authorization` header uses the token provided via the `THIRD_PARTY_API_KEY` environment variable.
*   **Test Mode (`api_test_mode`):**
    *   Located at the top of `api/contact.js`.
    *   If `true`, the WATI API call is skipped, and request details are logged to the console. The frontend receives a mock success response.
    *   If `false`, the actual WATI API call is made.

## Deployment on Vercel

This project is configured for easy deployment on Vercel:

1.  **GitHub Integration:** The GitHub repository is connected to a Vercel project.
2.  **Continuous Deployment:** Pushes to the main branch (or specified production branch) automatically trigger a new deployment on Vercel.
3.  **Serverless Functions:** Vercel automatically detects and deploys the Node.js function in the `api` directory.
4.  **Static Site Hosting:** `index.html`, `style.css`, and `script.js` are served as static assets.
5.  **Environment Variables on Vercel:**
    *   The `THIRD_PARTY_API_KEY` (containing the WATI API Token) must be configured in the Vercel project settings (Settings > Environment Variables) for the deployed backend function to authenticate with the WATI API.
    *   The `THIRD_PARTY_API_URL` is currently hardcoded in `api/contact.js` to point to the WATI server, but the token is essential.

## How to Use

1.  Open the live URL: https://wati-whatsapp-api.vercel.app/ or your local development URL.
2.  Enter your name.
3.  Select your country code and enter your phone number.
4.  Click "Submit".
5.  The form will attempt to send the data to the backend, which in turn (if not in test mode and configured correctly) will try to send a WhatsApp message via WATI.
6.  A success or error message will be displayed below the form.

---

Feel free to suggest any modifications or further details you'd like to add!
