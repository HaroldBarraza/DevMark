import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, 
  images: {
    domains: [
      "i.ytimg.com",
      "www.meteored.com.ar",
      "images.unsplash.com",
      "example.com",   
    ],
  },
};

export default nextConfig;
