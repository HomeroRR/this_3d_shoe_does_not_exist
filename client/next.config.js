const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  scope: "/",
  disable: process.env.NODE_ENV === "development",
  sw: "sw.js",
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
});

module.exports = nextConfig;
