import type { NextConfig } from 'next';
import sitio from './sitio.config';

const host = new URL(sitio.dominio).host;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  trailingSlash: Boolean(sitio.barraFinal),
  // Un solo dominio para buscadores: www.<dominio> redirige al dominio principal conservando la ruta.
  async redirects() {
    return host.startsWith('www.') ? [] : [{ source: '/:path*', has: [{ type: 'host', value: `www.${host}` }], destination: `${sitio.dominio}/:path*`, permanent: true }];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
