import type { NextConfig } from "next";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Basic security headers (An, 2026-10-09). Framing stays same-origin: Firebase's sign-in
// helper (/__/auth) runs in an iframe on our own host. Geolocation stays on for the weather.
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
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
