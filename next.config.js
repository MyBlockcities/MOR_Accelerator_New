/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.io"],
  },
  webpack: (config, { isServer }) => {
    // Add WebSocket support
    config.externals = [...(config.externals || [])];
    if (isServer) {
      config.externals.push({
        'socket.io-client': 'socket.io-client',
      });
    }
    
    // Exclude hardhat config from the build
    config.module.rules.push({
      test: /hardhat\.config\.(js|ts)$/,
      use: 'ignore-loader',
    });
    
    return config;
  },
  // Add support for WebSocket upgrade
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
