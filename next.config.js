/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    return config;
  }
}

module.exports = nextConfig
