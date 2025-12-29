/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Outputs a Single-Page Application (SPA).
  distDir: './dist' // Changes the build output directory to `./dist/`.
};

export default nextConfig;
