// next.config.js
/** @type {import('next').NextConfig} */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUILD_OUTPUT =
  process.env.NEXT_CONFIG_BUILD_OUTPUT === 'standalone'
    ? 'standalone'
    : undefined;

const nextConfig = {
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
  /**
   * Redirects are matched top-down; the first match wins.
   *
   * Some rules fill in a missing URL part by sending the request to a resolver
   * page under /redirects, which looks up the value and redirects again.
   *
   * A missing cluster goes to /redirects/domain,
   * and a missing run ID goes to /redirects/workflow.
   *
   * The tab names below are copied by hand from domain-page-tabs.config.ts and
   * workflow-page-tabs.config.ts. Add new tabs here too, otherwise a cluster-less
   * domain tab is read as a cluster name, and a workflow tab is read as a run ID,
   * breaking URLs.
   *
   * TODO - load tabs configs here to dynamically define redirects.
   */
  redirects: async () => {
    return [
      {
        source:
          '/domains/:path((?:[^/]+)(?:/(?:workflows|schedules|cron-list|metadata|failovers|settings|archival|batch-actions|task-lists)(?:/.*)?)?)',
        destination: '/redirects/domain/:path',
        permanent: true,
      },
      {
        source: '/domains/:domain/:cluster',
        destination: '/domains/:domain/:cluster/workflows',
        permanent: true,
      },
      {
        source:
          '/domains/:domain/:cluster/workflows/:workflowPath([^/]+(?:/(?:summary|history|queries|stack-trace|diagnostics))?)',
        destination: '/redirects/workflow/:domain/:cluster/:workflowPath',
        permanent: true,
      },
      {
        source: '/domains/:domain/:cluster/workflows/:workflowId/:runId',
        destination:
          '/domains/:domain/:cluster/workflows/:workflowId/:runId/summary',
        permanent: true,
      },
      {
        source: '/domains/:domain/:cluster/schedules/:scheduleId',
        destination: '/domains/:domain/:cluster/schedules/:scheduleId/details',
        permanent: true,
      },
    ];
  },
  output: BUILD_OUTPUT,
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
