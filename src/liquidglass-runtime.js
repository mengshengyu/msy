const LIQUID_GLASS_CDN = "https://cdn.jsdelivr.net/npm/@ybouane/liquidglass/dist/index.js";
const LIQUID_GLASS_TIMEOUT_MS = 10000;
const GLASS_MODE_STORAGE_KEY = "msy-glass-mode";

const BASE_CONFIG = Object.freeze({
  blurAmount: 0.22,
  refraction: 0.62,
  chromAberration: 0.035,
  edgeHighlight: 0.08,
  specular: 0,
  fresnel: 0.95,
  distortion: 0.018,
  opacity: 1,
  saturation: 0.04,
  tintStrength: 0.035,
  brightness: 0.02,
  shadowOpacity: 0.25,
  shadowSpread: 8,
  shadowOffsetY: 3
});

let liquidGlassBooted = false;
let liquidGlassReady = false;
let liquidGlassRetryCount = 0;
let latestStartSync = null;
let liquidGlassCleanup = null;
let liquidGlassInstance = null;

const GLASS_TARGETS = [
  {
    selector: ".pill-nav",
    type: "nav",
    config: { blurAmount: 0.18, cornerRadius: 32, zRadius: 10, shadowOpacity: 0.2, button: false },
    zIndex: 79
  },
  {
    selector: ".lang-toggle, .audio-toggle, .glass-mode-toggle",
    type: "utility",
    config: { blurAmount: 0.16, cornerRadius: 22, zRadius: 12, button: true, tintStrength: 0.02 },
    zIndex: 89
  },
  {
    selector: ".detail-stats div, .skills-block article",
    type: "utility",
    config: { blurAmount: 0.16, cornerRadius: 22, zRadius: 12, button: true, tintStrength: 0.02 },
    zIndex: 9
  },
  {
    selector: ".back-pill, .lightbox-close",
    type: "utility",
    config: { blurAmount: 0.16, cornerRadius: 22, zRadius: 12, button: true, tintStrength: 0.02 },
    zIndex: 129
  }
];

const STATIC_GLASS_SELECTOR = [
  ".pill-nav",
  ".lang-toggle",
  ".audio-toggle",
  ".glass-mode-toggle",
  ".hero.profile .exp-slat > .exp-slat-year",
  ".hero.profile .exp-slat-text",
  ".back-pill",
  ".lightbox-close",
  ".detail-stats div",
  ".skills-block article"
].join(", ");

const targetRadiusCache = new WeakMap();
const targetBoxCache = new WeakMap();
let staticGlassFrame = 0;

function mergeConfig(config) {
  return { ...BASE_CONFIG, ...config };
}

function getGlassMode(root) {
  if (root?.dataset.glassMode === "frosted") return "frosted";
  if (root?.dataset.glassMode === "liquid") return "liquid";
  try {
    return window.localStorage.getItem(GLASS_MODE_STORAGE_KEY) === "liquid" ? "liquid" : "frosted";
  } catch {
    return "frosted";
  }
}

function setGlassState(root, mode, state) {
  root.dataset.glassMode = mode;
  root.dataset.liquidGlass = state;
  root.classList.remove("liquid-glass-booting", "liquid-glass-ready", "liquid-glass-fallback", "liquid-glass-frosted");
  root.classList.add(`liquid-glass-${state}`);
}

function withTimeout(promise, timeoutMs, message) {
  let timeoutId = 0;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timeoutId));
}

function hasLayoutBox(element) {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  return rect.width > 2 && rect.height > 2 && style.display !== "none" && style.visibility !== "hidden";
}

function shouldShowProxy(element) {
  if (!hasLayoutBox(element)) return false;
  if (element.closest(".hero:not(.is-on)")) return false;
  const style = window.getComputedStyle(element);
  return Number(style.opacity || 1) > 0.001;
}

function collectTargets() {
  const seen = new Set();
  const targets = [];

  GLASS_TARGETS.forEach((definition) => {
    document.querySelectorAll(definition.selector).forEach((element) => {
      if (seen.has(element)) return;
      seen.add(element);
      targets.push({ element, definition });
    });
  });

  return targets;
}

function createProxy(root, target, index) {
  const proxy = document.createElement("div");
  proxy.className = `liquid-glass-proxy liquid-glass-${target.definition.type}`;
  proxy.dataset.liquidGlassProxy = "true";
  proxy.dataset.targetIndex = String(index);
  proxy.dataset.config = JSON.stringify(mergeConfig(target.definition.config));
  target.element.dataset.liquidGlassNative = "true";
  root.appendChild(proxy);
  return proxy;
}

function getBorderRadius(element) {
  let radius = targetRadiusCache.get(element);
  if (radius) return radius;
  radius = window.getComputedStyle(element).borderRadius;
  targetRadiusCache.set(element, radius);
  return radius;
}

function markLiquidGlassChanged(element) {
  try {
    liquidGlassInstance?.markChanged?.(element);
  } catch {}
}

function syncBox(rootRect, rootScrollLeft, rootScrollTop, element, target, zIndex) {
  const rect = target.element.getBoundingClientRect();
  const radius = getBorderRadius(target.element);
  const nextLeft = rect.left - rootRect.left + rootScrollLeft;
  const nextTop = rect.top - rootRect.top + rootScrollTop;
  const nextWidth = rect.width;
  const nextHeight = rect.height;
  const cached = targetBoxCache.get(target.element);
  if (
    cached &&
    cached.left === nextLeft &&
    cached.top === nextTop &&
    cached.width === nextWidth &&
    cached.height === nextHeight &&
    cached.radius === radius &&
    cached.zIndex === zIndex
  ) {
    return false;
  }

  targetBoxCache.set(target.element, {
    left: nextLeft,
    top: nextTop,
    width: nextWidth,
    height: nextHeight,
    radius,
    zIndex
  });

  element.style.left = `${nextLeft}px`;
  element.style.top = `${nextTop}px`;
  element.style.width = `${nextWidth}px`;
  element.style.height = `${nextHeight}px`;
  element.style.borderRadius = radius;
  element.style.setProperty("--lg-proxy-z", String(zIndex));
  return true;
}

function syncProxy(rootRect, rootScrollLeft, rootScrollTop, proxy, target) {
  return syncBox(rootRect, rootScrollLeft, rootScrollTop, proxy, target, target.definition.zIndex);
}


function createProxySet(root) {
  root.querySelectorAll(":scope > .liquid-glass-proxy").forEach((proxy) => proxy.remove());
  root.querySelectorAll('[data-liquid-glass-native="true"]').forEach((element) => {
    delete element.dataset.liquidGlassNative;
  });

  const targets = collectTargets();
  const rootRect = root.getBoundingClientRect();
  const rootScrollLeft = root.scrollLeft;
  const rootScrollTop = root.scrollTop;
  const proxies = targets.map((target, index) => {
    const proxy = createProxy(root, target, index);
    syncProxy(rootRect, rootScrollLeft, rootScrollTop, proxy, target);
    return { proxy, target };
  });

  return proxies;
}

function scheduleSync(root, pairs) {
  let frame = 0;
  const sync = () => {
    frame = 0;
    const rootRect = root.getBoundingClientRect();
    const rootScrollLeft = root.scrollLeft;
    const rootScrollTop = root.scrollTop;
    pairs.forEach(({ proxy, target }) => {
      if (document.body.contains(target.element) && shouldShowProxy(target.element)) {
        if (syncProxy(rootRect, rootScrollLeft, rootScrollTop, proxy, target)) {
          markLiquidGlassChanged(proxy);
        }
        proxy.hidden = false;
      } else {
        proxy.hidden = true;
      }
    });
  };

  return () => {
    if (!frame) frame = window.requestAnimationFrame(sync);
  };
}

function syncFor(schedule, duration = 1800) {
  const startedAt = performance.now();
  const tick = () => {
    schedule();
    if (performance.now() - startedAt < duration) window.requestAnimationFrame(tick);
  };
  tick();
}

function bootFpsMeter() {
  if (document.querySelector(".fps-meter")) return;
  const meter = document.createElement("div");
  meter.className = "fps-meter";
  meter.textContent = "FPS --";
  document.body.appendChild(meter);

  let frames = 0;
  let last = performance.now();
  const tick = (now) => {
    frames += 1;
    const elapsed = now - last;
    if (elapsed >= 500) {
      meter.textContent = `FPS ${Math.round((frames * 1000) / elapsed)}`;
      frames = 0;
      last = now;
    }
    window.requestAnimationFrame(tick);
  };
  window.requestAnimationFrame(tick);
}

function syncStaticGlassPositions() {
  staticGlassFrame = 0;
  const root = document.querySelector(".album-shell");
  if (!root || getGlassMode(root) !== "frosted") return;
  document.querySelectorAll(STATIC_GLASS_SELECTOR).forEach((element) => {
    if (!hasLayoutBox(element)) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--static-glass-x", `${-Math.round(rect.left)}px`);
    element.style.setProperty("--static-glass-y", `${-Math.round(rect.top)}px`);
  });
}

function scheduleStaticGlassPositions() {
  if (!staticGlassFrame) staticGlassFrame = window.requestAnimationFrame(syncStaticGlassPositions);
}

function syncStaticGlassFor(duration = 900) {
  const startedAt = performance.now();
  const tick = () => {
    scheduleStaticGlassPositions();
    if (performance.now() - startedAt < duration) window.requestAnimationFrame(tick);
  };
  tick();
}

function setPrewarmHidden(root, hidden) {
  const prewarm = root.querySelector(".glass-prewarm");
  if (prewarm) prewarm.hidden = hidden;
}

function teardownLiquidGlass(root) {
  liquidGlassCleanup?.();
  liquidGlassCleanup = null;
  liquidGlassInstance?.destroy?.();
  liquidGlassInstance = null;
  liquidGlassBooted = false;
  liquidGlassReady = false;
  latestStartSync = null;
  if (root) {
    root.querySelectorAll(":scope > .liquid-glass-proxy").forEach((proxy) => proxy.remove());
    root.querySelectorAll('[data-liquid-glass-native="true"]').forEach((element) => {
      delete element.dataset.liquidGlassNative;
    });
  }
}

function activateFrostedGlass(root) {
  teardownLiquidGlass(root);
  setPrewarmHidden(root, true);
  setGlassState(root, "frosted", "frosted");
  syncStaticGlassFor(900);
}

function activateReadyLiquidGlass(root) {
  setPrewarmHidden(root, true);
  setGlassState(root, "liquid", "ready");
  root.querySelectorAll(":scope > .liquid-glass-proxy").forEach((proxy) => {
    proxy.hidden = false;
  });
  latestStartSync?.();
}

async function bootLiquidGlass() {
  bootFpsMeter();
  const root = document.querySelector(".album-shell");
  if (!root) return;
  if (getGlassMode(root) === "frosted") {
    activateFrostedGlass(root);
    return;
  }
  if (liquidGlassBooted) {
    if (liquidGlassReady) activateReadyLiquidGlass(root);
    else setGlassState(root, "liquid", "fallback");
    return;
  }
  liquidGlassBooted = true;

  setGlassState(root, "liquid", "booting");
  setPrewarmHidden(root, false);

  const pairs = createProxySet(root);
  const glassElements = pairs.map(({ proxy }) => proxy);
  const schedule = scheduleSync(root, pairs);

  const startSync = () => syncFor(schedule, 820);
  const startSyncLong = () => syncFor(schedule, 1200);
  latestStartSync = startSyncLong;
  const resizeObserver = window.ResizeObserver ? new ResizeObserver(schedule) : null;
  const observe = (element) => resizeObserver?.observe(element);
  window.addEventListener("resize", startSyncLong, { passive: true });
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("glass-layout-change", startSync, { passive: true });
  root.addEventListener("scroll", schedule, { passive: true, capture: true });
  root.addEventListener("click", startSync, { passive: true });
  observe(root);
  pairs.forEach(({ target }) => observe(target.element));
  liquidGlassCleanup = () => {
    window.removeEventListener("resize", startSyncLong);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("glass-layout-change", startSync);
    root.removeEventListener("scroll", schedule, true);
    root.removeEventListener("click", startSync);
    resizeObserver?.disconnect();
    setPrewarmHidden(root, true);
  };
  startSync();

  if (!glassElements.length) {
    teardownLiquidGlass(root);
    setGlassState(root, "liquid", "fallback");
    return;
  }

  try {
    const { LiquidGlass } = await withTimeout(
      import(/* @vite-ignore */ LIQUID_GLASS_CDN),
      LIQUID_GLASS_TIMEOUT_MS,
      "LiquidGlass CDN timed out"
    );
    liquidGlassInstance = await withTimeout(
      LiquidGlass.init({
        root,
        glassElements,
        defaults: BASE_CONFIG
      }),
      LIQUID_GLASS_TIMEOUT_MS,
      "LiquidGlass init timed out"
    );
    liquidGlassReady = true;
    liquidGlassRetryCount = 0;
    if (getGlassMode(root) === "frosted") {
      activateFrostedGlass(root);
      return;
    }
    activateReadyLiquidGlass(root);
    startSync();
  } catch (error) {
    console.warn("LiquidGlass CDN/WebGL unavailable; using CSS glass fallback.", error);
    glassElements.forEach((element) => element.remove());
    teardownLiquidGlass(root);
    if (getGlassMode(root) === "frosted") {
      activateFrostedGlass(root);
      return;
    }
    setGlassState(root, "liquid", "fallback");
    if (liquidGlassRetryCount < 2) {
      liquidGlassRetryCount += 1;
      window.setTimeout(bootLiquidGlass, 1600);
    }
  }
}

window.addEventListener("load", () => {
  const root = document.querySelector(".album-shell");
  if (!root) return;
  if (getGlassMode(root) === "liquid") bootLiquidGlass();
  else syncStaticGlassFor(1200);
}, { once: true });
window.addEventListener("resize", () => syncStaticGlassFor(900), { passive: true });
window.addEventListener("scroll", scheduleStaticGlassPositions, { passive: true });
window.addEventListener("glass-layout-change", () => syncStaticGlassFor(900), { passive: true });
window.addEventListener("glass-mode-change", () => {
  const root = document.querySelector(".album-shell");
  if (!root) return;
  if (getGlassMode(root) === "frosted") {
    activateFrostedGlass(root);
    return;
  }
  bootLiquidGlass();
});
