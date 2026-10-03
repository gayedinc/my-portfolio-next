import { CV_PATH } from './src/lib/cv.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/doc/Gaye-Dinc-CV.pdf',
        destination: CV_PATH,
        // Explicit 301: Next.js uses 308 for permanent: true.
        statusCode: 301,
      },
      {
        source: '/doc/Gaye_Dinc_CV_TR_2026.pdf',
        destination: CV_PATH,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
