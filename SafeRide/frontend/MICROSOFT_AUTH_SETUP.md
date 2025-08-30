# Microsoft Authentication Setup Guide

## Step 1: Create Azure AD App Registration

1. **Go to Azure Portal**: https://portal.azure.com
2. **Search for "App registrations"** in the top search bar
3. **Click "New registration"**

## Step 2: Configure the App Registration

**Basic Information:**
- **Name**: `SafeRide WebApp`
- **Supported account types**: Select "Accounts in any organizational directory and personal Microsoft accounts (personal Microsoft accounts, e.g. Skype, Xbox)"
- **Redirect URI**: 
  - Type: `Web`
  - URL: `http://localhost:3003`

## Step 3: Get Your Client ID

1. After creating the app registration, you'll see the **Overview** page
2. **Copy the "Application (client) ID"** - this is your `VITE_MICROSOFT_CLIENT_ID`

## Step 4: Configure Authentication

1. Go to **Authentication** in the left sidebar
2. Under **Platform configurations**, click **Add a platform**
3. Select **Single-page application (SPA)**
4. Add these redirect URIs:
   - `http://localhost:3003` (for development)
   - `http://localhost:3000` (backup)
   - `http://localhost:3001` (backup)
   - `http://localhost:3002` (backup)

## Step 5: Configure API Permissions

1. Go to **API permissions** in the left sidebar
2. Ensure these permissions are granted:
   - `User.Read` (Microsoft Graph)
   - `openid`
   - `profile`
   - `email`

## Step 6: Update Environment Variables

1. Open `/Users/nitin/Projects/SafeRide/webapp/SafeRide/frontend/.env.development`
2. Replace `your-real-azure-client-id-here` with your actual Application (client) ID
3. Change `VITE_USE_MOCK_AUTH=false`

## Step 7: Restart Development Server

```bash
cd /Users/nitin/Projects/SafeRide/webapp/SafeRide/frontend
npm run dev
```

## Example .env.development file:

```
VITE_MICROSOFT_CLIENT_ID=12345678-1234-1234-1234-123456789012
VITE_MICROSOFT_TENANT_ID=consumers
VITE_USE_MOCK_AUTH=false
VITE_API_BASE_URL=http://localhost:5001/api
```

## Test Real Authentication

1. Go to `http://localhost:3003`
2. Click "Sign in with Microsoft"
3. You should see the real Microsoft login popup
4. Sign in with your personal Microsoft account
5. You should be redirected to the dashboard with your real user info

## Troubleshooting

- **Popup blocked**: Make sure popup blockers are disabled for localhost
- **Redirect URI mismatch**: Ensure the redirect URI in Azure AD matches your development URL
- **Permission errors**: Make sure the API permissions are properly configured
