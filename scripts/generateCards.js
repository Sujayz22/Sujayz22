const puppeteer = require("puppeteer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const projects = [
{
  name: "HabitForge",
  url: "https://habit-forge.app",
  stack: "React.js • Node • MongoDB • Express • TypeScript • Tailwind • Grafana • Prometheus • Docker • Redis",
  file: "assets/projects/habitforge.png"
},
{
  name: "Cosmic Arch Studio",
  url: "https://www.cosmicarchstudio.in/",
  stack: "Next.js • TailwindCSS • TypeScript • Vercel • Framer Motion • Radix UI • Strapi",
  file: "assets/projects/cosmicarchstudio.png"
}
];

(async () => {

const browser = await puppeteer.launch({
  headless: "new",
  executablePath: "/usr/bin/google-chrome",
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu"
  ]
});

const page = await browser.newPage();

for (const project of projects) {

  await page.setViewport({
    width: 1600,
    height: 900
  });

  await page.goto(project.url, { waitUntil: "networkidle2" });
// wait 10 seconds for animations, charts, fonts etc.
    await new Promise(resolve => setTimeout(resolve, 10000));
    const screenshot = `tmp-${Date.now()}.png`;

  await page.screenshot({
    path: screenshot,
    fullPage: false
  });

  const dir = path.dirname(project.file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const resizedScreenshot = await sharp(screenshot)
  .resize(1600, 900)
  .png()
  .toBuffer();

const roundedScreenshot = await sharp(resizedScreenshot)
  .composite([
    {
      input: Buffer.from(
        `<svg width="1600" height="900">
          <rect x="0" y="0" width="1600" height="900" rx="22" ry="22"/>
        </svg>`
      ),
      blend: "dest-in"
    }
  ])
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 1600,
    height: 1050,
    channels: 3,
    background: "#0d1117"
  }
})
.composite([
  {
    input: roundedScreenshot,
    top: 0,
    left: 0
  },

  {
    input: Buffer.from(`
      <svg width="1600" height="300">
        <defs>
          <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0d1117" stop-opacity="0"/>
            <stop offset="100%" stop-color="#0d1117" stop-opacity="1"/>
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1600" height="300" fill="url(#fade)"/>
      </svg>
    `),
    top: 600,
    left: 0
  },

  {
    input: Buffer.from(`
      <svg width="1600" height="150">
        <style>
          .title {
            fill: white;
            font-size: 58px;
            font-weight: 700;
            font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial;
          }

          .stack {
            fill: #8b949e;
            font-size: 32px;
            font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial;
          }

          .badge {
            fill: #39d353;
            font-size: 26px;
            font-weight: 600;
            font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial;
          }
        </style>

        <text x="60" y="65" class="title">${project.name}</text>
        <text x="60" y="115" class="stack">${project.stack}</text>

        <rect x="1350" y="30" width="170" height="60" rx="14" fill="#161b22"/>
        <text x="1385" y="70" class="badge">LIVE</text>
      </svg>
    `),
    top: 900,
    left: 0
  }
])
.png()
.toFile(project.file);

  fs.unlinkSync(screenshot);
}

await browser.close();

})();