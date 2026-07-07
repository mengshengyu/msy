import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const src = "C:/Users/26903/Desktop/个人作品/孟圣育_简历与作品集/孟圣育_简历作品合集/游戏图";
const dst = "C:/Users/26903/Desktop/个人作品/孟圣育_简历与作品集/孟圣育_简历作品合集/portfolio-site/public/assets/experience";
mkdirSync(dst, { recursive: true });

const map = [
  { from: "诛仙.jpg",                to: "zhuxian.webp" },
  { from: "magunum quest.jpg",       to: "magumum-quest.webp" },
  { from: "dark-nemesis.jpg",        to: "dark-nemesis.webp" },
  { from: "devil may cry 5.jpg",     to: "dmc5.webp" },
  { from: "全民舞姬.jpg",            to: "quanmin-wuji.webp" }
];

for (const { from, to } of map) {
  await sharp(join(src, from))
    .rotate()
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toFile(join(dst, to));
  console.log(`${from} -> ${to}`);
}