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
    width: 1920,
    height: 1080
  });

  await page.goto(project.url, { waitUntil: "networkidle2" });

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
    .resize(1400, 720)
    .png()
    .toBuffer();

  const card = await sharp({
    create: {
      width: 1400,
      height: 920,
      channels: 3,
      background: "#0d1117"
    }
  })
  .composite([
    {
      input: resizedScreenshot,
      top: 0,
      left: 0
    },
    {
      input: Buffer.from(`
        <svg width="1400" height="200">
          <style>
            .title {
              fill: #ffffff;
              font-size: 64px;
              font-weight: 700;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            }
            .stack {
              fill: #8b949e;
              font-size: 34px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            }
          </style>

          <rect x="0" y="0" width="1400" height="200" fill="#0d1117"/>

          <text x="50" y="90" class="title">${project.name}</text>
          <text x="50" y="150" class="stack">${project.stack}</text>

        </svg>
      `),
      top: 720,
      left: 0
    }
  ])
  .png()
  .toFile(project.file);

  fs.unlinkSync(screenshot);
}

await browser.close();

})();