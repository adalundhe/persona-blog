/** @type {import('next').NextConfig} */

const withImages = require('next-images');


module.exports = {
  ...withImages(),
  reactStrictMode: true,
  publicRuntimeConfig: {
    // Will be available on both server and client
    API_URL: process.env.API_URL || "http://localhost:3000/api",
    DEVTO_URL: process.env.DEVTO_URL,
    DEVTO_API_KEY: process.env.DEVTO_API_KEY,
    DEVTO_USERNAME: process.env.DEVTO_USERNAME,
    HASHNODE_URL: process.env.HASHNODE_URL,
    HASHNODE_API_KEY: process.env.HASHNODE_API_KEY,
    HASHNODE_USERNAME: process.env.HASHNODE_USERNAME,
    HASHNODE_PUBLICATION_ID: process.env.HASHNODE_PUBLICATION_ID,
    GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    GITHUB_USERNAME: process.env.GITHUB_USERNAME,
    OPEN_WEATHER_URL: process.env.OPEN_WEATHER_URL,
    OPEN_WEATHER_ICON_URL: process.env.OPEN_WEATHER_ICON_URL,
    OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY,
    TWITTER_API_KEY: process.env.TWITTER_API_KEY,
    TWITTER_API_KEY_SECRET: process.env.TWITTER_API_KEY_SECRET,
    TWITTER_USERNAME: process.env.TWITTER_USERNAME
  }
}
