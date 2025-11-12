const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: false,
  trailingSlash: true,

  // 👇 fuerza modo SPA
  devIndicators: { buildActivity: false },
  generateEtags: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "/index.html",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
