/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize pdfkit and related packages for server-side bundling
      config.externals = config.externals || []
      config.externals.push({
        'pdfkit': 'commonjs pdfkit',
        'iconv-lite': 'commonjs iconv-lite',
      })
    }
    return config
  },
}

module.exports = nextConfig


