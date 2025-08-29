# GitHub Pages Setup Instructions

## 🚀 Automated Setup (Recommended)

The GitHub Actions workflow will automatically deploy your frontend to GitHub Pages when you push to the main branch. However, you need to enable GitHub Pages in your repository settings first.

## 📋 Manual Setup Steps

### 1. Enable GitHub Pages in Repository Settings

1. Go to your GitHub repository: `https://github.com/kakkarnitin/safeRide-WebApp`
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. The page will show: "GitHub Pages is now configured to deploy from GitHub Actions"

### 2. Verify GitHub Actions Permissions

1. In the same repository, go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, ensure **Read and write permissions** is selected
3. Check **Allow GitHub Actions to create and approve pull requests**
4. Click **Save**

### 3. Trigger the Deployment

The deployment will automatically trigger when you push to the main branch. You can also manually trigger it:

1. Go to **Actions** tab in your repository
2. Click on **Deploy to Azure and GitHub Pages** workflow
3. Click **Run workflow** → **Run workflow**

### 4. Check Deployment Status

1. Go to **Actions** tab to monitor the deployment progress
2. Once completed, your frontend will be available at:
   ```
   https://kakkarnitin.github.io/safeRide-WebApp/
   ```

## 🔧 Configuration Details

### Base Path Configuration
- **Development**: `/` (root)
- **Production**: `/safeRide-WebApp/` (GitHub Pages subfolder)

### Router Configuration
- Uses `basename` prop to handle GitHub Pages subdirectory
- Includes SPA redirect scripts for proper client-side routing

### Build Configuration
- Vite configured with proper base path
- 404.html created for SPA support
- GitHub Actions copies index.html as 404.html

## 🌐 Expected URLs

After deployment, your application will be accessible at:

- **Frontend**: `https://kakkarnitin.github.io/safeRide-WebApp/`
- **Backend**: `https://your-app-name.azurewebsites.net/api` (after Azure deployment)

## ⚡ Quick Commands

```bash
# Check if GitHub Pages is properly configured
curl -I https://kakkarnitin.github.io/safeRide-WebApp/

# View deployment logs
# Go to GitHub → Actions → Latest workflow run

# Manual local testing with production build
cd SafeRide/frontend
npm run build
npm run preview
```

## 🐛 Troubleshooting

### Common Issues:

1. **404 Errors on Refresh**:
   - Ensure 404.html is properly copied during build
   - Check that redirect script is included in index.html

2. **Assets Not Loading**:
   - Verify `base` path in vite.config.ts
   - Check that router `basename` matches repository name

3. **Workflow Fails**:
   - Check Actions permissions in repository settings
   - Verify GITHUB_TOKEN has proper permissions

4. **Routes Not Working**:
   - Ensure SPA redirect scripts are included
   - Check router configuration with basename

### Verify Deployment:

```bash
# Test main page
curl https://kakkarnitin.github.io/safeRide-WebApp/

# Test a route (should redirect properly)
curl https://kakkarnitin.github.io/safeRide-WebApp/login

# Test API connectivity (after backend deployment)
curl https://your-azure-app.azurewebsites.net/api/schools
```

## 🎉 Success Criteria

Your GitHub Pages deployment is successful when:

1. ✅ Main page loads at `https://kakkarnitin.github.io/safeRide-WebApp/`
2. ✅ Navigation between routes works correctly
3. ✅ Direct URL access works (e.g., `/login`, `/dashboard`)
4. ✅ Browser refresh on any route works properly
5. ✅ No console errors related to routing or asset loading

## 📞 Next Steps

After GitHub Pages is working:

1. **Deploy Backend**: Follow DEPLOYMENT.md to deploy API to Azure
2. **Update API URL**: Configure frontend to use Azure backend
3. **Test Integration**: Verify frontend can communicate with backend
4. **Custom Domain**: Optional - configure custom domain for GitHub Pages
