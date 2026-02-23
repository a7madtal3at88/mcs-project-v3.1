import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // يشتغل في Production فقط (Vercel)
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // سيبها بسيطة
};

export default withPWA(nextConfig);