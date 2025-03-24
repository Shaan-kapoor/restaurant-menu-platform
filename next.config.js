/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable strict mode for static export
  output: 'export',
  trailingSlash: true,
  images: {
    domains: [
      'i.imgur.com',         // Imgur
      'i.ibb.co',            // ImgBB
      'raw.githubusercontent.com', // GitHub raw content
      'res.cloudinary.com',  // Cloudinary
      'images.unsplash.com', // Unsplash
      'placehold.co'         // Placeholder service
    ],
    unoptimized: true,
  },
  // Add environment variables to be available during build
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: 'true',
  },
  // Transpile certain packages during static export
  transpilePackages: ['firebase'],
};

module.exports = nextConfig; 