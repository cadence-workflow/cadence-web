// next.config.js
/** @type {import('next').NextConfig} */

import path from 'path';
import { fileURLToPath } from 'url';
import createMDX from '@next/mdx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUILD_OUTPUT =
  process.env.NEXT_CONFIG_BUILD_OUTPUT === 'standalone'
    ? 'standalone'
    : undefined;

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  webpack: (config, options) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    if (options.isServer) {
      config.externals.push(
        '@grpc/grpc-js',
        'require-in-the-middle',
        'pino',
        /^@opentelemetry\//
      );
    }
    return config;
  },
  redirects: async () => {
    // TODO - load tabs configs here to dynamically define redirects
    return [
      {
        // This regex matches paths that try to load a domain or workflow without specifying the active cluster
        source:
          '/domains/:path((?:[^/]+)(?:/(?:workflows|metadata|settings|archival|task-lists)(?:/.*)?)?)',
        destination: '/redirects/domain/:path',
        permanent: true,
      },
      {
        source: '/domains/:domain/:cluster',
        destination: '/domains/:domain/:cluster/workflows',
        permanent: true,
      },
      {
        source: '/domains/:domain/:cluster/workflows/:workflowId/:runId',
        destination:
          '/domains/:domain/:cluster/workflows/:workflowId/:runId/summary',
        permanent: true,
      },
    ];
  },
  output: BUILD_OUTPUT,
  experimental: {
    instrumentationHook: true,
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
