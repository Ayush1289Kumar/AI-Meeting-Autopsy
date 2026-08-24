/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tree-shakes barrel-file imports from these packages so only the icons/
  // chart pieces actually used end up in the client bundle, instead of the
  // whole library being pulled into every page that imports from them.
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion"],
  },
};

export default nextConfig;
