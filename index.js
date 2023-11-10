const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/TramDB_1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define MongoDB schema
const urlSchema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
  user: String,
  userTier: Number, // Added field for user tier
});

const Url = mongoose.model('Url', urlSchema);

// Middleware for JSON parsing
app.use(express.json());

// Middleware for user tier checking
const checkTier = (req, res, next) => {
  const { longUrl, user, userTier } = req.body;
  // Check if required fields are present
  if (!longUrl || !user || !userTier) {
    return res.status(400).json({ error: 'Long URL, user, and userTier are required fields' });
  }
  if (longUrl.trim() === '' || user.trim() === '' || !Number.isInteger(userTier)) {
    return res.status(400).json({ error: 'Long URL, user, and userTier must have valid values' });
  }
  if (userTier === 1) {
    req.remainingRequests = 1000;
  } else if (userTier === 2) {
    req.remainingRequests = 100;
  } else {
    req.remainingRequests = 0;
  }
  next();
};

// Endpoint to shorten a URL
app.post('/shorten', checkTier, async (req, res) => {
  if (req.remainingRequests <= 0) {
    return res.status(429).json({ error: 'Rate limit exceeded , Does not Belong to Permitted Tier ' });
  }

  const { longUrl, user, userTier,preferredUrl } = req.body;

  // Check if the user has reached the limit
  const userRequests = await Url.countDocuments({ user });
  if (userRequests >= req.remainingRequests) {
    return res.status(429).json({ error: 'User rate limit exceeded , All Attempts are exhausted ' });
  }

  if (preferredUrl ) {
    const existingUrl = await Url.findOne({ shortUrl: preferredUrl  });
    if (existingUrl) {
      return res.status(400).json({ error: 'Preferred URL is already in use' });
    }
  }

  const shortUrl = preferredUrl || shortid.generate();

  // Save the URL and user tier to MongoDB
  const url = new Url({ longUrl, shortUrl, user, userTier });
  await url.save();

  res.json({ shortUrl,userTier });
});

// Endpoint to retrieve the history of shortened URLs by a given user
app.get('/history/:user', async (req, res) => {
  const { user } = req.params;
  const history = await Url.find({ user });
  if (!history) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ history });
});

// Endpoint to redirect to the long URL
app.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOne({ shortUrl });

  if (!url) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  res.redirect(url.longUrl);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
