/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig = {
  experimental: {
    // Tree-shake icon imports so only used lucide icons are bundled.
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
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
