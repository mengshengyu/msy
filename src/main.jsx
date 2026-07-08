import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUp,
  BriefcaseBusiness,
  Cpu,
  Grid2X2,
  Layers3,
  Mail,
  MapPin,
  Menu,
  Phone,
  UserRound,
  Volume2,
  VolumeX,
  X
} from "lucide-react";
import "./styles.css";
import "./styles/mobile.css";
import "./styles/glass.css";
import "./liquidglass-runtime.js";

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
const workPath = asset("assets/originals/");
const smallPath = asset("assets/smallpic/");

function toSmallPic(src) {
  const file = src.split("/").pop()?.replace(/\.(png|jpe?g)$/i, ".webp");
  return file ? `${smallPath}${file}` : src;
}


const stats = [
  { value: "9+", label: { zh: "年经验", en: "Years" } },
  { value: "74", label: { zh: "件作品", en: "Exhibits" } },
  { value: "5", label: { zh: "个类别", en: "Categories" } },
  { value: "7", label: { zh: "项工具", en: "Tools" } }
];

const i18n = {
  zh: {
    skip: "跳到主要内容",
    langAria: "Switch to English",
    navAria: "主导航",
    openNav: "打开导航",
    closeNav: "关闭导航",
    openCategory: "打开",
    view: "查看",
    preview: "高清预览",
    bigPreview: "大图预览",
    closeImage: "关闭大图",
    thumbnails: "作品缩略图",
    backFolders: "Back to folders",
    clickExpand: "点击展开",
    side: {
      cover: "一座关于游戏世界、程序化材质、3D 资产与生产流程的数字展馆。这里收藏的是被制作过的世界。",
      contact: "Open for SD materials, scene assets, material libraries, QC and pipeline tooling."
    },
    categorySummary: {},
    skills: [],
    experience: [],
    pages: {
      cover: { navLabel: "首页" },
      profile: { navLabel: "履历" },
      works: { navLabel: "作品" },
      contact: { navLabel: "联系" }
    },
    contactLocation: "北京 / BEIJING",
    contactRole: "孟圣育 / 3D Model Artist / Material Artist",
    contactThanks: "感谢造访"
  },
  en: {
    skip: "Skip to content",
    langAria: "切换到中文",
    navAria: "Main navigation",
    openNav: "Open navigation",
    closeNav: "Close navigation",
    openCategory: "Open",
    view: "View",
    preview: "HD preview",
    bigPreview: "Large image preview",
    closeImage: "Close image",
    thumbnails: "Work thumbnails",
    backFolders: "Back to folders",
    clickExpand: "Click to expand",
    side: {
      cover: "A digital gallery of game worlds, procedural materials, 3D assets and production systems.",
      contact: "Open for SD materials, scene assets, material libraries, QC and pipeline tooling."
    },
    categorySummary: {
      model: "Scene models, architecture, props, map editing and production-ready assets.",
      stylized: "Stylized Substance Designer node materials and reusable texture systems.",
      realistic: "Realistic procedural materials, UE material presentation and in-engine captures.",
      procedural: "Batch processing and automation tools for SD, UE, Maya and Photoshop.",
      scan: "Photogrammetry and scanned real-surface asset presentation."
    },
    skills: [
      { title: "3D Model & Scene Assets", text: "High-quality scene models, architecture, props, asset organization, map editing, lighting bake and optimization." },
      { title: "Procedural Materials", text: "Substance Designer node materials, UE material graphs, basic Houdini simulation, material library planning and engine-side polish." },
      { title: "Outsource QC", text: "Outsource guidelines, quality review, feedback tracking and cross-team communication." },
      { title: "Pipeline Automation", text: "Custom automation tools, batch processing tools and software plugins for workflow optimization." }
    ],
    experience: [
      { company: "Perfect World", role: "Material planning\nSD procedural textures\nMaterial library management", desc: "A self-developed xianxia MMORPG based on the Zhuxian universe, focused on open-world exploration, sword flight, co-op dungeons and oriental fantasy environments." },
      { company: "Tuyoo Games", role: "Model and scene production\nMap editing", desc: "A western-fantasy idle card RPG built around hero collection, team composition, dungeon progression and automated tactical combat." },
      { company: "Qingguo Interactive", role: "Outsource specs\nReview feedback\nScene models", desc: "A dark-fantasy action MMORPG set on a demon-invaded continent, emphasizing character growth, gear progression, dungeons, co-op play and real-time combat." },
      { company: "NiuKa Interactive", role: "Scene and commercial assets", desc: "An anime idol rhythm and dance mobile game with character collection, costume styling, stage performance and bright show-light presentation." },
      { company: "Huiqin Technology", role: "Scene and commercial assets", desc: "Devil May Cry 5 is a Capcom action title featuring Nero, Dante and V with distinct combat styles, high-speed action and stylish combo scoring." }
    ],
    pages: {
      cover: { navLabel: "Home", lede: "A digital material museum built from 9 years of game art production. Procedural materials, UE graphs, 3D assets, Houdini basics, AI-assisted workflow and Perfect World's annual Art Benchmark Award are archived as 74 exhibits." },
      profile: { navLabel: "Profile" },
      works: { navLabel: "Works", lede: "Archived by project type and production workflow. Open a folder to browse works, then click thumbnails or the main image for full-screen viewing." },
      contact: { navLabel: "Contact", lede: "Available for SD materials, 3D scene assets, material library management, outsource QC and art pipeline automation." }
    },
    contactLocation: "Beijing / Shanghai",
    contactRole: "Meng Shengyu / 3D Model Artist / Material Artist",
    contactThanks: "Thanks for visiting"
  }
};

const categories = [
  {
    key: "model",
    name: "3D Model",
    cn: "3D模型",
    prefix: "model",
    count: 20,
    files: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "12", "13", "14", "19", "26", "65", "70", "75", "76", "87", "88"],
    summary: "场景模型、建筑、道具、地图编辑与项目资产制作。",
    cover: asset("assets/originals/model-6.jpg")
  },
  {
    key: "stylized",
    name: "Stylized Material",
    cn: "风格化材质",
    prefix: "material-stylized",
    count: 8,
    files: ["1", "2", "3", "4", "5", "6", "7", "8"],
    summary: "Substance Designer 风格化节点材质与可复用纹理方案。",
    cover: asset("assets/originals/material-stylized-8.jpg")
  },
  {
    key: "realistic",
    name: "Realistic Material",
    cn: "写实材质",
    prefix: "material-realistic",
    count: 28,
    files: [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "12", "13", "15", "17", "18", "19", "20", "21", "22", "23", "27", "28",
      { id: "31", ext: "png" }, { id: "32", ext: "png" }, { id: "33", ext: "png" }, { id: "34", ext: "png" }, { id: "35", ext: "png" }, { id: "36", ext: "png" }
    ],
    summary: "写实程序化材质、UE 材质表现与引擎内截图。",
    cover: asset("assets/originals/material-realistic-27.jpg")
  },
  {
    key: "procedural",
    name: "Procedural Tools",
    cn: "程序化与自动化",
    prefix: "procedural",
    count: 7,
    summary: "SD、UE、Maya、PS 相关批处理与自动化工具。",
    cover: asset("assets/originals/procedural-03.jpg")
  },
  {
    key: "scan",
    name: "Reality Scan",
    cn: "扫描资产",
    prefix: "scan",
    count: 12,
    files: ["1", "2", "4", "5", "6", "7", "8", "9", "10", "11", "12", "14"],
    summary: "摄影测量与真实表面资产展示。",
    cover: asset("assets/originals/scan-14.jpg")
  }
];

const skills = [
  {
    icon: Layers3,
    title: "模型与场景资产",
    text: "高质量场景模型、建筑、道具、资源整理、地图编辑、打光烘焙与性能优化。"
  },
  {
    icon: Grid2X2,
    title: "程序化材质",
    text: "Substance Designer 节点材质、UE 材质图表、基础 Houdini 解算、材质库规划与引擎效果优化。"
  },
  {
    icon: BriefcaseBusiness,
    title: "外包质量控制",
    text: "外包规范制定、质量审查、反馈整理，以及上下游团队协同沟通。"
  },
  {
    icon: Cpu,
    title: "流程自动化",
    text: "制作自动工具、批处理工具、软件插件，优化工作流程。"
  }
];

const experience = [
  {
    year: "2023 — 2026",
    company: "完美世界",
    game: "诛仙世界",
    role: "材质规划\nSD 程序化纹理\n材质库管理",
    image: asset("assets/experience/zhuxian.jpg"),
    desc: "完美世界自研国风仙侠 MMORPG，以《诛仙》小说世界观为基础，围绕青云、鬼王等门派与仙魔纷争展开，主打开放大世界探索、御剑飞行、多人副本与东方幻想场景。",
  },
  {
    year: "2022 — 2023",
    company: "途游游戏",
    game: "Magnum Quest",
    role: "模型与场景制作\n地图编辑",
    image: asset("assets/experience/magumum-quest.jpg"),
    desc: "途游发行的西幻放置卡牌 RPG。玩家收集不同阵营英雄，组建队伍推进关卡与地下城，在暗黑奇幻大陆中体验养成、策略站位和自动战斗。",
  },
  {
    year: "2019 — 2022",
    company: "青果灵动",
    game: "Dark Nemesis",
    role: "外包规范\n审核反馈\n场景模型",
    image: asset("assets/experience/dark-nemesis.jpg"),
    desc: "暗黑幻想风格动作 MMORPG，以恶魔入侵后的魔幻大陆为舞台，强调职业成长、装备养成、副本挑战、多人协作和高强度实时战斗。",
  },
  {
    year: "2018 — 2019",
    company: "牛卡互娱",
    game: "全民舞姬",
    role: "场景与商业资产",
    image: asset("assets/experience/quanmin-wuji.jpg"),
    desc: "二次元偶像养成与音乐舞蹈手游，围绕角色收集、服装搭配、舞台演出和节奏玩法展开，以卡通化角色与舞台灯光表现营造偶像演出氛围。",
  },
  {
    year: "2017 — 2018",
    company: "汇秦科技",
    game: "Devil May Cry 5",
    role: "场景与商业资产",
    image: asset("assets/experience/dmc5.jpg"),
    desc: "Capcom 经典动作游戏《鬼泣》系列正统第五作，采用 RE Engine 开发。尼禄、但丁、V 三位可操作角色拥有不同战斗风格，核心体验是高速动作、恶魔狩猎与华丽连招评分。"
  }
];

function makeItems(category) {
  const files = category.files ?? Array.from({ length: category.count }, (_, index) => String(index + 1).padStart(2, "0"));

  return files.map((entry) => {
    const file = typeof entry === "string" ? { id: entry, ext: "jpg" } : entry;
    const src = `${workPath}${category.prefix}-${file.id}.${file.ext ?? "jpg"}`;

    return {
      id: `${category.key}-${file.id}`,
      title: `${category.cn} ${file.id}`,
      src,
      thumb: toSmallPic(src)
    };
  });
}

const galleryItems = categories.flatMap(makeItems).map((item, index) => ({ ...item, index }));

function Num({ children }) {
  return <span className="num">{children}</span>;
}

function ExhibitRow({ items, isActive, onItemClick, onImageLoad, getItemStyle, t }) {
  return (
    <div className="exp-slats">
      {items.map((item, i) => (
        <button
          key={item.key}
          type="button"
          className="exp-slat"
          onClick={(e) => onItemClick(item, i, e)}
          aria-label={item.ariaLabel}
          style={{ "--slat-i": i, ...(getItemStyle?.(item, i) ?? {}) }}
        >
          <span className="exp-slat-year">{item.eyebrow}</span>
          <span className="exp-slat-image-frame" aria-hidden="true">
            <img
              className="exp-slat-cover"
              src={toSmallPic(item.image)}
              alt=""
              loading="eager"
              decoding="async"
              onLoad={onImageLoad ? (e) => onImageLoad(item, i, e.currentTarget) : undefined}
            />
          </span>
          <span className="exp-slat-shade" aria-hidden="true" />
          <span className="exp-slat-body">
            <span className="exp-slat-num"><Num>{String(i + 1).padStart(2, "0")}</Num></span>
            <span className="exp-slat-text">
              <strong className="exp-slat-company">{item.company}</strong>
              <strong className="exp-slat-game">{item.title}</strong>
              <span className="exp-slat-role">{item.role}</span>
              {item.desc && <span className="exp-slat-desc-inline">{item.desc}</span>}
            </span>
            {item.showHint && (
              <span className="exp-slat-hint" aria-hidden="true">
                <span className="exp-slat-hint-text">{t.clickExpand}</span>
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
const welcomeBasePlaybackRate = 3.2;
const welcomeMinPlaybackRate = 1.15;
const welcomeSlowStartProgress = 0.84;
const welcomeZoomStartProgress = 0.78;
const welcomePreZoomAmount = 0.02;

const getWelcomePlaybackRate = (progress) => {
  const amount = Math.max(0, Math.min(1, (progress - welcomeSlowStartProgress) / (1 - welcomeSlowStartProgress)));
  const eased = amount * amount * (3 - 2 * amount);
  return welcomeBasePlaybackRate - (welcomeBasePlaybackRate - welcomeMinPlaybackRate) * eased;
};

const getWelcomeFrameScale = (progress) => {
  const amount = Math.max(0, Math.min(1, (progress - welcomeZoomStartProgress) / (1 - welcomeZoomStartProgress)));
  return 1 + welcomePreZoomAmount * amount * amount;
};

const getWelcomeFrameVelocity = (progress, playbackRate, freezeTime) => {
  const amount = Math.max(0, Math.min(1, (progress - welcomeZoomStartProgress) / (1 - welcomeZoomStartProgress)));
  const scalePerProgress = (2 * welcomePreZoomAmount * amount) / (1 - welcomeZoomStartProgress);
  return freezeTime > 0 ? scalePerProgress * playbackRate / freezeTime : 0;
};

const pages = [
  { type: "cover", navLabel: "Home", title: "Digital Material Museum", lede: "一座关于游戏世界、材质、模型与流程的数字展馆。9 年游戏美术生产经验、完美世界「年度美术标杆奖」、基础 Houdini 解算与 AI 自动化流程，都被整理为 74 件馆藏。", meta: "GAME ART ARCHIVE / 2017 — 2026" },
  { type: "profile", navLabel: "Profile", title: "Profile", lede: "", meta: "" },
  { type: "works", navLabel: "Works", title: "Works", lede: "按项目类型与制作流程归档。点击任一文件夹进入对应作品，单击缩略图或大图可放大到全屏浏览。", meta: "" },
  { type: "contact", navLabel: "Contact", title: "Contact", lede: "可承担 SD 材质、3D 场景资产、材质库管理、外包质量控制，以及美术流程自动化工具相关工作。", meta: "" }
];

function App() {
  const [entered, setEntered] = useState(false);
  const [entering, setEntering] = useState(false);
  const [welcomePlaying, setWelcomePlaying] = useState(false);
  const [homeRevealed, setHomeRevealed] = useState(false);
  const [siteReady, setSiteReady] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [activeCategoryKey, setActiveCategoryKey] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [profileActiveIndex, setProfileActiveIndex] = useState(null);
  const [profileFlyFrom, setProfileFlyFrom] = useState(null);
  const [profilePreviewClosing, setProfilePreviewClosing] = useState(false);
  const [profileGlowRgb, setProfileGlowRgb] = useState(null);
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [glassMode, setGlassMode] = useState(() => {
    try {
      return window.localStorage.getItem("msy-glass-mode") === "liquid" ? "liquid" : "frosted";
    } catch {
      return "frosted";
    }
  });
  const [glassSettled, setGlassSettled] = useState(false);
  const profilePreviewTimerRef = useRef(null);
  const welcomeVideoRef = useRef(null);
  const bgmRef = useRef(null);
  const bgmFadeRef = useRef(null);
  const museumBackdropRef = useRef(null);
  const welcomeProgressRef = useRef(0);
  const welcomeRafRef = useRef(null);
  const museumZoomRafRef = useRef(null);
  const museumZoomStartedRef = useRef(false);
  const museumZoomScaleRef = useRef(1);
  const homeRevealedRef = useRef(false);
  const [navOpen, setNavOpen] = useState(false);
  const [lang, setLang] = useState("zh");
  const shellRef = useRef(null);
  const t = i18n[lang];
  const pageViews = pages.map((page) => ({ ...page, ...(t.pages[page.type] ?? {}) }));
  const localizedCategories = categories.map((category) => ({
    ...category,
    label: lang === "zh" ? category.cn : category.name,
    summaryText: t.categorySummary[category.key] ?? category.summary
  }));
  const localizedExperience = experience.map((entry, index) => {
    const item = t.experience[index] ?? {};
    return {
      ...entry,
      companyText: item.company ?? entry.company,
      roleText: item.role ?? entry.role,
      descText: item.desc ?? entry.desc
    };
  });
  const localizedGalleryItems = galleryItems.map((item) => {
    const category = categories.find((value) => item.id.startsWith(value.key));
    const number = item.id.slice((category?.key.length ?? 0) + 1);
    return {
      ...item,
      title: lang === "zh" ? item.title : `${category?.name ?? item.title} ${number}`
    };
  });
  const worksExhibits = localizedCategories.map((category) => ({
    key: category.key,
    eyebrow: <span className="works-pill-label">{`${category.count} works`}</span>,
    image: category.cover,
    company: category.name,
    title: category.label,
    role: category.summaryText,
    ariaLabel: `${t.openCategory} ${category.label}`,
    source: category
  }));
  const profileExhibits = localizedExperience.map((entry) => ({
    key: `${entry.year}-${entry.company}`,
    eyebrow: entry.year,
    image: entry.image,
    company: entry.companyText,
    title: entry.game,
    role: entry.roleText,
    desc: entry.descText,
    showHint: true,
    ariaLabel: `${t.view} ${entry.companyText} ${entry.year}`,
    source: entry
  }));
  const safePageIndex = Math.max(0, Math.min(pageViews.length - 1, pageIndex));
  const current = pageViews[safePageIndex];
  const welcomeFreezeOffset = 0.22;


  const closeProfilePreview = () => {
    if (profileActiveIndex === null || profilePreviewClosing) return;
    setProfilePreviewClosing(true);
    if (profilePreviewTimerRef.current) window.clearTimeout(profilePreviewTimerRef.current);
    profilePreviewTimerRef.current = window.setTimeout(() => {
      setProfileActiveIndex(null);
      setProfileFlyFrom(null);
      setProfileGlowRgb(null);
      setProfilePreviewClosing(false);
    }, 560);
  };

  const getImageGlowRgb = (img) => {
    try {
      const canvas = document.createElement("canvas");
      const size = 48;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0, size, size);
      const pixels = ctx.getImageData(0, 0, size, size).data;
      let r = 0;
      let g = 0;
      let b = 0;
      let weight = 0;
      for (let y = 8; y < 40; y += 2) {
        for (let x = 8; x < 40; x += 2) {
          const i = (y * size + x) * 4;
          const pr = pixels[i];
          const pg = pixels[i + 1];
          const pb = pixels[i + 2];
          const max = Math.max(pr, pg, pb);
          const min = Math.min(pr, pg, pb);
          const saturation = max - min;
          const brightness = (pr + pg + pb) / 3;
          const w = Math.max(0.35, saturation / 92) * Math.max(0.35, Math.min(1.4, brightness / 122));
          r += pr * w;
          g += pg * w;
          b += pb * w;
          weight += w;
        }
      }
      if (!weight) return null;
      return `${Math.round(r / weight)}, ${Math.round(g / weight)}, ${Math.round(b / weight)}`;
    } catch {
      return null;
    }
  };

  const readImageGlow = (img) => {
    setProfileGlowRgb(getImageGlowRgb(img));
  };


  const openProfilePreview = (index, sourceEl) => {
    const r = sourceEl.querySelector(".exp-slat-image-frame")?.getBoundingClientRect() ?? sourceEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isPhone = vw <= 760;
    const isTablet = vw > 760 && vw <= 1180;
    const margin = isPhone ? 14 : isTablet ? 24 : 36;
    const caption = isPhone ? 132 : 118;
    const maxW = Math.min(vw - margin * 2, isPhone ? 720 : isTablet ? vw * 0.88 : 1180);
    const maxImageH = Math.min(vh - margin * 2 - caption, isPhone ? vh * 0.72 : vh * 0.76);
    const ratio = Math.max(0.6, Math.min(2.2, r.width / Math.max(1, r.height)));
    let finalW = Math.min(maxW, maxImageH * ratio);
    let finalH = finalW / ratio + caption;
    if (finalH > vh - margin * 2) {
      finalH = vh - margin * 2;
      finalW = Math.min(maxW, (finalH - caption) * ratio);
    }
    const fromCx = r.left + r.width / 2;
    const fromCy = r.top + r.height / 2;
    const finalCx = Math.min(vw - margin - finalW / 2, Math.max(margin + finalW / 2, fromCx));
    const finalCy = Math.min(vh - margin - finalH / 2, Math.max(margin + finalH / 2, fromCy));

    setProfileFlyFrom({
      dx: fromCx - finalCx,
      dy: fromCy - finalCy,
      sx: r.width / finalW,
      sy: r.height / finalH,
      finalX: finalCx,
      finalY: finalCy,
      finalW,
      finalH
    });
    setProfileGlowRgb(null);
    setProfilePreviewClosing(false);
    setProfileActiveIndex(index);
  };

  const goTo = (index) => {
    setActiveCategoryKey(null);
    setNavOpen(false);
    const nextIndex = Math.max(0, Math.min(pages.length - 1, index));
    setPageIndex(nextIndex);
  };

  const next = () => goTo(safePageIndex + 1);
  const prev = () => goTo(safePageIndex - 1);

  const openCategory = (key) => {
    setActiveCategoryKey(key);
  };

  const closeLightbox = () => setLightboxIndex(null);
  const stepLightbox = (step) => {
    setLightboxIndex((value) => {
      if (value === null) return value;
      return (value + step + galleryItems.length) % galleryItems.length;
    });
  };

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const handle = () => {
      if (mq.matches) {
        setNavOpen(false);
      }
    };
    handle();
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);

  useEffect(() => {
    if (activeCategoryKey) return undefined;
    const shell = shellRef.current;
    if (!shell) return undefined;
    let wheelLock = 0;
    const canScrollNested = (event) => {
      const deltaX = event.deltaX;
      const deltaY = event.deltaY;
      const prefersY = Math.abs(deltaY) >= Math.abs(deltaX);
      const path = typeof event.composedPath === "function" ? event.composedPath() : [];
      const nodes = path.length ? path : [event.target];

      return nodes.some((node) => {
        if (!(node instanceof HTMLElement) || node === shell) return false;
        const style = window.getComputedStyle(node);
        if (prefersY && /(auto|scroll)/.test(style.overflowY)) {
          const maxY = node.scrollHeight - node.clientHeight;
          if (maxY > 1) return deltaY > 0 ? node.scrollTop < maxY - 1 : node.scrollTop > 1;
        }
        if (!prefersY && /(auto|scroll)/.test(style.overflowX)) {
          const maxX = node.scrollWidth - node.clientWidth;
          if (maxX > 1) return deltaX > 0 ? node.scrollLeft < maxX - 1 : node.scrollLeft > 1;
        }
        return false;
      });
    };
    const handleWheel = (event) => {
      if (canScrollNested(event)) return;
      event.preventDefault();
      const now = Date.now();
      if (now - wheelLock < 760) return;
      wheelLock = now;
      if (event.deltaY > 0) next();
      else if (event.deltaY < 0) prev();
    };
    shell.addEventListener("wheel", handleWheel, { passive: false });
    return () => shell.removeEventListener("wheel", handleWheel);
  }, [activeCategoryKey, pageIndex, pages.length]);

  useEffect(() => {
    const handleKey = (event) => {
      if (navOpen) {
        if (event.key === "Escape") setNavOpen(false);
        return;
      }
      if (lightboxIndex !== null) {
        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowRight") stepLightbox(1);
        if (event.key === "ArrowLeft") stepLightbox(-1);
        return;
      }
      if (profileActiveIndex !== null) {
        if (event.key === "Escape") {
          closeProfilePreview();
        }
        return;
      }
      if (activeCategoryKey) return;
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        next();
      }
      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        prev();
      }
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(pages.length - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeCategoryKey, lightboxIndex, profileActiveIndex, pageIndex, pages.length, navOpen]);

  const startMuseumZoom = (handoffVelocity = 0) => {
    const backdrop = museumBackdropRef.current;
    if (!backdrop || museumZoomStartedRef.current) return;
    museumZoomStartedRef.current = true;

    if (museumZoomRafRef.current) {
      window.cancelAnimationFrame(museumZoomRafRef.current);
      museumZoomRafRef.current = null;
    }

    const initialScale = Math.max(1, museumZoomScaleRef.current || 1);
    const targetScale = 1.18;
    const remainingScale = Math.max(0.001, targetScale - initialScale);
    const initialVelocity = Math.max(0.045, Math.min(0.082, handoffVelocity * 3.6));
    const duration = Math.max(12000, Math.min(32000, (3 * remainingScale / initialVelocity) * 1000));
    const start = window.performance?.now?.() ?? Date.now();
    backdrop.style.setProperty("transform", `scale(${initialScale.toFixed(5)})`, "important");

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const scale = initialScale + remainingScale * eased;
      museumZoomScaleRef.current = scale;
      shellRef.current?.style.setProperty("--museum-bg-scale", scale.toFixed(5));
      backdrop.style.setProperty("transform", `scale(${scale.toFixed(5)})`, "important");
      if (progress < 1) {
        museumZoomRafRef.current = window.requestAnimationFrame(tick);
      }
    };

    museumZoomRafRef.current = window.requestAnimationFrame(tick);
  };
  const activeCategory = localizedCategories.find((category) => category.key === activeCategoryKey) ?? null;
  const activeItems = activeCategory ? localizedGalleryItems.filter((item) => item.id.startsWith(activeCategory.key)) : [];
  const lightboxItem = lightboxIndex === null ? null : localizedGalleryItems[lightboxIndex];

  useEffect(() => {
    if (entered) return undefined;
    const video = welcomeVideoRef.current;
    const shell = shellRef.current;
    if (!video || !shell) return undefined;
    let completeTimer = null;
    let safetyTimer = null;
    let progressTimer = null;
    let lastStyleTime = 0;
    let lastProgress = -1;

    const setProgress = (value, force = false) => {
      const progress = Math.max(0, Math.min(1, value));
      const now = window.performance?.now?.() ?? Date.now();
      if (!force && now - lastStyleTime < 42 && Math.abs(progress - lastProgress) < 0.018) return;
      lastStyleTime = now;
      lastProgress = progress;

      const textFade = Math.max(0, Math.min(1, 1 - progress * 1.35));
      const glassWarm = Math.max(0.001, Math.min(1, (progress - 0.52) / 0.3));
      const glassEase = glassWarm * glassWarm * (3 - 2 * glassWarm);
      const reveal = Math.max(0, Math.min(1, (progress - 0.78) / 0.18));
      const revealEase = reveal * reveal * (3 - 2 * reveal);
      if (progress >= 0.82 && !homeRevealedRef.current) {
        homeRevealedRef.current = true;
        setHomeRevealed(true);
      }
      const frameScale = getWelcomeFrameScale(progress);
      museumZoomScaleRef.current = frameScale;
      shell.style.setProperty("--museum-bg-scale", frameScale.toFixed(5));
      video.style.setProperty("transform", `scale(${frameScale.toFixed(5)})`, "important");
      welcomeProgressRef.current = progress;
      shell.style.setProperty("--welcome-progress", progress.toFixed(4));
      shell.style.setProperty("--welcome-text-opacity", textFade.toFixed(3));
      shell.style.setProperty("--welcome-text-y", `${((1 - textFade) * -10).toFixed(2)}px`);
      shell.style.setProperty("--glass-warm-opacity", (0.001 + glassEase * 0.035).toFixed(3));
      shell.style.setProperty("--glass-warm-blur", `${(2 + glassEase * 16).toFixed(2)}px`);
      shell.style.setProperty("--glass-warm-fill", (0.42 + glassEase * 0.08).toFixed(3));
      shell.style.setProperty("--home-reveal", revealEase.toFixed(3));
      shell.style.setProperty("--home-reveal-y", `${((1 - revealEase) * 18).toFixed(2)}px`);
    };

    const stopProgressLoop = () => {
      if (welcomeRafRef.current) {
        window.cancelAnimationFrame(welcomeRafRef.current);
        welcomeRafRef.current = null;
      }
      if (progressTimer) {
        window.clearInterval(progressTimer);
        progressTimer = null;
      }
      if (safetyTimer) {
        window.clearTimeout(safetyTimer);
        safetyTimer = null;
      }
    };

    const getFreezeTime = () => video.duration ? Math.max(0.03, video.duration - welcomeFreezeOffset) : 0.03;

    const readProgress = () => {
      if (!video.duration) return 0;
      return video.currentTime / Math.max(0.1, getFreezeTime());
    };

    const tickProgress = () => {
      if (video.duration && video.currentTime >= getFreezeTime()) {
        completeWelcome();
        return;
      }
      const progress = readProgress();
      video.playbackRate = getWelcomePlaybackRate(progress);
      setProgress(progress);
      if (!video.paused && !video.ended) {
        welcomeRafRef.current = window.requestAnimationFrame(tickProgress);
      }
    };

    const startProgressLoop = () => {
      stopProgressLoop();
      welcomeRafRef.current = window.requestAnimationFrame(tickProgress);
      progressTimer = window.setInterval(() => {
        if (video.duration && video.currentTime >= getFreezeTime() - 0.04) {
          completeWelcome();
          return;
        }
        if (!video.paused && !video.ended) {
          const progress = readProgress();
          video.playbackRate = getWelcomePlaybackRate(progress);
          setProgress(progress);
        }
      }, 160);
      const fallbackMs = video.duration
        ? Math.min(18000, Math.max(7000, (getFreezeTime() / welcomeMinPlaybackRate) * 1000 + 1200))
        : 12000;
      safetyTimer = window.setTimeout(() => completeWelcome(), fallbackMs);
    };

    const captureFreezeFrame = () => {
      const canvas = museumBackdropRef.current;
      if (!canvas || !video.videoWidth || !video.videoHeight) return;
      try {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = Math.max(1, Math.round(window.innerWidth * dpr));
        const height = Math.max(1, Math.round(window.innerHeight * dpr));
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) return;

        const sourceAspect = video.videoWidth / video.videoHeight;
        const targetAspect = width / height;
        let sx = 0;
        let sy = 0;
        let sw = video.videoWidth;
        let sh = video.videoHeight;

        if (sourceAspect > targetAspect) {
          sw = video.videoHeight * targetAspect;
          sx = (video.videoWidth - sw) / 2;
        } else {
          sh = video.videoWidth / targetAspect;
          sy = (video.videoHeight - sh) / 2;
        }

        context.drawImage(video, sx, sy, sw, sh, 0, 0, width, height);
        canvas.style.setProperty("opacity", "1", "important");
        canvas.style.setProperty("transform", `scale(${museumZoomScaleRef.current.toFixed(5)})`, "important");
      } catch {}
    };

    const completeWelcome = () => {
      if (entering || completeTimer) return;
      setProgress(1, true);
      stopProgressLoop();
      captureFreezeFrame();
      const handoffVelocity = getWelcomeFrameVelocity(1, getWelcomePlaybackRate(1), getFreezeTime());
      startMuseumZoom(handoffVelocity);
      completeTimer = window.setTimeout(() => enterSite(), 16);
      video.pause();
    };

    const prepareVideo = () => {
      video.muted = true;
      video.loop = false;
      video.playsInline = true;
      video.playbackRate = welcomeBasePlaybackRate;
      video.pause();
      homeRevealedRef.current = false;
      museumZoomScaleRef.current = 1;
      shell.style.setProperty("--museum-bg-scale", "1");
      video.style.setProperty("transform", "scale(1)", "important");
      setHomeRevealed(false);
      setProgress(0, true);
      try { video.currentTime = 0.03; } catch {}
    };

    const checkProgress = () => {
      if (!video.duration) return;
      setProgress(readProgress());
    };

    const handlePlay = () => {
      setWelcomePlaying(true);
      startProgressLoop();
    };

    const handlePause = () => {
      if (video.duration && video.currentTime >= getFreezeTime() - 0.12) {
        completeWelcome();
      }
    };

    video.addEventListener("loadedmetadata", prepareVideo);
    video.addEventListener("timeupdate", checkProgress);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", completeWelcome);
    if (video.readyState >= 1) prepareVideo();

    return () => {
      video.removeEventListener("loadedmetadata", prepareVideo);
      video.removeEventListener("timeupdate", checkProgress);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", completeWelcome);
      if (completeTimer) window.clearTimeout(completeTimer);
      stopProgressLoop();
      video.pause();
    };
  }, [entered]);

  useEffect(() => () => {
    if (museumZoomRafRef.current) {
      window.cancelAnimationFrame(museumZoomRafRef.current);
      museumZoomRafRef.current = null;
    }
  }, []);


  useEffect(() => () => {
    if (bgmFadeRef.current) window.cancelAnimationFrame(bgmFadeRef.current);
  }, []);

  const fadeBgmTo = (targetVolume = 0.32) => {
    const audio = bgmRef.current;
    if (!audio) return;
    if (bgmFadeRef.current) window.cancelAnimationFrame(bgmFadeRef.current);
    const startVolume = audio.volume || 0;
    const startTime = performance.now();
    const duration = 1600;
    const tick = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      audio.volume = startVolume + (targetVolume - startVolume) * eased;
      if (progress < 1) bgmFadeRef.current = window.requestAnimationFrame(tick);
    };
    bgmFadeRef.current = window.requestAnimationFrame(tick);
  };

  const playBgm = (force = false) => {
    const audio = bgmRef.current;
    if (!audio || (!force && !bgmEnabled)) return;
    audio.volume = Math.min(audio.volume || 0, 0.04);
    audio.play().then(() => fadeBgmTo()).catch(() => {});
  };

  const toggleBgm = () => {
    const next = !bgmEnabled;
    setBgmEnabled(next);
    const audio = bgmRef.current;
    if (!audio) return;
    if (next) {
      playBgm(true);
      return;
    }
    if (bgmFadeRef.current) window.cancelAnimationFrame(bgmFadeRef.current);
    audio.pause();
  };

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    shell.dataset.glassMode = glassMode;
    try {
      window.localStorage.setItem("msy-glass-mode", glassMode);
    } catch {}
    window.dispatchEvent(new CustomEvent("glass-mode-change", { detail: { mode: glassMode } }));
  }, [glassMode]);

  useEffect(() => {
    if (glassMode !== "frosted") {
      setGlassSettled(true);
      return undefined;
    }
    setGlassSettled(false);
    const timer = window.setTimeout(() => setGlassSettled(true), 80);
    return () => window.clearTimeout(timer);
  }, [glassMode]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("glass-layout-change"));
  }, [safePageIndex, activeCategoryKey, profileActiveIndex, lightboxIndex, lang, entered, siteReady]);

  const startWelcomeVideo = () => {
    const video = welcomeVideoRef.current;
    if (!video || entering) return;
    playBgm();
    if (window.matchMedia?.("(max-width: 760px) and (orientation: portrait)")?.matches) {
      video.pause();
      setWelcomePlaying(false);
      setHomeRevealed(true);
      setEntering(false);
      setEntered(true);
      setSiteReady(true);
      return;
    }
    setWelcomePlaying(true);
    setSiteReady(false);
    museumZoomStartedRef.current = false;
    museumZoomScaleRef.current = 1;
    if (museumZoomRafRef.current) {
      window.cancelAnimationFrame(museumZoomRafRef.current);
      museumZoomRafRef.current = null;
    }
    video.style.setProperty("transform", "scale(1)", "important");
    museumBackdropRef.current?.style.setProperty("transform", "scale(1)", "important");
    video.playbackRate = welcomeBasePlaybackRate;
    video.play().catch(() => setWelcomePlaying(false));
  };
  const enterSite = () => {
    if (entering) return;
    setWelcomePlaying(false);
    setHomeRevealed(true);
    setEntering(true);
    window.setTimeout(() => {
      setEntered(true);
      setEntering(false);
      window.setTimeout(() => setSiteReady(true), 420);
    }, 1380);
  };

  return (
    <main
      lang={lang}
      data-glass-mode={glassMode}
      data-liquid-glass={glassMode === "frosted" ? "frosted" : undefined}
      className={`album-shell${entered ? " is-entered" : ""}${entering ? " is-entering" : ""}${welcomePlaying ? " is-welcome-playing" : ""}${homeRevealed ? " is-home-revealed" : ""}${siteReady ? " is-site-ready" : ""}${glassSettled ? " is-glass-settled" : ""}`}
      style={{
        "--static-glass-image": `url("${asset("assets/glass/fake-glass-bg.webp")}")`,
        "--profile-bg-image": `url("${asset("assets/smallpic/temple.webp")}")`,
        "--works-bg-image": `url("${asset("assets/smallpic/island.webp")}")`,
        "--welcome-bg-image": `url("${asset("assets/smallpic/harbor.webp")}")`
      }}
      ref={shellRef}
    >
      <button className={`audio-toggle nav-${current.type}${bgmEnabled ? " is-on" : ""}`} onClick={toggleBgm} aria-pressed={bgmEnabled} aria-label={bgmEnabled ? (lang === "zh" ? "关闭背景音乐" : "Mute background music") : (lang === "zh" ? "开启背景音乐" : "Play background music")}>
        {bgmEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span>BGM</span>
      </button>

      <button className={`glass-mode-toggle nav-${current.type} is-${glassMode}`} onClick={() => setGlassMode((value) => value === "liquid" ? "frosted" : "liquid")} aria-pressed={glassMode === "liquid"} aria-label={glassMode === "liquid" ? (lang === "zh" ? "切换到磨砂玻璃" : "Switch to frosted glass") : (lang === "zh" ? "切换到液态玻璃" : "Switch to liquid glass")}>
        <Layers3 size={16} />
        <span>{glassMode === "liquid" ? (lang === "zh" ? "液态" : "Liquid") : (lang === "zh" ? "磨砂" : "Frosted")}</span>
      </button>

      {true && (
        <button className="welcome-screen museum-welcome" onClick={startWelcomeVideo} aria-label={lang === "zh" ? "进入作品集" : "Enter portfolio"}>
          <video ref={welcomeVideoRef} className="welcome-video-source" preload="metadata" muted playsInline>
            <source src={asset("assets/welcome/museum-mobile.mp4")} media="(max-width: 760px)" />
            <source src={asset("assets/welcome/museum-mobile.mp4")} />
          </video>

          <span className="welcome-kicker">MUSEUM PORTFOLIO</span>
          <span className="welcome-name"><span>MENG</span><span>SHENGYU</span></span>
          <span className="welcome-role">3D ARTIST / MATERIAL ARTIST</span>
          <span className="welcome-meta" aria-hidden="true"><span>2017-2026</span><span>Game Art Archive</span></span>
          <span className="welcome-action">{lang === "zh" ? "点击进入" : "Click to enter"}</span>
        </button>
      )}
      <audio ref={bgmRef} preload="metadata" loop>
        <source src={asset("assets/bgm/pearl-harbor.mp3")} type="audio/mpeg" />
      </audio>
      <canvas ref={museumBackdropRef} className="museum-freeze-canvas" aria-hidden="true" />
      <div className="glass-prewarm" aria-hidden="true"><span /><span /><span /></div>
      <a href="#main-content" className="skip-link">{t.skip}</a>
      <PillNav pages={pageViews} pageIndex={safePageIndex} currentType={current.type} goTo={goTo} navOpen={navOpen} setNavOpen={setNavOpen} t={t} />

      <button className={`lang-toggle nav-${current.type}`} onClick={() => setLang((value) => value === "zh" ? "en" : "zh")} aria-label={t.langAria}>
        <span>{lang === "zh" ? "中" : "EN"}</span>
      </button>

      <div className="hero-stage" id="main-content" aria-hidden={activeCategory && current.type === "works" ? true : undefined}>
          {pageViews.map((page, index) => {
            const isFlush = page.type === "works" || page.type === "profile";
            return (
              <section
                key={page.type}
                className={`hero ${page.type}${page.type === "works" ? " profile" : ""}${index === safePageIndex ? " is-on" : ""}${isFlush ? " is-flush" : ""}`}
                aria-hidden={index !== safePageIndex}
              >
                {!isFlush && (
                  <>
                  <div className="hero-bottom">
                    <div className="hero-title-block">
                      {page.meta && <p className="hero-eyebrow">{page.meta}</p>}
                      <h1 className="hero-title">{page.title}</h1>
                      <p className="hero-lede">{page.lede}</p>
                    </div>
                    <div className="hero-side">
                      <p className="hero-side-text">
                        {page.type === "cover" && t.side.cover}
                        {page.type === "contact" && t.side.contact}
                      </p>
                      <PageDetail page={page} openCategory={openCategory} lang={lang} t={t} />
                    </div>
                  </div>
                    {page.type === "contact" && (
                      <p className="contact-thanks" aria-hidden="true">{t.contactThanks}</p>
                    )}
                  </>
                )}
                {page.type === "works" && (
                  <div className="exp-frame">
                    <header className="exp-frame-head">
                      <p className="hero-eyebrow">{page.meta}</p>
                      <h1 className="hero-title">{page.title}</h1>
                      <p className="hero-lede">{page.lede}</p>
                    </header>
                    <ExhibitRow
                      items={worksExhibits}
                      isActive={index === safePageIndex}
                      onItemClick={(item) => openCategory(item.source.key)}
                      t={t}
                    />
                  </div>
                )}
                {page.type === "profile" && (
                  <div className="exp-frame">
                    <header className="exp-frame-head">
                      <p className="hero-eyebrow">{page.meta}</p>
                      <h1 className="hero-title">{page.title}</h1>
                      <p className="hero-lede">{page.lede}</p>
                    </header>
                    <ExhibitRow
                      items={profileExhibits}
                      isActive={index === safePageIndex}
                      onItemClick={(_, i, e) => openProfilePreview(i, e.currentTarget)}
                      getItemStyle={(_, i) => {
                        const offset = i - (profileActiveIndex ?? i);
                        return {
                          "--offset": offset,
                          "--abs-offset": Math.abs(offset)
                        };
                      }}
                      t={t}
                    />
                    {profileActiveIndex !== null && (
                      <div
                        className={`profile-preview${profilePreviewClosing ? " is-closing" : ""}`}
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${localizedExperience[profileActiveIndex].game} ${t.preview}`}
                        onClick={closeProfilePreview}
                      >
                        <figure
                          className="profile-preview-frame"
                          style={profileFlyFrom ? {
                            "--preview-x": `${profileFlyFrom.finalX}px`,
                            "--preview-y": `${profileFlyFrom.finalY}px`,
                            "--preview-w": `${profileFlyFrom.finalW}px`,
                            "--preview-h": `${profileFlyFrom.finalH}px`,
                            "--from-dx": `${profileFlyFrom.dx}px`,
                            "--from-dy": `${profileFlyFrom.dy}px`,
                            "--from-sx": profileFlyFrom.sx,
                            "--from-sy": profileFlyFrom.sy,
                            ...(profileGlowRgb ? { "--image-glow-rgb": profileGlowRgb } : {})
                          } : undefined}
                        >
                          <img src={localizedExperience[profileActiveIndex].image} alt={localizedExperience[profileActiveIndex].game} decoding="async" onLoad={(e) => readImageGlow(e.currentTarget)} />
                          <figcaption>
                            <span className="profile-preview-titleline">
                              <strong>{localizedExperience[profileActiveIndex].game}</strong>
                              <span>{localizedExperience[profileActiveIndex].companyText} · {localizedExperience[profileActiveIndex].year}</span>
                            </span>
                            <span className="profile-preview-desc">{localizedExperience[profileActiveIndex].descText}</span>
                          </figcaption>
                        </figure>
                      </div>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>

      {activeCategory && current.type === "works" && (
        <GalleryDetail
          category={activeCategory}
          items={activeItems}
          back={() => setActiveCategoryKey(null)}
          openLightbox={setLightboxIndex}
          t={t}
        />
      )}

      <div className={`hero-meta${activeCategory ? " is-hidden" : ""}`} aria-hidden="true">
          <div className="hero-meta-l">
            <span>PROFILE</span>
          </div>
          <div className="hero-meta-c">
            <span><Num>{String(safePageIndex + 1).padStart(2, "0")}</Num> / <Num>{String(pageViews.length).padStart(2, "0")}</Num></span>
          </div>
          <div className="hero-meta-r">
            <span>孟圣育 © 2025 — 2026</span>
          </div>
        </div>

      {lightboxItem && (
        <Lightbox
          item={lightboxItem}
          items={localizedGalleryItems}
          close={closeLightbox}
          step={stepLightbox}
          t={t}
        />
      )}
    </main>
  );
}

function PillNav({ pages, pageIndex, currentType, goTo, navOpen, setNavOpen, t }) {
  const navSwipeRef = useRef(null);
  const suppressNavClickRef = useRef(false);
  const handlePointerDown = (e) => {
    if (e.pointerType === "mouse") return;
    navSwipeRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const handlePointerUp = (e) => {
    const start = navSwipeRef.current;
    navSwipeRef.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      e.preventDefault();
      suppressNavClickRef.current = true;
      window.setTimeout(() => {
        suppressNavClickRef.current = false;
      }, 0);
      goTo(pageIndex + (dx < 0 ? 1 : -1));
    }
  };
  const handlePointerCancel = () => {
    navSwipeRef.current = null;
  };
  return (
    <>
      <nav
        className={`pill-nav nav-${currentType}`}
        aria-label={t.navAria}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <ul className="pill-tabs" style={{ "--active-index": pageIndex }}>
          {pages.map((page, i) => (
            <li key={page.type}>
              <button
                className={i === pageIndex ? "is-on" : ""}
                onClick={(event) => {
                  if (suppressNavClickRef.current) {
                    event.preventDefault();
                    return;
                  }
                  goTo(i);
                }}
                aria-current={i === pageIndex ? "page" : undefined}
              >
                {page.navLabel}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <button
        className="nav-hamburger"
        onClick={() => setNavOpen((o) => !o)}
        aria-label={t.openNav}
        aria-expanded={navOpen}
      >
        <Menu size={20} strokeWidth={1.6} />
      </button>

      <div
        className={`nav-drawer${navOpen ? " is-open" : ""}`}
        aria-hidden={!navOpen}
      >
        <button
          className="nav-drawer-close"
          onClick={() => setNavOpen(false)}
          aria-label={t.closeNav}
        >
          <X size={18} strokeWidth={1.6} />
        </button>
        {pages.map((page, i) => (
          <button
            key={page.type}
            className={i === pageIndex ? "is-on" : ""}
            onClick={() => {
              goTo(i);
              setNavOpen(false);
            }}
            aria-current={i === pageIndex ? "page" : undefined}
          >
            <span className="nav-drawer-index">{String(i + 1).padStart(2, "0")}</span>
            <span className="nav-drawer-label">{page.navLabel}</span>
          </button>
        ))}
      </div>

      <div
        className={`nav-veil${navOpen ? " is-open" : ""}`}
        onClick={() => setNavOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}

function SkillsBlock({ lang }) {
  return (
    <div className="skills-block">
      {skills.map(({ icon: Icon, title, text }, i) => {
        const item = i18n[lang].skills[i] ?? {};
        return (
        <article key={title}>
          <span className="skill-index"><Num>{`0${i + 1}`}</Num></span>
          <Icon size={20} />
          <h3>{item.title ?? title}</h3>
          <p>{item.text ?? text}</p>
        </article>
      );
      })}
    </div>
  );
}

function GalleryDetail({ category, items, back, openLightbox, t }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = items[activeIndex] ?? items[0];
  const wheelRef = useRef(0);
  const railRef = useRef(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [category.key]);

  const stepGallery = (direction) => {
    setActiveIndex((value) => (value + direction + items.length) % items.length);
  };

  const handleGalleryWheel = (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - wheelRef.current < 320) return;
    wheelRef.current = now;
    stepGallery(e.deltaY > 0 || e.deltaX > 0 ? 1 : -1);
  };

  const handleRailWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!railRef.current) return;
    railRef.current.scrollLeft += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
  };

  return (
    <div className="gallery-stage" onWheel={handleGalleryWheel} onClick={back}>
      <button className="back-pill" onClick={(e) => { e.stopPropagation(); back(); }} aria-label={t.backFolders}>
        <ArrowUp size={14} /> {t.backFolders}
      </button>

      <figure className="gallery-frame" onClick={(e) => { e.stopPropagation(); openLightbox(current.index); }}>
        <img src={current.src} alt={current.title} loading="eager" decoding="async" fetchPriority="high" />
      </figure>

      <div ref={railRef} className="thumb-rail" onWheel={handleRailWheel} onClick={(e) => e.stopPropagation()} aria-label={t.thumbnails}>
        {items.map((item, index) => (
          <button
            key={item.id}
            className={`thumb ${index === activeIndex ? "is-on" : ""}`}
            onClick={() => setActiveIndex(index)}
            aria-current={index === activeIndex ? "true" : undefined}
            aria-label={`${t.view} ${item.title}`}
          >
            <img src={item.thumb} alt="" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Lightbox({ item, items, close, step, t }) {
  const lastWheelRef = useRef(0);
  useEffect(() => {
    const onWheel = (e) => {
      const now = Date.now();
      if (now - lastWheelRef.current < 380) return;
      lastWheelRef.current = now;
      if (e.deltaY > 0) step(1);
      else if (e.deltaY < 0) step(-1);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [step]);
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${item.title} ${t.bigPreview}`} onClick={close}>
      <button className="lightbox-close" onClick={(e) => { e.stopPropagation(); close(); }} aria-label={t.closeImage}>
        <X size={18} />
      </button>
      <figure className="lightbox-figure">
        <img src={item.src} alt={item.title} decoding="async" />
      </figure>
    </div>
  );
}

function PageDetail({ page, openCategory, lang, t }) {
  if (page.type === "cover") {
    return (
      <div className="cover-detail">
        <div className="detail-stats">
          {stats.map((s) => (
            <div key={s.label.en}>
              <strong><Num>{s.value}</Num></strong>
              <span>{s.label[lang]}</span>
            </div>
          ))}
        </div>
        <SkillsBlock lang={lang} />
      </div>
    );
  }
  if (page.type === "works" || page.type === "profile") return null;
  if (page.type === "contact") {
    return (
      <div className="detail-contact">
        <p><MapPin size={14} /> {t.contactLocation}</p>
        <p><Mail size={14} /> 269032957@qq.com</p>
        <p><Phone size={14} /> 17602111648</p>
        <p className="end-note"><UserRound size={14} /> {t.contactRole}</p>
      </div>
    );
  }
  return null;
}

createRoot(document.getElementById("root")).render(<App />);






















































