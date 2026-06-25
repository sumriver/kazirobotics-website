# KaziSpace Web App (Static)

KaziSpace H5 前端静态构建产物，API 指向 `https://bot.kazispace.ai`。

## 本地预览

```bash
cd ~/Projects/kazirobotics-website
python3 -m http.server 8080
```

浏览器打开 `http://localhost:8080`。

## 部署方式

### 1. GitHub Pages（推荐）

推送到 `main` 分支后，GitHub Actions 会自动部署。

首次启用：

1. 仓库 **Settings → Pages**
2. **Build and deployment → Source** 选择 **GitHub Actions**
3. 若使用自定义域名，在 Pages 设置中填写域名，并在 DNS 添加 CNAME

> 注意：构建产物使用根路径资源（`/static/...`），请使用**自定义域名**或独立站点根路径部署。`sumriver.github.io/kazirobotics-website/` 这类子路径会导致静态资源 404。

### 2. Nginx（ECS / 自有服务器）

```bash
sudo mkdir -p /var/www/kazirobotics-website
sudo rsync -av --delete \
  --exclude .git --exclude .github --exclude deploy --exclude README.md \
  ~/Projects/kazirobotics-website/ /var/www/kazirobotics-website/

sudo cp deploy/nginx.conf /etc/nginx/conf.d/kazirobotics-website.conf
# 按实际域名修改 server_name，并配置 SSL
sudo nginx -t && sudo systemctl reload nginx
```

## 更新站点

用新的 `webapp.zip` 覆盖静态文件后提交并推送：

```bash
unzip -o ~/Projects/webapp.zip -d ~/Projects/kazirobotics-website
cp index.html 404.html
git add -A && git commit -m "deploy: update web app build" && git push
```
