/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // This allows us to access local files during build time
    webpack: (config) => {
        config.resolve.fallback = { fs: false };
        return config;
    },
}

module.exports = nextConfig
