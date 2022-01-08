/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    // Will be available on both server and client
    DEVTO_URL: process.env.DEVTO_URL,
    DEVTO_API_KEY: process.env.DEVTO_API_KEY,
    DEVTO_USERNAME: process.env.DEVTO_USERNAME,
    HASHNODE_URL: process.env.HASHNODE_URL,
    HASHNODE_API_KEY: process.env.HASHNODE_API_KEY,
    HASHNODE_USERNAME: process.env.HASHNODE_USERNAME,
    HASHNODE_PUBLICATION_ID: process.env.HASHNODE_PUBLICATION_ID
  }
}
