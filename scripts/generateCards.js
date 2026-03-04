const puppeteer = require("puppeteer");
const sharp = require("sharp");
const fs = require("fs");

const projects = [
  {
    name: "HabitForge",
    url: "https://habit-forge.app",
    stack: "React.js • Node • MongoDB • Express • TypeScript • Tailwind CSS • Grafana • Prometheus • Docker • Redis",
    file: "assets/projects/habitforge.png"
  },{
    name: "Cosmic Arch Studio",
    url: "https://www.cosmicarchstudio.in/",
    stack: "Next.js • tailwindcss • TypeScript • Vercel • framer-motion • radix-ui • strapi",
    file: "assets/projects/cosmicarchstudio.png"
  }
];

(async () => {
const puppeteer = require("puppeteer");

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

    await page.goto(project.url, { waitUntil: "networkidle2" });

    await page.setViewport({
      width: 1920,
      height: 1080
    });

    const screenshot = `tmp-${Date.now()}.png`;

    await page.screenshot({
      path: screenshot
    });
        const path = require("path");

        const dir = path.dirname(project.file);
        if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        }
    const card = await sharp({
      create: {
        width: 1920,
        height: 1080,
        channels: 3,
        background: "#0d1117"
      }
    })
      .composite([
        { input: screenshot, top: 0, left: 0 },
        {
          input: Buffer.from(
            `<svg width="1920" height="1080">
              <defs>
                <style>
                  .title { fill: white; font-size: 72px; font-weight: bold; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
                  .stack { fill: #8b949e; font-size: 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
                </style>
              </defs>
              <text x="40" y="80" class="title">${project.name}</text>
              <text x="40" y="140" class="stack">${project.stack}</text>
            </svg>`
          ),
          top: 630,
          left: 0
        }
      ])
      .png()
      .toFile(project.file);

    fs.unlinkSync(screenshot);
  }

  await browser.close();
})();