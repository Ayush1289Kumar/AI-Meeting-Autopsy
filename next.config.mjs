/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/dashboard",
        permanent: false,
      },
      {
        source: "/register",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
