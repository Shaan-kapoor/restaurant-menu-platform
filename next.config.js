/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
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
};

module.exports = nextConfig; 