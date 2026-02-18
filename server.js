const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(express.json());

app.post('/api/download', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'No URL provided' });

  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(response.data);
    // Instagram video URL is often in a meta tag
    const videoUrl = $('meta[property="og:video"]').attr('content');
    if (!videoUrl) return res.status(404).json({ error: 'Video not found' });
    res.json({ videoUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

