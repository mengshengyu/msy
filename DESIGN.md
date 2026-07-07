# DESIGN.md — 孟圣育作品集设计规范

> 给后续接手的 AI 助手(Codex/Claude/其他)阅读。**先读这份,再动代码。**

---

## 0. 项目一句话

**React 19 + Vite 7** 单页影集式作品集,**5 页无垂直滚动**,用翻页/键盘/滚轮/导航切换页面;玻璃质感 + 深色科技 + 极简排版,服务于 3D Model & Material Artist 的求职作品展示。

---

## 1. 技术栈与文件结构

```
portfolio-site/
├── index.html                       # 入口,挂载 #root
├── package.json                     # react 19, react-dom 19, vite 7, lucide-react, sharp
├── public/
│   ├── home-bg.jpg                  # 全局备用背景
│   └── assets/
│       ├── cover/                   # 5 张 hero 图(每页一张)
│       │   ├── mountain.webp        # cover
│       │   ├── temple.webp          # profile
│       │   ├── harbor.webp          # skills/practice
│       │   ├── island.webp          # works
│       │   └── beach-sunset.webp    # contact
│       ├── experience/              # Profile 页 5 张游戏图(jpg)
│       │   ├── zhuxian.jpg          # 诛仙世界
│       │   ├── magumum-quest.jpg    # Magnum Quest
│       │   ├── dark-nemesis.jpg
│       │   ├── quanmin-wuji.jpg
│       │   └── dmc5.jpg
│       ├── gallery/                 # 74 张作品图,按 category/prefix-NN.webp 命名
│       └── works/                   # Works 页 5 张 slat cover + 9 张工具预览(已废弃,留作兼容)
└── src/
    ├── main.jsx                     # 全部逻辑(单文件,~700 行)
    └── styles.css                   # 全部样式(单文件,~2000 行)
```

**关键事实**:
- **单文件 React 应用**。没有路由、没有组件目录、没有 state library。所有逻辑、组件定义、样式都在 `main.jsx` 和 `styles.css`。
- `package.json` 唯一依赖是 React + Vite + lucide-react(图标)。**没有 Tailwind、没有 styled-components、没有 CSS Modules**。
- 资源路径以 `/assets/...` 开头(Vite public 目录)。

---

## 2. 5 页与导航

```
pages = [
  cover    → Home    (首页,hero 大字)
  profile  → Profile (5 张游戏图 slat)
  skills   → Practice (能力面板)
  works    → Works    (5 张作品分类 slat)
  contact  → Contact  (联系信息)
]
```

**重要:Profile 和 Works 是两个完全独立页面,内容互不相关** —— Profile 显示 5 段工作经历(配游戏图),Works 显示 5 个作品分类文件夹(配 cover 图)。**两个 slat 的 01–05 编号分别独立,不要混淆**。

### 翻页机制

- **滚轮**:`wheelLock = 760ms` 节流,deltaY > 0 → next,deltaY < 0 → prev
- **键盘**:`ArrowDown/PageDown/Space` → next;`ArrowUp/PageUp` → prev;`Home/End` → 跳到首末
- **导航栏(PillNav)**:顶部固定胶囊,5 个 tab,点击切换
- **底部 hero-meta**:左侧 PROFILE / 中间 `02/05` / 右侧 © 版权(固定 bottom)
- **Works Gallery 子页**:Works 页面点击分类后进入 GalleryDetail,导航栏隐藏(opacity 0)
- **Profile Slat 展开**:点击任意游戏图后全屏展示该游戏图(其他 4 张堆到右侧 80px 宽度条带)

### State 清单

```js
const [pageIndex, setPageIndex] = useState(0);              // 当前页
const [activeCategoryKey, setActiveCategoryKey] = useState(null);  // Works 子分类
const [lightboxIndex, setLightboxIndex] = useState(null);   // 作品大图
const [expExpandedIndex, setExpExpandedIndex] = useState(null);  // Profile slat 展开
```

**所有 state 切换都要清理其他 state**:`goTo()` 同时清 `activeCategoryKey` 和 `expExpandedIndex`,确保从 Works Gallery 或 Profile 展开态切页时是干净的。

---

## 3. 视觉 Token

### 3.1 配色

| Token              | Hex                       | 用途                              |
| ------------------ | ------------------------- | --------------------------------- |
| `--ink`            | `rgb(245, 241, 232)`      | 主文字色(浅米白)                |
| `--ink-soft`       | 透明 0.7-0.85             | 次要文字                          |
| `--ink-strong`     | `rgb(20, 20, 24)`        | 浅底页面的文字(cover/hero)       |
| `--bg-base`        | `#0a0a0c`                | 主背景(深近黑)                  |
| `--bg-deep`        | `#000`                   | Profile 展开态 / lightbox 背景  |
| `--accent-warm`    | `#c8a572` / 金棕          | 极少使用,留给节庆/CTA            |

**核心策略**:绝大部分页面用**深底浅字**(`#0a0a0c` + `#f5f1e8`)。**Cover 页和 hero 大字区域是反转的浅底深字**(玻璃面板透明覆盖在背景图上,文字是 `rgba(20,20,24,0.95)`)。

### 3.2 玻璃面板 Token

```css
--glass-light-bg: rgba(245, 241, 232, 0.06);
--glass-light-blur: blur(18px) saturate(140%);
--glass-dark-bg: rgba(8, 8, 10, 0.55);
--glass-dark-blur: blur(18px) saturate(140%);
```

两块面板:**浅色玻璃**(浅底场景)和**深色玻璃**(深底场景,如 Profile 展开、Lightbox)。`backdrop-filter` 必须同时写 `-webkit-backdrop-filter`。

### 3.3 字体

```css
--font-display: 'Cormorant Garamond', serif;       /* hero 大字、章节标题 */
--font-body: 'Inter', system-ui, sans-serif;       /* 正文、UI */
--font-mono: 'JetBrains Mono', monospace;          /* 编号、meta、按钮 */
--font-num: 'Cormorant Garamond', serif;            /* 大数字(02/05 等)*/
```

- **大标题**:Cormorant Garamond,优雅、电影感
- **UI/正文**:Inter,清晰中性
- **编号/meta/mono**:JetBrains Mono,等宽,技术感
- **数字大字**:Cormorant Garamond,但走 `<span class="num">` 走等宽变体

### 3.4 间距

```css
--space-6: 18px;
--radius-pill: 9999px;   /* 胶囊 */
--ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);   /* 标准缓动 */
```

间距系统使用 8/12/18/24/32/48/72 像素阶梯,优先用 `clamp()` 做响应式字号。

---

## 4. 组件速览(都是 main.jsx 里的函数)

| 函数                | 位置         | 作用                                                          |
| ------------------- | ------------ | ------------------------------------------------------------- |
| `Num`               | ~L176        | 等宽数字包装 `<span class="num">`                              |
| `App`               | L180+        | 主组件,渲染背景层、PillNav、5 页 hero、Lightbox              |
| `PillNav`           | L474         | 顶部胶囊导航                                                   |
| `HeroActions`       | L494         | 页内 CTA / tag                                                 |
| `SkillsBlock`       | L507         | Practice 页 4 个能力面板                                       |
| `GalleryDetail`     | L530+        | Works 子分类:网格缩略图 + 单图 lightbox                       |
| `Lightbox`          | ~L600        | 全屏单图,左右切换,ESC 关闭                                   |
| `SlatsFrame` (内联) | L376-440     | Profile 5 张 slat + 展开/恢复逻辑                             |

---

## 5. 关键交互细节(踩过的坑)

### 5.1 Profile slat 展开/恢复

**点击游戏图** → 整页黑底 + 当前图全屏(`object-fit: contain` 留黑边) + 其他 4 张缩成 80px 宽堆在右侧 + 导航栏变深底玻璃 + 左下角 "× 点击恢复" 关闭按钮。

**恢复方式**(以下任意一种):
1. 点击 "× 点击恢复" 关闭按钮
2. 点击当前 active slat 自身(整张图都是点击区)
3. 按 `Esc` 键
4. 点击导航栏任意 tab(会自动 `goTo()` 清理 `expExpandedIndex`)

**关键约束**:
- **`<button>` 不能嵌套 `<button>`** —— React 19 + Hydration 会报错,导致所有 onClick 失效。关闭按钮用的是 `<span role="button" tabIndex={0}>` 模拟按钮 + `onClick` + `onKeyDown(Enter/Space)`。
- 关闭按钮点击时 **`e.stopPropagation()`**,否则冒泡到外层 slat 会再次触发 toggle。
- 展开态用 `.exp-slats.is-open` 加容器类,**所有 is-shrunk 用 `data-shrunk-pos={i}` 标记位置**(0-4 分别定位到右侧 80px 条带的不同区段)。

### 5.2 Works Gallery 渲染互斥

```jsx
{activeCategory && current.type === "works" ? (
  <GalleryDetail ... />
) : (
  <div className="hero-stage" id="main-content">
    {/* 5 个 hero section */}
  </div>
)}
```

**不能简化为 `activeCategory ? <GalleryDetail>`** —— 否则从 Works Gallery 切到 Profile 页时,`activeCategoryKey` 没清,GalleryDetail 会继续渲染,但此时点击 01 进了 Works Gallery 而不是 Profile 的 slat。

### 5.3 导航栏可见性

```css
.pill-nav { position: fixed; z-index: 80; }
/* Works Gallery 时隐藏 */
.album-shell:has(.gallery-detail) .pill-nav { opacity: 0; pointer-events: none; }
/* Profile 展开时,切深底玻璃 + 浅色文字 */
.album-shell:has(.exp-slats.is-open) .pill-nav {
  background: rgba(8, 8, 10, 0.55);
  border-color: rgba(245, 241, 232, 0.14);
}
.album-shell:has(.exp-slats.is-open) .pill-tabs button { color: rgba(245, 241, 232, 0.7); }
```

`:has()` 选择器是核心 —— 没有 JS 条件渲染,纯 CSS 根据容器内子元素切换 nav 样式。**PillNav 始终渲染,不要加 `if (activeCategory) return null`**。

### 5.4 底部 hero-meta 也是 fixed

```css
.hero-meta { position: fixed; left: 56px; right: 56px; bottom: 24px; z-index: 80; }
```

但 `activeCategory` 时不渲染 Works Gallery 用。

### 5.5 全屏大图

- Profile 展开:`.exp-slats.is-open .exp-slat.is-active .exp-slat-cover { object-fit: contain; }`
- Works Lightbox:`<img>` 直接放在 fixed inset:0 容器里,`object-fit: contain` + `background: #000`

**永远用 `object-fit: contain`** 而不是 `cover` —— 用户希望看到完整游戏图,不能裁剪。

### 5.6 玻璃感的边框与阴影

浅色玻璃:`inset 0 2px 6px rgba(0,0,0,0.18)` 内阴影 + 背景 `rgba(20,20,24,0.14)`
深色玻璃:`inset 0 2px 6px rgba(0,0,0,0.35)` 内阴影 + 背景 `rgba(245,241,232,0.14)`

**颜色取反**:浅底用深色阴影 + 深色激活背景;深底用浅色阴影 + 浅色激活背景。

---

## 6. 资源约定

- **背景图**:每页一张,放在 `/assets/cover/`。命名 = `pages` 数组的 `type` 字段 + `.webp`。
- **Profile 游戏图**:`/assets/experience/`,5 张 jpg,直接用文件名引用。
- **作品图**:`/assets/gallery/`,按 `category.prefix-NN.webp` 命名(NN 从 01 起)。`category.count` 决定该分类有几张。
- **Cover 图**(Works slat 封面):从 gallery 挑一张最具代表性的,如 `model-15.webp`。

**修改 `categories[]` 或 `experience[]` 时,图片文件名必须能对得上**,否则 Vite 编译会失败(Vite 不报错但运行时 `img onerror`)。

---

## 7. 已知坑与不做的事

1. ❌ **不要做斜切(clip-path)排版** —— 之前用户多次否决,最后定为简单矩形板子
2. ❌ **不要嵌套 `<button>`** —— 整个站所有 onClick 会失效
3. ❌ **不要做上下垂直滚动** —— 用户体验是影集翻页
4. ❌ **不要让 PillNav 在 Works Gallery 之外消失** —— 必须 fixed + visible
5. ❌ **不要把 profile 的 experience 跟 works 的 categories 联动** —— 两条独立的 01–05
6. ❌ **不要在背景层加 `position: fixed` 后用 `100vh`** —— 用 `inset: 0` 避免移动端地址栏抖动
7. ❌ **不要加 emoji 图标** —— 用 lucide-react
8. ❌ **不要把 close 按钮放在外层 button 内** —— 必须用 `role="button"` 的 span
9. ❌ **不要把 `pointer-events: none` 加在 is-shrunk slat 上** —— 用户需要点击 shrunk slat 切换到那张
10. ❌ **不要把全局背景设成纯色** —— 每页有自己的 cover 图作为 bg-layer

---

## 8. 给接手 AI 的工作流建议

### 第一步:理解
1. 读 `src/main.jsx` 全文(700 行)
2. 读 `src/styles.css` 全文(2000 行)
3. 用 `npm run dev` 启动,浏览器打开 `http://127.0.0.1:5174/`,**逐页点一遍**

### 第二步:小改动流程
1. 修改前先确认要改哪个组件/页面
2. 改 JSX 和 CSS,**保持单文件结构**(不要拆文件除非用户要求)
3. HMR 应该立即生效,**在浏览器里验证**:
   - 桌面 1280×800 宽度下确认
   - 移动 375×812 宽度下确认(用 DevTools responsive 模式)
   - 验证 hover / click / keyboard 三种交互
4. 检查 console 是否报错(React hydration 警告尤其重要)

### 第三步:大改动流程
1. **先在对话里说方案,确认后再动代码**
2. 改样式时,优先用现有 token(`--ink`, `--glass-dark-bg`, `--ease-smooth` 等)
3. 新增组件放 `main.jsx` 顶部,不要拆文件
4. 涉及动画的改动,保留 `cubic-bezier(0.22, 1, 0.36, 1)` 标准缓动

### 第四步:验证清单
- [ ] 5 页都能切换(键盘、滚轮、导航栏)
- [ ] Profile 页:点击游戏图展开 → 其他 4 张挤到右侧 → 点击 "× 点击恢复" 恢复
- [ ] Works 页:点击分类 → 进入 GalleryDetail → 点击缩略图 → 全屏 lightbox → 左右切换 → ESC 关闭
- [ ] 从任意 Gallery 状态按导航栏都能干净切页
- [ ] 没有任何 React 报错或 hydration 警告
- [ ] 移动端布局可用(不必完美,但不能炸)

---

## 9. 调色板速查(给 AI 用)

```css
/* 深底场景 */
background: #0a0a0c;          /* 主背景 */
background: #000;              /* 全屏图背景 */
color: #f5f1e8;                /* 浅色文字 */
background: rgba(8, 8, 10, 0.55);   /* 深色玻璃 */
border: rgba(245, 241, 232, 0.14);  /* 深色玻璃边框 */

/* 浅底场景 */
color: rgba(20, 20, 24, 0.95);       /* 深色文字 */
background: rgba(245, 241, 232, 0.06);  /* 浅色玻璃 */
border: rgba(20, 20, 24, 0.1);      /* 浅色玻璃边框 */
box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.18);   /* 浅底内阴影 */
```

---

## 10. 一句话总结

**深色科技 + 玻璃质感 + 翻页影集**,Profile 和 Works 各自独立,导航栏常驻 fixed,展开态用 `:has()` 切换样式,所有 click 都要考虑 stopPropagation 和 button 嵌套陷阱。