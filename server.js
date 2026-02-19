const express = require('express');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

async function getBrowser() {
  try {
    console.log('Getting Chromium executable path...');
    const executablePath = await chromium.executablePath();
    console.log('Chromium path:', executablePath);
    
    console.log('Launching Puppeteer with args:', chromium.args);
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
    });
    console.log('Browser launched successfully');
    return browser;
  } catch (error) {
    console.error('Failed to launch browser:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

app.post('/api/download', async (req, res) => {
  console.log('Received download request:', req.body);
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  if (!url.includes('instagram.com')) {
    return res.status(400).json({ error: 'Please provide a valid Instagram URL' });
  }

  let browser;
  let page;
  try {
    console.log('Launching browser...');
    browser = await getBrowser();
    page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('Navigating to:', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    
    console.log('Extracting video URL...');
    const videoUrl = await page.evaluate(() => {
      const video = document.querySelector('video');
      if (video && video.src) {
        return video.src;
      }
      
      const metaVideo = document.querySelector('meta[property="og:video"]');
      if (metaVideo) {
        return metaVideo.getAttribute('content');
      }
      
      const metaVideoSecure = document.querySelector('meta[property="og:video:secure_url"]');
      if (metaVideoSecure) {
        return metaVideoSecure.getAttribute('content');
      }
      
      return null;
    });
    
    await page.close();
    await browser.close();
    
    if (videoUrl) {
      console.log('Video URL found');
      return res.json({ videoUrl });
    }
    
    console.log('No video URL found');
    return res.status(404).json({ error: 'Could not find video URL' });
    
  } catch (err) {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    return res.status(500).json({ error: `Failed to fetch video: ${err.message}` });
  }
});

const path = require("path");

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

