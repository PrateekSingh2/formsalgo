import { config } from "dotenv";
import path from "path";

// Load root .env file so the frontend has access to the keys
const envPath = path.resolve(process.cwd(), "../../.env");
const parsedEnv = config({ path: envPath }).parsed || {};

// Filter only NEXT_PUBLIC variables to inject into the browser
const nextPublicEnv: Record<string, string> = {};
for (const key in parsedEnv) {
  if (key.startsWith("NEXT_PUBLIC_")) {
    nextPublicEnv[key] = parsedEnv[key];
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: nextPublicEnv,
  transpilePackages: ["@formforge/types", "@formforge/trpc"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
