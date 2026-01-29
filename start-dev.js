#!/usr/bin/env node

// 临时解决Turbopack问题，使用传统的webpack模式启动
const { spawn } = require('child_process');

// 设置环境变量禁用Turbopack
const env = { ...process.env, NEXT_PRIVATE_LOCAL_WEBPACK: 'true' };

const devProcess = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: env
});

devProcess.on('error', (err) => {
  console.error('Failed to start development server:', err);
});