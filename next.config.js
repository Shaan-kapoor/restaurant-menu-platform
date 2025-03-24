/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'i.imgur.com',         // Imgur
      'i.ibb.co',            // ImgBB
      'raw.githubusercontent.com', // GitHub raw content
      'res.cloudinary.com',  // Cloudinary
      'images.unsplash.com', // Unsplash
      'placehold.co'         // Placeholder service
    ],
  },
};

module.exports = nextConfig; 