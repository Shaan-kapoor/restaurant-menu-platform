// This file contains the generateStaticParams function for the [id] route
// It's needed for static export with dynamic routes
// In a real app, you'd fetch this data from your API/database 
// For static export, we'll use dummy IDs for demonstration

export async function generateStaticParams() {
  // Provide some dummy restaurant IDs for static generation
  // This allows Next.js to pre-render these pages at build time
  return [
    { id: 'restaurant1' },
    { id: 'restaurant2' },
    { id: 'restaurant3' },
    { id: 'sample-restaurant' },
    { id: 'demo-restaurant' },
  ];
} 