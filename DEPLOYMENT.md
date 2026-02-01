# 🚀 Detailed Deployment Guide

This guide walks you through deploying ChronoBox to Netlify with complete Google OAuth setup.

## Prerequisites Checklist

- [ ] GitHub account created
- [ ] Netlify account created (free tier is fine)
- [ ] Google Cloud Console access
- [ ] Project built locally without errors (`npm run build`)

## Step 1: Configure Google OAuth for Production

### 1.1 Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Credentials**

### 1.2 Update OAuth Client ID

1. Find your OAuth 2.0 Client ID in the credentials list
2. Click on it to edit
3. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:5173
   https://your-app-name.netlify.app
   https://*.netlify.app
   ```
   ⚠️ **Note**: You'll update `your-app-name` with your actual Netlify URL after deployment

4. Click **Save**

### 1.3 Verify Google Calendar API is Enabled

1. Go to **APIs & Services** → **Library**
2. Search for "Google Calendar API"
3. Ensure it shows "API enabled"

## Step 2: Prepare Your Code for Deployment

### 2.1 Test Production Build Locally

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

- Visit `http://localhost:4173`
- Test the sign-in flow
- Create a test capsule
- Verify no console errors

### 2.2 Review Files

Ensure these files exist in your project:
- `netlify.toml` - Netlify configuration
- `.gitignore` - Git ignore rules
- `README.md` - Project documentation
- `.env.example` - Environment variable template

## Step 3: Push to GitHub

### 3.1 Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - ChronoBox Time Capsule App"

# Set main branch
git branch -M main
```

### 3.2 Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon → **New repository**
3. Name it (e.g., `chronobox-time-capsule`)
4. Choose **Public** or **Private**
5. **Do NOT** initialize with README (we have our own)
6. Click **Create repository**

### 3.3 Push to GitHub

```bash
# Add remote origin (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

Verify your code is on GitHub by visiting the repository URL.

## Step 4: Deploy to Netlify

### 4.1 Import Project

1. Go to [Netlify](https://app.netlify.com/)
2. Click **Add new site** → **Import an existing project**
3. Choose **Deploy with GitHub**
4. Authorize Netlify to access your GitHub account
5. Select your repository from the list

### 4.2 Configure Build Settings

Netlify should auto-detect the settings, but verify:

- **Branch to deploy**: `main`
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 4.3 Add Environment Variables (Optional)

If you want to use a custom Client ID:

1. Click **Show advanced**
2. Click **New variable**
3. Add:
   - **Key**: `VITE_GOOGLE_CLIENT_ID`
   - **Value**: Your Client ID from Google Cloud Console

### 4.4 Deploy

1. Click **Deploy site**
2. Wait for deployment to complete (usually 1-2 minutes)
3. You'll get a random URL like `https://random-name-123.netlify.app`

### 4.5 Custom Domain (Optional)

1. In Netlify site settings, go to **Domain management**
2. Click **Options** → **Edit site name**
3. Choose a custom subdomain (e.g., `chronobox-yourname`)
4. Your new URL: `https://chronobox-yourname.netlify.app`

## Step 5: Update Google OAuth with Production URL

### 5.1 Get Your Netlify URL

Copy your final Netlify URL (e.g., `https://chronobox-yourname.netlify.app`)

### 5.2 Add to Google Cloud Console

1. Return to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Under **Authorized JavaScript origins**, replace the placeholder:
   - Remove: `https://your-app-name.netlify.app`
   - Add: `https://chronobox-yourname.netlify.app` (your actual URL)
4. Keep: `https://*.netlify.app` (for preview deployments)
5. **Save** changes

⏰ **Wait 5 minutes** for Google's changes to propagate.

## Step 6: Test Production Deployment

### 6.1 Visit Your Deployed App

1. Go to your Netlify URL
2. Open browser DevTools (F12)
3. Check Console tab for errors

### 6.2 Test Authentication Flow

1. Click **Sign In** button
2. Should show "Loading..." then "Sign In"
3. Click to open Google OAuth popup
4. Select your Google account
5. Grant Calendar permissions
6. Should redirect back with "Sign Out" button

### 6.3 Test Capsule Creation

1. Navigate to "Create" page
2. Add a message and future date
3. Click "Create Capsule"
4. Check Google Calendar for the event
5. Verify capsule appears in vault

### 6.4 Common Issues

**OAuth popup doesn't open:**
- Check browser console for errors
- Verify popup blocker is disabled
- Clear browser cache

**"redirect_uri_mismatch" error:**
- Your Netlify URL isn't in authorized origins
- Double-check exact URL (with/without trailing slash)
- Wait 5 minutes after updating Google Console

**"Failed to initialize" error:**
- Check internet connection
- Verify Google API scripts loaded
- Check Netlify deploy logs for build errors

## Step 7: Long-term Maintenance

### 7.1 Automatic Deployments

Every push to `main` branch triggers automatic deployment:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Netlify automatically deploys!
```

### 7.2 Monitor Deployments

- View deploy logs in Netlify dashboard
- Set up deploy notifications (Settings → Build & deploy → Deploy notifications)

### 7.3 Dependency Updates

Update dependencies periodically:

```bash
npm outdated
npm update
npm run build  # Test locally
git commit -am "Update dependencies"
git push
```

### 7.4 OAuth Credential Rotation

If you need to change Client IDs:

1. Create new OAuth credentials in Google Cloud Console
2. Update environment variable in Netlify
3. Trigger redeploy (Settings → Deploys → Trigger deploy)

## 🎉 Deployment Complete!

Your ChronoBox app is now live and accessible to anyone with the URL. Share it with friends and family!

### Checklist

- [ ] App deployed to Netlify
- [ ] OAuth configured for production domain
- [ ] Sign-in tested and working
- [ ] Capsule creation tested
- [ ] Calendar events creating successfully
- [ ] No console errors
- [ ] Mobile responsive (test on phone)

---

**Need Help?** Check the main README.md troubleshooting section or review Netlify deploy logs.
