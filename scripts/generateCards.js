const puppeteer = require("puppeteer");
const sharp = require("sharp");
const fs = require("fs");

const projects = [
  {
    name: "HabitForge",
    url: "https://habit-forge.app",
    stack: "Next.js • Node • MongoDB",
    file: "assets/projects/habitforge.png"
  }
];

(async () => {
 const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], });
  const page = await browser.newPage();

  for (const project of projects) {

    await page.goto(project.url, { waitUntil: "networkidle2" });

    await page.setViewport({
      width: 1200,
      height: 630
    });

    const screenshot = `tmp-${Date.now()}.png`;

    await page.screenshot({
      path: screenshot
    });

    const card = await sharp({
      create: {
        width: 1200,
        height: 760,
        channels: 3,
        background: "#0d1117"
      }
    })
      .composite([
        { input: screenshot, top: 0, left: 0 },
        {
          input: Buffer.from(
            `<svg width="1200" height="130">
              <style>
                .title { fill: white; font-size: 42px; font-family: Arial }
                .stack { fill: #9da5b4; font-size: 28px; font-family: Arial }
              </style>
              <text x="40" y="60" class="title">${project.name}</text>
              <text x="40" y="110" class="stack">${project.stack}</text>
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