const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let browser = null;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return browser;
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

  let page;
  try {
    console.log('Launching browser...');
    const browser = await getBrowser();
    page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('Navigating to:', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    console.log('Extracting video URL...');
    const videoUrl = await page.evaluate(() => {
      // Try multiple selectors
      const video = document.querySelector('video');
      if (video && video.src) {
        return video.src;
      }
      
      // Look for video in meta tags
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
    
    if (videoUrl) {
      console.log('Video URL found');
      return res.json({ videoUrl });
    }
    
    console.log('No video URL found');
    return res.status(404).json({ error: 'Could not find video URL' });
    
  } catch (err) {
    console.error('Error:', err.message);
    if (page) await page.close();
    res.status(500).json({ error: 'Failed to fetch video' });
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

