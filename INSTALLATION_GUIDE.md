# Restaurant Menu Platform - Installation Guide

This guide will help you set up your restaurant menu website with minimal technical knowledge required. We'll walk through each step carefully.

## What You'll Need

- A Google account (for Firebase)
- A GitHub account (free)
- A Vercel account (free)
- About 30-60 minutes of your time

## Step 1: Set Up Your Firebase Project

Firebase is where all your restaurant data will be stored.

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and enter a name for your project (e.g., "My Restaurant App")
3. Disable Google Analytics if prompted (not needed)
4. Click "Create project" and wait for it to be ready
5. When your project is ready, click "Continue"

### Enable Firebase Services

1. In the left sidebar, click "Build" and then "Authentication"
2. Click "Get started"
3. Enable "Email/Password" and "Google" providers
4. Click "Save"

Now, set up the database:

1. In the left sidebar, click "Build" and then "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll set up security later)
4. Select a location closest to your area
5. Click "Enable"

Finally, instead of using Firebase Storage (which requires a paid plan), we'll use a free alternative for image hosting:

1. **Option 1: Use Imgur or ImgBB**
   - Create a free account on [Imgur](https://imgur.com/) or [ImgBB](https://imgbb.com/)
   - Upload your restaurant images there
   - Copy the direct image URLs to use in your restaurant profile

2. **Option 2: Use GitHub to host images**
   - In your GitHub repository, create an 'images' folder
   - Upload your restaurant images to this folder
   - Use the raw GitHub URLs for your images (right-click on the image in GitHub → Copy image address)

**Note:** With these approaches, you'll manually upload images and paste their URLs into your restaurant profile forms.

## Step 2: Get Your Firebase Configuration

1. Click the gear icon (⚙️) next to "Project Overview" and select "Project settings"
2. Scroll down to "Your apps" and click the web icon (</>) 
3. Enter a nickname for your app (e.g., "MyRestaurantApp-web")
4. Click "Register app"
5. You'll see a code snippet with `firebaseConfig` - keep this page open, you'll need these values later

## Step 3: Create a GitHub Repository from Our Template

1. Go to our template repository (link will be provided separately)
2. Click the "Use this template" button
3. Click "Create a new repository"
4. Give your repository a name (e.g., "my-restaurant-website")
5. Make it "Public"
6. Click "Create repository from template"

## Step 4: Connect to Vercel for Deployment

1. Go to [Vercel](https://vercel.com/) and sign up/in with your GitHub account
2. Click "New Project"
3. Find and select your new repository
4. Click "Import"
5. Under "Environment Variables", add the following based on your Firebase config:
   - `NEXT_PUBLIC_FIREBASE_API_KEY` = (your apiKey value)
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = (your authDomain value)
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = (your projectId value)
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = (your storageBucket value)
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = (your messagingSenderId value)
   - `NEXT_PUBLIC_FIREBASE_APP_ID` = (your appId value)
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` = (your measurementId value if available)
6. Click "Deploy"
7. Wait for the deployment to complete (this may take a few minutes)

## Step 5: Access Your New Website

1. Once deployment is complete, Vercel will show you a success message
2. Click the "Visit" button to see your new website
3. Your website URL will be something like `your-project-name.vercel.app`

## Step 6: Create Your Admin Account

1. On your new website, click "Sign Up"
2. Select "Add Your Restaurant" at the bottom of the page
3. Fill in your details and create your account
4. Complete the restaurant information form
5. Your restaurant dashboard will now be available

## Next Steps

1. Add menu items through your dashboard
2. Customize your restaurant profile
3. Share your website URL with customers

## Getting Help

If you encounter any issues during setup:
- Check our FAQ section (link will be provided separately)
- Email support at (support email will be provided separately)

## Optional: Custom Domain

If you want to use your own domain name (like www.yourrestaurant.com):
1. In Vercel, go to your project
2. Click "Settings" and then "Domains"
3. Add your domain and follow the instructions

Congratulations! You now have your own restaurant menu website that allows customers to browse your menu and place orders. 