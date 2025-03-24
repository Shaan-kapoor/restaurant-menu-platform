# Restaurant Menu Platform - Developer Guide

This document provides technical instructions for developers working on the Restaurant Menu Platform project.

## Tech Stack

- **Frontend**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Image Hosting**: External services (Imgur, ImgBB, or GitHub)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase account
- Git
- Account on an image hosting service (Imgur, ImgBB, etc.)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd restaurant-menu-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up Firebase:
   - Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password) and Firestore Database
   - Get your Firebase config from Project Settings > Your Apps
   - Create a `.env.local` file in the project root with the following content:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
     ```

4. Set up Image Hosting:
   - Create an account on an image hosting service (Imgur, ImgBB)
   - Alternatively, create an 'images' folder in your GitHub repository
   - In the application, users will paste URLs from these services when adding images

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
restaurant-menu-platform/
├── app/                  # Next.js app directory
│   ├── dashboard/        # Restaurant owner dashboard
│   ├── login/            # Authentication pages
│   ├── restaurants/      # Restaurant listing and details
│   ├── globals.css       # Global CSS
│   ├── layout.js         # Root layout component
│   └── page.js           # Homepage
├── components/           # Reusable React components
├── lib/                  # Utility functions and Firebase setup
├── public/               # Static assets
├── .env.local.example    # Example environment variables
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── postcss.config.js     # PostCSS configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## Key Components

- **Authentication**: Using Firebase Auth with custom React Context
- **Restaurant Data**: Stored in Firestore with the structure defined in `data_schema.md`
- **Menu Items**: Nested collection within each restaurant document
- **Orders**: Separate collection with references to users and restaurants
- **Rewards System**: Implemented as part of the user document
- **Image Management**: Using external image hosting services instead of Firebase Storage to avoid paid plans

## Development Workflow

1. Create feature branches from `main`
2. Implement features or bug fixes
3. Submit pull requests for review
4. After approval, merge to `main`

## Deployment

The application is configured for deployment to Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in the Vercel dashboard
3. Deploy the application

## Security Rules

Firebase security rules are crucial for this application. Basic rules are:

- Restaurant owners can only edit their own restaurant data
- Users can only view their own profile data
- Orders are readable by the restaurant owner and the user who placed them
- Public data (restaurant listings, menus) is readable by everyone

## Creating a Template Repository

If you're a developer who wants to share this project as a template for others:

1. Set up your GitHub repository with all the code
2. Go to your repository's settings
3. Scroll down to the "Template repository" section
4. Check the box to make it a template repository
5. Update the INSTALLATION_GUIDE.md with your repository URL
6. Users can now create their own repositories from your template with one click

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Imgur API Documentation](https://apidocs.imgur.com/)
- [ImgBB API Documentation](https://api.imgbb.com/) 