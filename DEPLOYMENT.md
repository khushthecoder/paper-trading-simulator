# 🚀 Vercel Deployment Guide

Your project is now fully configured for a production-ready Vercel deployment.

## 📋 Pre-Deployment Configuration

The following files have been modified to support Vercel:
1.  **`vercel.json`**: Created to tell Vercel how to build both your Frontend (`client`) and Backend (`server`) together.
2.  **`server/index.js`**: Updated to export the app for Vercel's serverless environment while still working locally.
3.  **`client/src/services/api.js`**: Updated to use relative `/api` paths.
4.  **`client/vite.config.js`**: Added a proxy so local development still works seamlessly.

## 🛠️ Deployment Steps

### 1. Push to GitHub
Ensure you have committed and pushed all the latest changes (including the new `vercel.json`).

### 2. Import to Vercel
1.  Go to the [Vercel Dashboard](https://vercel.com/new).
2.  Import your GitHub repository.
3.  **Root Directory**: Keep it as `./` (Root). Do **NOT** select `client` or `server`.
4.  **Framework Preset**: Vercel might not detect one because of the custom structure. That is fine. The `vercel.json` handles it.

### 3. Environment Variables (Critical)
You MUST add the following Environment Variables in Vercel under **Settings > Environment Variables**.

| Variable | Value | Description |
| :--- | :--- | :--- |
| `MONGO_URI` | `mongodb+srv://...` | Same as your local .env |
| `JWT_SECRET` | `secret123` | Secure secret string |
| `SESSION_SECRET`| `paper_trading...` | Secure secret string |
| `FINNHUB_API_KEY` | `d4u7...` | Your API Key |
| `GOOGLE_CLIENT_ID` | `3267...` | From Google Console |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX...` | From Google Console |
| `GOOGLE_CALLBACK_URL` | `https://[YOUR-PROJECT].vercel.app/api/auth/google/callback` | **See Note Below** |
| `CLIENT_URL` | `https://[YOUR-PROJECT].vercel.app` | The domain Vercel gives you |

> **⚠️ Google Auth Callback Note**:
> Once deployed, Vercel will give you a domain (e.g., `paper-trading.vercel.app`).
> You MUST update this `GOOGLE_CALLBACK_URL` variable to use that domain instead of `localhost`.
> You MUST also add this new URL to your **Google Cloud Console** authorized redirect URIs.

### 4. Deploy
Click **Deploy**. Vercel will read the `vercel.json`, build the React frontend, build the Node backend, and route them correctly.

## ✅ Verification
- **Frontend**: Should load at your main domain.
- **Backend API**: Accessible at `/api/trade/portfolio` etc.
- **Auth**: Google Login should redirect to Google and back to your Vercel app (once you update the Console).

## 💻 Local Development
Additional benefit: You can now run `npm run dev` in both folders and `localhost:5173` will work perfectly, with the frontend correctly talking to `localhost:5001`.
