/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 使用静态导出以避免动态路由问题
  trailingSlash: true, // 确保URL以斜杠结尾
  experimental: {
    serverComponentsExternalPackages: ["@libsql/client"],
  },
  // 确保静态资源正确处理
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 避免客户端代码中出现服务端代码
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;