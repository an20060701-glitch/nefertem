import type { NextConfig } from "next";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

const nextConfig: NextConfig = {
  // Serve Firebase's sign-in helper from our own domain. Phones (Safari's storage
  // partitioning, in-app browsers) lose the sign-in state when the helper lives on
  // firebaseapp.com; with NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN set to the site's own host
  // the whole flow stays first-party.
  async rewrites() {
    if (!projectId) return [];
    const helper = `https://${projectId}.firebaseapp.com`;
    return [
      { source: "/__/auth/:path*", destination: `${helper}/__/auth/:path*` },
      { source: "/__/firebase/:path*", destination: `${helper}/__/firebase/:path*` },
    ];
  },
};

export default nextConfig;
