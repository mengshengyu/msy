# 孟圣育个人作品网站

React + Vite 单页作品集，用于展示 3D 模型、程序化材质、扫描资产、履历和流程自动化能力。

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## GitHub Pages 托管

项目已准备好通过 GitHub Actions 自动部署：

1. 新建 GitHub 仓库，并把本项目推到 `main` 分支。
2. 进入仓库 `Settings -> Pages`。
3. `Build and deployment` 选择 `GitHub Actions`。
4. 推送后会自动执行 `.github/workflows/deploy.yml`，发布 `dist`。

当前 Vite `base` 默认为 `./`，适配 `https://用户名.github.io/仓库名/` 这种 GitHub Pages 子路径。

## 注意

- `node_modules` 和 `dist` 不提交。
- `public/assets` 体积较大，当前单文件未超过 GitHub 100MB 限制。
- 液态玻璃模式会从 CDN 加载 `@ybouane/liquidglass`，外网访问需要网络可用。
