# Microsoft Azure AD Setup Guide for SafeRide

This guide will help you set up Microsoft Azure Active Directory (Azure AD) authentication for the SafeRide application.

## Prerequisites

- Azure subscription with administrative access
- Azure AD tenant (most organizations already have this)
- The SafeRide application URLs (development and production)

## Azure AD Application Registration

### Step 1: Create a New App Registration

1. **Navigate to Azure Portal**
   - Go to [Azure Portal](https://portal.azure.com)
   - Sign in with your organizational account

2. **Access Azure Active Directory**
   - In the left sidebar, click on "Azure Active Directory"
   - Or search for "Azure Active Directory" in the top search bar

3. **Create App Registration**
   - Click on "App registrations" in the left menu
   - Click "New registration" button
   - Fill in the registration form:
     - **Name**: `SafeRide Web Application`
     - **Supported account types**: Select "Accounts in this organizational directory only"
     - **Redirect URI**: 
       - Platform: Web
       - URI: `http://localhost:5173` (for development)
   - Click "Register"

### Step 2: Configure Redirect URIs

1. **Add Production Redirect URI**
   - In your app registration, go to "Authentication"
   - Under "Web" platform, click "Add URI"
   - Add your production URL: `https://your-github-pages-url.github.io`
   - Add any other deployment URLs you plan to use

2. **Configure Logout URLs (Optional)**
   - In the same "Authentication" section
   - Add logout URLs if needed
   - For development: `http://localhost:5173`
   - For production: `https://your-github-pages-url.github.io`

### Step 3: Configure API Permissions

1. **Add Microsoft Graph Permissions**
   - Go to "API permissions"
   - Click "Add a permission"
   - Select "Microsoft Graph"
   - Choose "Delegated permissions"
   - Add the following permissions:
     - `User.Read` (to read user profile)
     - `email` (to access user email)
     - `openid` (for OpenID Connect)
     - `profile` (to access user profile information)

2. **Grant Admin Consent**
   - Click "Grant admin consent for [Your Organization]"
   - Confirm the consent

### Step 4: Get Application Credentials

1. **Copy Application (Client) ID**
   - Go to "Overview" tab
   - Copy the "Application (client) ID"
   - This will be your `VITE_MICROSOFT_CLIENT_ID`

2. **Copy Directory (Tenant) ID**
   - Also in "Overview" tab
   - Copy the "Directory (tenant) ID"
   - This will be your `VITE_MICROSOFT_TENANT_ID`

## Environment Configuration

### Development Environment

Create or update your `.env.local` file in the frontend directory:

```env
VITE_ENVIRONMENT=development
VITE_API_URL=http://localhost:5000
VITE_USE_MOCK_AUTH=false
VITE_MICROSOFT_CLIENT_ID=your-application-client-id-here
VITE_MICROSOFT_TENANT_ID=your-directory-tenant-id-here
```

### Production Environment

For GitHub Pages deployment, configure these environment variables in your GitHub repository:

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click "Secrets and variables" → "Actions"
4. Add the following repository secrets:
   - `VITE_MICROSOFT_CLIENT_ID`: Your Application (client) ID
   - `VITE_MICROSOFT_TENANT_ID`: Your Directory (tenant) ID

### Mock Authentication for Development

If you want to use mock authentication during development (useful for testing without Azure AD):

```env
VITE_ENVIRONMENT=development
VITE_API_URL=http://localhost:5000
VITE_USE_MOCK_AUTH=true
```

## Testing the Integration

### 1. Start Development Server

```bash
cd frontend
npm run dev
```

### 2. Test Authentication Flow

1. Navigate to `http://localhost:5173/login`
2. Click "Continue with Microsoft"
3. You should be redirected to Microsoft login
4. After successful login, you should be redirected back to the dashboard

### 3. Verify User Information

- Check browser developer tools console for user information
- Verify that the user profile is displayed correctly
- Ensure navigation works after authentication

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Make sure redirect URIs are correctly configured in Azure AD
   - Verify that your domain is listed in the redirect URIs

2. **Permission Denied**
   - Ensure admin consent has been granted for the required permissions
   - Check that the user's organization allows external applications

3. **Invalid Client ID**
   - Double-check that `VITE_MICROSOFT_CLIENT_ID` matches the Application ID from Azure AD
   - Ensure environment variables are properly loaded

4. **Redirect URI Mismatch**
   - Verify that the redirect URI in Azure AD exactly matches your application URL
   - Remember that `http://localhost:5173` is different from `http://localhost:5173/`

### Debug Mode

To enable detailed logging for MSAL authentication:

1. Open browser developer tools
2. Look for MSAL-related console messages
3. Check the Network tab for authentication requests
4. Review any error messages in the console

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive credentials to version control
   - Use GitHub secrets for production environment variables
   - Regularly rotate client secrets if using client secrets (not needed for this setup)

2. **Redirect URIs**
   - Only add trusted domains to redirect URIs
   - Use HTTPS for production redirect URIs
   - Regularly review and clean up unused redirect URIs

3. **Permissions**
   - Only request the minimum permissions needed
   - Regularly review granted permissions
   - Monitor application usage in Azure AD logs

## Additional Resources

- [Microsoft Authentication Library (MSAL) Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview)
- [Azure AD App Registration Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Azure AD sign-in logs in the Azure Portal
3. Check browser developer tools for error messages
4. Verify environment configuration matches this guide
