# ⏳ ChronoBox - Digital Time Capsule

A beautiful web application that lets you create digital time capsules sealed until a future date. Store memories, messages, or images and receive a Google Calendar reminder when it's time to open them.

![ChronoBox Banner](https://img.shields.io/badge/Status-Live-success) ![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- 🎨 **Stunning UI** - Modern glassmorphism design with smooth animations
- 📅 **Google Calendar Integration** - Automatic reminders when capsules unlock
- 🔒 **Secure Authentication** - Google OAuth for safe access
- 💾 **Local Storage** - Your capsules stay private on your device
- 📱 **Responsive Design** - Works beautifully on all devices
- 🌙 **Dark Theme** - Eye-friendly dark interface

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm installed
- Google account for OAuth authentication
- (Optional) Google Cloud Console project for custom OAuth credentials

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "Second Project"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - Click "Sign In" and authenticate with Google
   - Start creating time capsules!

### Using Custom Google OAuth Credentials (Optional)

The app comes with a pre-configured Client ID. To use your own:

1. **Create OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials (Web application type)
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (for local development)
     - Your production domain (e.g., `https://your-app.netlify.app`)

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```

3. **Restart the dev server**
   ```bash
   npm run dev
   ```

## 📦 Building for Production

```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

## 🌐 Deploying to Netlify

### Via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Netlify**
   - Go to [Netlify](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Build settings should auto-detect:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - (Optional) Add environment variable `VITE_GOOGLE_CLIENT_ID` if using custom credentials
   - Click "Deploy site"

3. **Update Google OAuth Settings**
   - Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
   - Select your OAuth 2.0 Client ID
   - Add your Netlify URL to "Authorized JavaScript origins":
     - `https://your-app-name.netlify.app`
     - `https://*.netlify.app` (for preview deployments)
   - Save changes

4. **Test Your Deployment**
   - Visit your Netlify URL
   - Click "Sign In"
   - Verify OAuth flow works
   - Create a test capsule

### Manual Deploy

```bash
npm run build
# Upload the 'dist' folder to any static hosting service
```

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router
- **Build Tool**: Vite
- **Styling**: CSS with custom properties
- **Icons**: Lucide React
- **Authentication**: Google OAuth 2.0
- **Storage**: Browser LocalStorage
- **Calendar**: Google Calendar API v3

## 📱 How to Use

1. **Sign In** - Click the "Sign In" button and authenticate with your Google account
2. **Create Capsule** - Navigate to create page, add your message/image, and set the unlock date
3. **Receive Reminder** - Google Calendar will remind you when it's time to open
4. **View Vault** - See all your locked and unlocked capsules in one place

## 🔧 Troubleshooting

### Sign-in button shows "Init Failed"
- Check your internet connection
- Verify Google API scripts are loading (check browser console)
- Clear browser cache and reload

### OAuth popup blocked
- Allow popups for this site in your browser settings
- Try again after enabling popups

### Calendar events not creating
- Ensure you granted Calendar permissions during sign-in
- Sign out and sign in again to re-authorize

### Build errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Ensure Node.js version is 16 or higher

## 🔒 Privacy & Security

- All capsule data is stored locally in your browser
- Google OAuth is used only for Calendar API access
- No data is sent to external servers
- Client ID is not a secret (it's meant to be public)

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions:
1. Check the Troubleshooting section above
2. Review browser console for error messages
3. Ensure OAuth credentials are configured correctly

---

Built with ❤️ using React and Google Calendar API
