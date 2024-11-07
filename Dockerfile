# 使用官方 Node.js 镜像作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml（如果使用 pnpm）
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install

# 复制项目文件
COPY . .

# 构建应用
RUN pnpm run build

# 暴露端口（根据您的应用需要进行调整）
EXPOSE 3001

# 启动应用
CMD ["pnpm", "start"]