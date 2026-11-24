/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    imageSizes: [32, 48, 64, 96, 128, 192, 256, 320, 384, 480, 560],
    deviceSizes: [640, 750, 828, 960, 1080, 1200, 1440, 1600, 1920, 2048, 3840],
  },
};

export default nextConfig;
