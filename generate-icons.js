const sharp = require('sharp');
const fs = require('fs');

// SVG 沙漏图标
function makeSVG(size) {
  const s = size;
  const cx = s / 2;
  const topY = s * 0.18;
  const botY = s * 0.82;
  const wideW = s * 0.32;
  const neckW = s * 0.04;
  const midY = s / 2;

  const t = 0.3;
  const sandTopY = topY + (midY - topY) * t;
  const sandTopW = wideW - t * (wideW - neckW);

  const t2 = 0.55;
  const sandBotTop = midY + (botY - midY) * t2;
  const sandBotW = neckW + t2 * (wideW - neckW);

  const r = s * 0.18;
  const lw = s * 0.04;
  const barLW = s * 0.055;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
  <rect width="${s}" height="${s}" rx="${r}" ry="${r}" fill="#2563eb"/>

  <!-- 沙漏外框 -->
  <polygon points="
    ${cx - wideW},${topY}
    ${cx + wideW},${topY}
    ${cx + neckW},${midY}
    ${cx + wideW},${botY}
    ${cx - wideW},${botY}
    ${cx - neckW},${midY}
  " fill="rgba(255,255,255,0.15)" stroke="white" stroke-width="${lw}" stroke-linejoin="round"/>

  <!-- 上半沙子 -->
  <polygon points="
    ${cx - sandTopW},${sandTopY}
    ${cx + sandTopW},${sandTopY}
    ${cx + neckW},${midY}
    ${cx - neckW},${midY}
  " fill="rgba(255,255,255,0.9)"/>

  <!-- 下半沙子 -->
  <polygon points="
    ${cx - sandBotW},${sandBotTop}
    ${cx + sandBotW},${sandBotTop}
    ${cx + wideW},${botY}
    ${cx - wideW},${botY}
  " fill="rgba(255,255,255,0.9)"/>

  <!-- 顶部横线 -->
  <line x1="${cx - wideW - s*0.02}" y1="${topY}" x2="${cx + wideW + s*0.02}" y2="${topY}"
    stroke="white" stroke-width="${barLW}" stroke-linecap="round"/>

  <!-- 底部横线 -->
  <line x1="${cx - wideW - s*0.02}" y1="${botY}" x2="${cx + wideW + s*0.02}" y2="${botY}"
    stroke="white" stroke-width="${barLW}" stroke-linecap="round"/>
</svg>`;
}

async function generate() {
  fs.mkdirSync('icons', { recursive: true });

  for (const size of [192, 512]) {
    const svg = Buffer.from(makeSVG(size));
    await sharp(svg).png().toFile(`icons/icon-${size}.png`);
    console.log(`生成 icons/icon-${size}.png`);
  }
}

generate();
