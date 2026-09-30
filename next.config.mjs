/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/doc/Gaye-Dinc-CV.pdf',
        destination: '/doc/Gaye_Dinc_CV_TR_2026.pdf',
        // Explicit 301: Next.js uses 308 for permanent: true.
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
