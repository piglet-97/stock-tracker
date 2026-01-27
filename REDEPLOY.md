# 重新部署指南

由于Vercel不会自动从GitHub拉取最新代码进行重新部署，您需要手动触发部署。

## 方法一：通过Vercel控制台（推荐）

1. 访问 https://vercel.com/dashboard
2. 登录您的账户
3. 找到 stock-tracker 项目
4. 点击 "Deployments" 选项卡
5. 点击 "Redeploy all" 或 "Deploy" 按钮

## 方法二：通过Vercel CLI

如果您已在本地安装了Vercel CLI：

```bash
# 在项目目录中运行
vercel --prod
```

## 方法三：通过GitHub Webhook

如果您的项目是通过GitHub集成的：

1. 在GitHub仓库中，转到 "Settings" > "Webhooks"
2. 找到Vercel的webhook
3. 手动触发推送事件

## 验证部署

部署完成后：
1. 检查Vercel控制台中的构建日志
2. 访问您的应用URL确认更新已生效

## 自动部署设置

为了实现自动部署：

1. 在Vercel项目设置中，转到 "Git" 选项
2. 确保 "Production Branch" 设置为 "main"
3. 确保 "Ignored Build Step" 没有被设置，这样每次提交都会触发构建