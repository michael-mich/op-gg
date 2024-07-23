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
      },
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com'
      }
    ]
  }
};

export default nextConfig;
