/** @type {import('next').NextConfig} */
const runtimeCaching = require('next-pwa/cache');
const { i18n } = require('./next-i18next.config');
const withPWA = require('next-pwa')({
  disable: process.env.NODE_ENV === 'development',
  dest: 'public',
  runtimeCaching,
});

module.exports = withPWA({
  reactStrictMode: true, 
  i18n: {
    locales: ['en', 'fr', 'de'],  
    defaultLocale: 'en',       
  },
  images: {
    domains: [
      'via.placeholder.com',
      'res.cloudinary.com',
      's3.amazonaws.com',
      'codenoxtestbucket.s3.ap-south-1.amazonaws.com',
      '18.141.64.26',
      '127.0.0.1',
      'localhost',
      'picsum.photos',
      'pickbazar-sail.test',
      'codenoxtestbucket.s3.ap-south-1.amazonaws.com',
      'lh3.googleusercontent.com',
      'images.pexels.com',
      'server.codenoxx.com',
      's3.ap-south-1.amazonaws.com',
    ],
  },
  ...(process.env.APPLICATION_MODE === 'production' && {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),
});
