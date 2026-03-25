/**
 * Generates a 1080×1080 shareable image card with the question & answer.
 * Returns a Blob (image/png).
 */

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** Draw a 4-pointed sparkle star */
function drawSparkle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
  rotation = 0,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(size * 0.15, -size * 0.15, size, 0);
  ctx.quadraticCurveTo(size * 0.15, size * 0.15, 0, size);
  ctx.quadraticCurveTo(-size * 0.15, size * 0.15, -size, 0);
  ctx.quadraticCurveTo(-size * 0.15, -size * 0.15, 0, -size);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Draw a zigzag/squiggly line separator */
function drawZigzag(
  ctx: CanvasRenderingContext2D,
  x1: number,
  x2: number,
  y: number,
  amplitude: number,
  color: string,
  lineWidth = 2.5,
) {
  const segments = 18;
  const segW = (x2 - x1) / segments;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y);
  for (let i = 0; i < segments; i++) {
    const dir = i % 2 === 0 ? -1 : 1;
    const cpx = x1 + segW * (i + 0.5);
    const cpy = y + amplitude * dir;
    const ex = x1 + segW * (i + 1);
    ctx.quadraticCurveTo(cpx, cpy, ex, y);
  }
  ctx.stroke();
  ctx.restore();
}

/** Scatter random emojis across an area */
function drawScatteredEmojis(
  ctx: CanvasRenderingContext2D,
  size: number,
  pad: number,
  count: number,
  emojiSize: number,
  opacity: number,
) {
  const emojis = [
    "🔥", "", "💅", "🤡", "👀", "🫠", "😈",
    "🎤", "🧠", "⚡", "🗿", "🫢", "🤌", "👁️",
  ];
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.font = `${emojiSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < count; i++) {
    const x = pad * 0.5 + Math.random() * (size - pad);
    const y = pad * 0.5 + Math.random() * (size - pad);
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const rotation = (Math.random() - 0.5) * 0.6;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillText(emoji, 0, 0);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.restore();
}

/** Draw a speech-bubble tail (triangle) pointing up from a card */
function drawBubbleTail(
  ctx: CanvasRenderingContext2D,
  tipX: number,
  tipY: number,
  baseW: number,
  height: number,
  fillColor: string,
) {
  ctx.save();
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(tipX - baseW / 2, tipY + height);
  ctx.lineTo(tipX + baseW / 2, tipY + height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

interface CardColors {
  bg: string;
  fg: string;
  muted: string;
  accent: string;
  surface: string;
  border: string;
  isDark: boolean;
}

function getCardColors(mode: "dark" | "light"): CardColors {
  const isDark = mode === "dark";
  return {
    bg: isDark ? "#0a0a0a" : "#fffbf5",
    fg: isDark ? "#ededed" : "#171717",
    muted: "#737373",
    accent: "#f97316",
    surface: isDark ? "#141414" : "#f5f5f5",
    border: isDark ? "#262626" : "#e5e5e5",
    isDark,
  };
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  S: number,
  PAD: number,
  colors: CardColors,
) {
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, S, S);

  const glow1 = ctx.createRadialGradient(S * 0.3, S * 0.3, 0, S * 0.3, S * 0.3, S * 0.5);
  glow1.addColorStop(0, colors.isDark ? "rgba(249,115,22,0.10)" : "rgba(249,115,22,0.07)");
  glow1.addColorStop(1, "transparent");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, S, S);

  const glow2 = ctx.createRadialGradient(S * 0.75, S * 0.7, 0, S * 0.75, S * 0.7, S * 0.45);
  glow2.addColorStop(0, colors.isDark ? "rgba(168,85,247,0.06)" : "rgba(168,85,247,0.04)");
  glow2.addColorStop(1, "transparent");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, S, S);

  drawScatteredEmojis(ctx, S, PAD, 14, 36, colors.isDark ? 0.12 : 0.09);
}

function drawLogo(
  ctx: CanvasRenderingContext2D,
  PAD: number,
  y: number,
  colors: CardColors,
): number {
  ctx.font = "bold 56px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = colors.fg;
  ctx.fillText("Less", PAD, y + 56);
  const lessW = ctx.measureText("Less").width;
  ctx.fillStyle = colors.accent;
  ctx.fillText("Words", PAD + lessW, y + 56);
  drawSparkle(ctx, PAD + lessW + ctx.measureText("Words").width + 28, y + 30, 14, colors.accent, 0.3);
  return y + 100;
}

function drawQuestionSection(
  ctx: CanvasRenderingContext2D,
  question: string,
  S: number,
  PAD: number,
  CONTENT_W: number,
  y: number,
  colors: CardColors,
): number {
  // Zigzag divider
  drawZigzag(ctx, PAD, S - PAD, y, 6, colors.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)");
  y += 44;

  // "They said" label
  ctx.font = "600 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = colors.muted;
  ctx.letterSpacing = "3px";
  ctx.fillText("\u{1F5E3}  THEY SAID", PAD, y);
  ctx.letterSpacing = "0px";
  y += 40;

  // Question card (speech bubble style)
  ctx.font = "400 46px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const qLines = wrapText(ctx, `\u201C${question}\u201D`, CONTENT_W - 72, 62);
  const qCardH = Math.max(qLines.length * 62 + 52, 124);

  drawRoundedRect(ctx, PAD, y, CONTENT_W, qCardH, 24);
  ctx.fillStyle = colors.surface;
  ctx.fill();
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Speech bubble tail
  drawBubbleTail(ctx, PAD + 60, y + qCardH, 20, 14, colors.surface);
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD + 50, y + qCardH);
  ctx.lineTo(PAD + 60, y + qCardH + 14);
  ctx.lineTo(PAD + 70, y + qCardH);
  ctx.stroke();

  ctx.fillStyle = colors.muted;
  ctx.font = "italic 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  let qY = y + 48;
  for (const line of qLines) {
    ctx.fillText(line, PAD + 36, qY);
    qY += 62;
  }

  y += qCardH + 54;

  // Triple chevron arrows
  const arrowX = S / 2;
  for (let i = 0; i < 3; i++) {
    const opacity = 1 - i * 0.3;
    ctx.strokeStyle = `rgba(249,115,22,${opacity})`;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    const ay = y + i * 16;
    ctx.moveTo(arrowX - 14, ay);
    ctx.lineTo(arrowX, ay + 10);
    ctx.lineTo(arrowX + 14, ay);
    ctx.stroke();
  }

  return y + 60;
}

function drawAnswerSection(
  ctx: CanvasRenderingContext2D,
  answer: string,
  S: number,
  PAD: number,
  CONTENT_W: number,
  y: number,
  colors: CardColors,
): number {
  // "They meant" label
  ctx.font = "600 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = colors.accent;
  ctx.letterSpacing = "3px";
  ctx.fillText("\u{1F3AF}  THEY MEANT", PAD, y);
  ctx.letterSpacing = "0px";
  y += 40;

  // Answer card with glow
  ctx.font = "bold 50px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const aLines = wrapText(ctx, `\u201C${answer}\u201D`, CONTENT_W - 72, 66);
  const aCardH = Math.max(aLines.length * 66 + 56, 134);

  // Outer glow ring
  ctx.save();
  ctx.shadowColor = colors.isDark ? "rgba(249,115,22,0.25)" : "rgba(249,115,22,0.15)";
  ctx.shadowBlur = 50;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 10;

  // Gradient border
  drawRoundedRect(ctx, PAD - 3, y - 3, CONTENT_W + 6, aCardH + 6, 26);
  const borderGrad = ctx.createLinearGradient(PAD, y, S - PAD, y + aCardH);
  borderGrad.addColorStop(0, "#f97316");
  borderGrad.addColorStop(0.5, "#fbbf24");
  borderGrad.addColorStop(1, "#f97316");
  ctx.fillStyle = borderGrad;
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.restore();

  // Inner card fill
  drawRoundedRect(ctx, PAD, y, CONTENT_W, aCardH, 24);
  ctx.fillStyle = colors.surface;
  ctx.fill();

  // Answer text
  ctx.fillStyle = colors.fg;
  ctx.font = "bold 48px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  let aY = y + 52;
  for (const line of aLines) {
    ctx.fillText(line, PAD + 36, aY);
    aY += 66;
  }

  // Sparkles flanking the answer card
  drawSparkle(ctx, PAD - 20, y + 20, 16, colors.accent, 0.5);
  drawSparkle(ctx, S - PAD + 18, y + aCardH - 20, 12, "#fbbf24", 0.8);
  drawSparkle(ctx, S - PAD + 6, y - 8, 8, colors.accent, 1.2);

  return y + aCardH;
}

function drawCardFooter(
  ctx: CanvasRenderingContext2D,
  S: number,
  PAD: number,
  colors: CardColors,
) {
  const footerY = S - PAD + 10;

  drawZigzag(ctx, PAD, S - PAD, footerY - 38, 4, colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", 1.5);

  ctx.font = "600 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = colors.muted;
  ctx.fillText("lesswords.app", PAD, footerY);

  // Accent dot before URL
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.arc(PAD - 14, footerY - 6, 5, 0, Math.PI * 2);
  ctx.fill();

  // Right-side fun text
  ctx.fillStyle = colors.isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)";
  ctx.font = "500 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("\u2728 for entertainment purposes only", S - PAD, footerY);
  ctx.textAlign = "left";
}

export async function generateCard(
  question: string,
  answer: string,
  mode: "dark" | "light" = "dark",
): Promise<Blob> {
  const S = 1080;
  const PAD = 80;
  const CONTENT_W = S - PAD * 2;

  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get 2D canvas context");

  const colors = getCardColors(mode);

  drawBackground(ctx, S, PAD, colors);
  let y = drawLogo(ctx, PAD, PAD, colors);
  y = drawQuestionSection(ctx, question, S, PAD, CONTENT_W, y, colors);
  y = drawAnswerSection(ctx, answer, S, PAD, CONTENT_W, y, colors);
  drawCardFooter(ctx, S, PAD, colors);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))),
      "image/png",
    );
  });
}
