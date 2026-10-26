/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // This allows Next.js to optimize the images you uploaded
    unoptimized: true, 
  },
  // If you plan to deploy to GitHub Pages later, you might need:
  output: 'export',
};

export default nextConfig;