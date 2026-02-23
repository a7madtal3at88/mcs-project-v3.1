import withPWA from "next-pwa";

const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // خليها بسيطة
};

export default withPWA({
  dest: "public",
  disable: !isProd, // يشتغل PWA بس على Vercel (production)
  register: true,
  skipWaiting: true,
})(nextConfig);