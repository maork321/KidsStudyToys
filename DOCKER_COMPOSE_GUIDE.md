# Docker Compose 使用指南

本文档详细介绍如何使用 docker-compose 来管理 KidsStudyToys 应用的部署和升级。

## 目录
- [基础概念](#基础概念)
- [快速开始](#快速开始)
- [常用命令](#常用命令)
- [生产环境部署](#生产环境部署)
- [本地开发](#本地开发)
- [数据持久化](#数据持久化)
- [故障排查](#故障排查)

---

## 基础概念

### 什么是 docker-compose？
docker-compose 是一个工具，用于定义和运行多容器 Docker 应用。通过一个 YAML 文件，你可以配置应用的服务，然后使用一个命令启动所有服务。

### 核心组件
- **Image（镜像）**：应用的模板，类似安装包
- **Container（容器）**：镜像的运行实例，类似安装后的程序
- **Service（服务）**：在 docker-compose 中，一个服务对应一个容器

---

## 快速开始

### 前置要求
1. 安装 Docker Desktop 或 Docker Engine
2. 安装 docker-compose（通常已包含在 Docker Desktop 中）

验证安装：
```bash
docker --version
docker-compose --version
```

### 拉取并启动应用（首次使用）

```bash
# 1. 克隆项目（如果还没有）
git clone https://github.com/maork321/KidsStudyToys.git
cd KidsStudyToys

# 2. 拉取最新镜像并启动
docker-compose up -d

# 3. 查看服务状态
docker-compose ps

# 4. 查看日志
docker-compose logs -f
```

### 访问应用
打开浏览器访问：http://localhost:8080

---

## 常用命令

### 启动服务

```bash
# 启动服务（后台运行）
docker-compose up -d

# 启动服务并查看日志
docker-compose up

# 启动服务并重新构建镜像
docker-compose up --build -d
```

### 停止服务

```bash
# 停止服务（保留容器）
docker-compose stop

# 停止并删除容器
docker-compose down
```

### 升级应用

```bash
# 方法一：重新拉取镜像并启动（推荐）
docker-compose pull
docker-compose up -d

# 方法二：一行命令完成（如果本地镜像已过期会自动拉取）
docker-compose up -d --pull always
```

### 查看状态和日志

```bash
# 查看运行状态
docker-compose ps

# 查看所有服务的日志
docker-compose logs

# 实时查看日志
docker-compose logs -f

# 查看特定服务的日志
docker-compose logs -f kids-edu-platform
```

### 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart kids-edu-platform
```

---

## 生产环境部署

### 1. 登录 Container Registry（首次需要）

```bash
# 使用 GitHub Personal Access Token 登录
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u maork321 --password-stdin

# 验证登录
docker ps
```

获取 Token：
1. 访问 https://github.com/settings/tokens
2. 生成新 token（classic）
3. 勾选 `read:packages` 权限

### 2. 部署命令

```bash
# 进入项目目录
cd /path/to/KidsStudyToys

# 拉取最新镜像
docker-compose pull

# 停止旧容器并启动新容器
docker-compose up -d

# 验证部署
docker-compose ps
curl http://localhost:8080
```

### 3. 自动部署脚本

创建 `deploy.sh` 文件：

```bash
#!/bin/bash
echo "开始部署 KidsStudyToys..."

# 登录
echo "登录 Container Registry..."
echo "$GITHUB_TOKEN" | docker login ghcr.io -u maork321 --password-stdin

# 拉取最新镜像
echo "拉取最新镜像..."
docker-compose pull

# 重启服务
echo "重启服务..."
docker-compose up -d --remove-orphans

# 等待服务启动
sleep 5

# 检查健康状态
if docker-compose ps | grep -q "healthy"; then
    echo "✅ 部署成功！访问 http://localhost:8080"
else
    echo "⚠️ 服务已启动，请检查健康状态"
    docker-compose ps
fi
```

使用方法：
```bash
chmod +x deploy.sh
GITHUB_TOKEN=your_token_here ./deploy.sh
```

### 4. 使用 Systemd 自动启动

创建服务文件 `/etc/systemd/system/kids-study.service`：

```ini
[Unit]
Description=KidsStudyToys Education Platform
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/path/to/KidsStudyToys
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

启用服务：
```bash
sudo systemctl daemon-reload
sudo systemctl enable kids-study
sudo systemctl start kids-study
```

---

## 本地开发

### 使用本地构建

如果你修改了代码，想要测试本地构建版本：

```bash
# 启动本地开发服务
docker-compose --profile local up -d

# 访问本地版本
http://localhost:8081
```

### 修改代码后重新构建

```bash
# 停止并删除旧容器
docker-compose down

# 重新构建并启动
docker-compose --profile local up --build -d
```

---

## 数据持久化

### 当前配置说明

当前配置中，应用数据存储在浏览器本地存储（localStorage）中。如果需要持久化到容器外部，可以添加数据卷。

修改 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  kids-edu-platform:
    image: ghcr.io/maork321/kidsstudytoys:latest
    container_name: kids-study-toys
    ports:
      - "8080:80"
    volumes:
      - ./data:/data  # 挂载数据目录
    restart: unless-stopped
```

### 数据备份

```bash
# 创建备份目录
mkdir -p backups

# 备份数据（需要进入容器或使用 volume）
docker run --rm -v kids-study-toys_data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/data-$(date +%Y%m%d).tar.gz /data
```

---

## 故障排查

### 查看错误日志

```bash
# 查看详细错误
docker-compose logs --tail=100

# 实时跟踪日志
docker-compose logs -f --tail=50
```

### 检查容器健康状态

```bash
# 查看容器状态
docker-compose ps

# 检查容器内部
docker exec -it kids-study-toys sh

# 检查 nginx 配置
docker exec kids-study-toys cat /etc/nginx/nginx.conf
```

### 常见问题及解决方案

#### 1. 端口冲突

如果 8080 端口已被占用：

```bash
# 修改端口
# 编辑 docker-compose.yml
ports:
  - "8081:80"  # 改为 8081

# 重新启动
docker-compose down
docker-compose up -d
```

#### 2. 镜像拉取失败

```bash
# 检查网络
ping ghcr.io

# 手动拉取镜像
docker pull ghcr.io/maork321/kidsstudytoys:latest

# 如果失败，重新登录
docker logout ghcr.io
echo "$GITHUB_TOKEN" | docker login ghcr.io -u maork321 --password-stdin
```

#### 3. 容器启动失败

```bash
# 查看详细日志
docker-compose up

# 检查 Dockerfile 问题
docker build -t test-build .
```

#### 4. 清理重建

如果遇到无法解决的问题：

```bash
# 完全停止并删除
docker-compose down -v

# 删除本地镜像
docker rmi ghcr.io/maork321/kidsstudytoys:latest

# 重新拉取并启动
docker-compose up -d
```

---

## 进阶用法

### 使用 Docker Swarm 部署

```bash
# 初始化 Swarm
docker swarm init

# 部署 stack
docker stack deploy -c docker-compose.yml kids-study

# 查看服务
docker service ls
```

### 使用 Portainer 管理

Portainer 是一个 Docker 图形化管理界面：

```bash
# 安装 Portainer
docker volume create portainer_data
docker run -d \
  -p 9000:9000 \
  -p 8000:8000 \
  --name portainer \
  --restart always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer

# 访问 http://localhost:9000
```

---

## 最佳实践

1. **定期更新**：每周执行一次 `docker-compose pull` 保持最新
2. **监控日志**：设置日志轮转，避免磁盘空间问题
3. **定期备份**：导出重要数据
4. **使用特定版本**：生产环境建议使用特定版本号，而非 latest
5. **健康检查**：定期检查 `docker-compose ps` 确保服务健康

---

## 参考链接

- [Docker 官方文档](https://docs.docker.com/)
- [docker-compose 官方文档](https://docs.docker.com/compose/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

---

如有问题，请查看 GitHub Issues 或提交新的 Issue。
