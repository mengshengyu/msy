import sharp from "sharp";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "C:/Users/26903/Desktop/个人作品/孟圣育_简历与作品集/孟圣育_简历作品合集/portfolio-site/public/assets/cover";

for (const f of readdirSync(dir)) {
  if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
  const inPath = join(dir, f);
  const outPath = join(dir, f.replace(/\.(jpe?g|png)$/i, ".webp"));
  await sharp(inPath)
    .rotate()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 78, effort: 5 })
    .toFile(outPath);
  console.log(`${f} -> ${outPath.split(/[\\/]/).pop()}`);
}