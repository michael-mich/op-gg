/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pandascore.co'
      },
      {
        protocol: 'https',
        hostname: 's-lol-web.op.gg'
      }
    ]
  }
};

export default nextConfig;
