# Google Cloud Services Setup Guide

This guide will help you set up Google Cloud services (Firestore and Vision API) for the EcoCycle application.

## Prerequisites

1. Google Cloud Platform account
2. Node.js and npm installed
3. EcoCycle project cloned

## Step 1: Enable Google Cloud Services

### 1.1 Enable Firestore
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **Firestore Database** in the left sidebar
4. Click **Create Database**
5. Choose **Start in production mode** (or test mode for development)
6. Select a location for your database
7. Click **Done**

### 1.2 Enable Vision API
1. In Google Cloud Console, navigate to **APIs & Services** > **Library**
2. Search for "Cloud Vision API"
3. Click on **Cloud Vision API**
4. Click **Enable**

## Step 2: Create Service Account

1. In Google Cloud Console, go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Enter a name (e.g., "ecocycle-service-account")
4. Add description: "Service account for EcoCycle application"
5. Click **Create and Continue**
6. For roles, add:
   - **Firebase Admin** (for Firestore access)
   - **Cloud Vision API User** (for Vision API access)
7. Click **Continue**
8. Click **Done**

## Step 3: Download Service Account Key

1. Click on your newly created service account
2. Go to the **Keys** tab
3. Click **Add Key** > **Create New Key**
4. Choose **JSON** format
5. Click **Create**
6. The JSON file will download automatically
7. Rename it to `striped-sight-443116-g6-a85ecf31e5a9.json` and place it in your project root

## Step 4: Configure Environment Variables

Create or update your `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Cloud Configuration
GOOGLE_CLOUD_KEY_FILE=./striped-sight-443116-g6-a85ecf31e5a9.json
```

## Step 5: Install Dependencies

Run the following command to install the required packages:

```bash
npm install @google-cloud/vision firebase
```

## Step 6: Configure Firestore Security Rules

In your Firestore console, go to **Rules** and update the security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own recycling records
    match /recycling_records/{recordId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Users can read/write their own device analysis
    match /device_analysis/{analysisId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Users can read/write their own analytics
    match /analytics/{analyticsId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## Step 7: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the dashboard and test:
   - **Device Analyzer**: Upload an image of an electronic device
   - **User Stats**: View your recycling statistics (will be empty initially)

## Step 8: Production Deployment

### Vercel Deployment
1. Add your environment variables in Vercel dashboard
2. Upload your service account JSON file to Vercel
3. Update the `GOOGLE_CLOUD_KEY_FILE` path in production

### Other Platforms
- Ensure your service account JSON is accessible
- Set environment variables appropriately
- Configure CORS if needed

## Troubleshooting

### Common Issues

1. **Vision API not working**
   - Ensure Vision API is enabled
   - Check service account has proper permissions
   - Verify JSON key file path

2. **Firestore connection issues**
   - Verify Firebase configuration
   - Check security rules
   - Ensure service account has Firebase Admin role

3. **Authentication errors**
   - Verify Firebase Auth is properly configured
   - Check environment variables
   - Ensure user is logged in

### Error Messages

- `"Failed to analyze image"`: Check Vision API configuration
- `"Firebase: Error (auth/user-not-found)"`: User authentication issue
- `"Permission denied"`: Check Firestore security rules

## Security Considerations

1. **Never commit your service account JSON to version control**
2. **Use environment variables for sensitive data**
3. **Implement proper Firestore security rules**
4. **Regularly rotate service account keys**
5. **Monitor API usage and costs**

## Cost Optimization

1. **Vision API**: ~$1.50 per 1000 images
2. **Firestore**: Free tier includes 1GB storage and 50K reads/day
3. **Monitor usage** in Google Cloud Console
4. **Set up billing alerts** to avoid unexpected charges

## Support

For additional help:
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vision API Documentation](https://cloud.google.com/vision/docs)

## Next Steps

After setup, you can:
1. Customize the device analysis algorithms
2. Add more device types and brands
3. Implement advanced analytics
4. Add real-time notifications
5. Integrate with other Google Cloud services 