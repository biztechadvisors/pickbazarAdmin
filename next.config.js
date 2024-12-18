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
    unoptimized: true,
    domains: [
      'via.placeholder.com',
      'res.cloudinary.com',
      's3.amazonaws.com',
      'codenoxtestbucket.s3.ap-south-1.amazonaws.com',
      '18.141.64.26', 
      // '192.168.1.16', 
      'picsum.photos',
      'pickbazar-sail.test',
      'codenoxtestbucket.s3.ap-south-1.amazonaws.com',
      'lh3.googleusercontent.com',
      'images.pexels.com',
      'codenoxtestbucket.s3.ap-south-1.amazonaws.com',
      'hilltopmarble.s3.ap-south-1.amazonaws.com',
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
