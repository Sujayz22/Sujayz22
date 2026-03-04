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
    input: resizedScreenshot,
    top: 0,
    left: 0
  },
  {
    input: Buffer.from(`
      <svg width="1600" height="150">
        <style>
          .title {
            fill: #ffffff;
            font-size: 60px;
            font-weight: 700;
            font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial;
          }
          .stack {
            fill: #8b949e;
            font-size: 34px;
            font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial;
          }
        </style>

        <rect x="0" y="0" width="1600" height="150" fill="#0d1117"/>

        <text x="60" y="70" class="title">${project.name}</text>
        <text x="60" y="120" class="stack">${project.stack}</text>
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