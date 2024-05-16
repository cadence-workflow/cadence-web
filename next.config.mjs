// next.config.js
/** @type {import('next').NextConfig} */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    return config;
  },
  redirects: async () => {
    // TODO - load tabs configs here to dynamically define redirects
    return [
      {
        source: '/domains/:domain/:cluster',
        destination: '/domains/:domain/:cluster/workflows',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
