import withBundleAnalyzer from '@next/bundle-analyzer';

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
      },
      {
        protocol: 'https',
        hostname: 'opgg-static.akamaized.net'
      }
    ]
  }
};

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})
export default withBundleAnalyzerConfig(nextConfig);