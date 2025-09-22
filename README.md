# SMTP App with Firebase Authentication

A web application demonstrating Firebase Authentication with email/password and Google sign-in.

## Setup Instructions

### 1. Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
   - Enable "Google" provider (optional)
4. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click "Add app" and select Web (</>) 
   - Register your app and copy the configuration object

### 2. Configure the Application

1. Open `firebase-config.js`
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

### 3. Run the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Features

- ✅ Email/Password Authentication
- ✅ Google Sign-in
- ✅ Password Reset
- ✅ User State Management
- ✅ Responsive Design
- ✅ Modern UI/UX

## File Structure

```
smtp-app/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── app.js             # Main application logic
├── auth.js            # Authentication service
├── firebase-config.js # Firebase configuration
├── package.json       # Dependencies
└── README.md          # This file
```

## Security Notes

- Never commit your actual Firebase configuration to version control
- Use environment variables for production deployments
- Configure Firebase Security Rules for your database/storage if used
- Enable Firebase App Check for additional security in production

## Troubleshooting

1. **"Firebase not defined" error**: Make sure you're serving the files through a web server (not opening directly in browser)
2. **Authentication not working**: Verify your Firebase configuration is correct
3. **Google Sign-in issues**: Ensure Google provider is enabled in Firebase Console
4. **CORS errors**: Use the provided npm scripts to run a local server

## Next Steps

- Add email verification
- Implement user profiles
- Add database integration
- Deploy to Firebase Hosting