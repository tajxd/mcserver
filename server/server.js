const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const axios = require('axios');

// Function to generate offline UUID (Minecraft format)
function offlineUUID(name) {
  const hash = crypto.createHash('md5').update(`OfflinePlayer:${name}`, 'utf8').digest();
  
  // Set version to 3 (name-based MD5)
  hash[6] = (hash[6] & 0x0f) | 0x30;
  
  // Set variant to RFC 4122
  hash[8] = (hash[8] & 0x3f) | 0x80;
  
  // Format as UUID string with dashes
  return [
    hash.toString('hex', 0, 4),
    hash.toString('hex', 4, 6),
    hash.toString('hex', 6, 8),
    hash.toString('hex', 8, 10),
    hash.toString('hex', 10, 16)
  ].join('-');
}

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://mcserver-navy.vercel.app',
    process.env.FRONTEND_URL || '*'
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// Vytvorenie uploads adresára
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Whitelist Schema
const whitelistSchema = new mongoose.Schema({
  minecraftName: {
    type: String,
    required: true,
    unique: true
  },
  uuid: {
    type: String,
    default: null
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const Whitelist = mongoose.model('Whitelist', whitelistSchema);

// Highlights Schema
const highlightsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  fileType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  thumbnail: String,
  uploadedBy: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  featured: {
    type: Boolean,
    default: false
  },
  approved: {
    type: Boolean,
    default: false
  },
  approvedBy: String,
  approvedAt: Date
});

const Highlights = mongoose.model('Highlights', highlightsSchema);

// Poll Schema
const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    votes: {
      type: Number,
      default: 0
    }
  }],
  createdBy: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  },
  voters: [{
    type: String // IP address alebo identifikátor
  }]
});

const Poll = mongoose.model('Poll', pollSchema);

// Routes
app.get('/api/whitelist', async (req, res) => {
  try {
    const whitelist = await Whitelist.find({}).select('minecraftName uuid addedAt');
    res.json(whitelist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/whitelist', async (req, res) => {
  try {
    const { minecraftName } = req.body;
    
    if (!minecraftName || minecraftName.trim() === '') {
      return res.status(400).json({ error: 'Minecraft meno je povinné' });
    }

    // Validácia Minecraft mena (3-16 znakov, len alpanumerické, _ a -)
    if (!/^[a-zA-Z0-9_-]{3,16}$/.test(minecraftName)) {
      return res.status(400).json({ error: 'Neplatné Minecraft meno' });
    }

    // Generate offline UUID for the Minecraft name
    const uuid = offlineUUID(minecraftName);

    const newEntry = new Whitelist({ minecraftName, uuid });
    await newEntry.save();
    // Notify Discord via webhook
    try {
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1443230431762710722/IeR1aj2Off5CeHf_ZgBFVHNyLe-K8k0GWmQ73CoqheZYx_VlnxovBwZO-Wb1VfS2d2tB';
      // If a numeric Discord user ID is provided in DISCORD_PING_ID, use it to ping the user.
      // Otherwise fall back to the display name provided (will NOT create a real ping).
      const pingId = process.env.DISCORD_PING_ID || '652234052710957106'; // numeric ID expected, e.g. 123456789012345678
      const displayName = '@𝕸🗡';
      const mention = pingId ? `<@${pingId}>` : displayName;
      const jsonFormat = `\`\`\`json\n{\n  "uuid": "${uuid}",\n  "name": "${minecraftName}"\n},\n\`\`\``;
      const content = `${mention} Nový whitelist:\n${jsonFormat}`;

      const body = {
        content,
      };

      // Configure allowed_mentions so that Discord actually pings the user when pingId is present.
      if (pingId) {
        body.allowed_mentions = { users: [pingId] };
      } else {
        body.allowed_mentions = { parse: [] };
      }

      await axios.post(webhookUrl, body);
    } catch (webErr) {
      console.error('Discord webhook error:', webErr.message || webErr);
    }

    res.status(201).json({ 
      success: true, 
      message: 'Úspešne ste sa pridali na whitelist!',
      data: newEntry 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Toto meno je už na whiteliste' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/whitelist/:id', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validácia administrátorských údajov
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Nesprávne prihlasovacie údaje' });
    }

    const { id } = req.params;
    const deleted = await Whitelist.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Položka nenájdená' });
    }

    res.json({ success: true, message: 'Položka vymazaná' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, token: 'admin_token_' + Date.now() });
  } else {
    res.status(401).json({ error: 'Nesprávne prihlasovacie údaje' });
  }
});

// Highlights Routes
app.get('/api/highlights', async (req, res) => {
  try {
    // Iba schválené highlights pre verejnosť
    const highlights = await Highlights.find({ approved: true }).sort({ uploadedAt: -1 });
    res.json(highlights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pending highlights pre admin
app.get('/api/highlights/pending/all', async (req, res) => {
  try {
    const { username, password } = req.query;
    
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Nesprávne prihlasovacie údaje' });
    }

    const pending = await Highlights.find({ approved: false }).sort({ uploadedAt: -1 });
    const approved = await Highlights.find({ approved: true }).sort({ uploadedAt: -1 });
    
    res.json({ pending, approved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schválenie highlights
app.post('/api/highlights/:id/approve', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Nesprávne prihlasovacie údaje' });
    }

    const highlight = await Highlights.findByIdAndUpdate(
      req.params.id,
      {
        approved: true,
        approvedBy: username,
        approvedAt: new Date()
      },
      { new: true }
    );

    res.json({ success: true, data: highlight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/highlights', express.json({ limit: '100mb' }), async (req, res) => {
  try {
    const { title, description, fileType, fileData, fileName, uploadedBy } = req.body;
    
    if (!title || !fileType || !fileData) {
      return res.status(400).json({ error: 'Všetky polia sú povinné' });
    }

    // Konverzia base64 do bufferu
    const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Uloženie súboru
    const timestamp = Date.now();
    const filePath = path.join('uploads', `${timestamp}-${fileName}`);
    fs.writeFileSync(filePath, buffer);

    // Vytvorenie záznamu
    const baseUrl = process.env.BACKEND_URL || 'https://mcserver-production-23af.up.railway.app';
    const highlight = new Highlights({
      title,
      description,
      fileType,
      filePath: `${baseUrl}/uploads/${timestamp}-${fileName}`,
      uploadedBy: uploadedBy || 'Anonymous',
      featured: false
    });

    await highlight.save();
    res.status(201).json({ success: true, data: highlight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/highlights/:id', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Nesprávne prihlasovacie údaje' });
    }

    const highlight = await Highlights.findByIdAndDelete(req.params.id);
    
    if (!highlight) {
      return res.status(404).json({ error: 'Highlight nenájdený' });
    }

    // Vymazanie súboru
    const filePath = path.join('.', highlight.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: 'Highlight vymazaný' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Poll Routes
app.get('/api/polls/active', async (req, res) => {
  try {
    const poll = await Poll.findOne({ active: true }).sort({ createdAt: -1 });
    res.json(poll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/polls', async (req, res) => {
  try {
    const { username, password } = req.query;
    
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Nesprávne prihlasovacie údaje' });
    }

    const polls = await Poll.find({}).sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/polls', async (req, res) => {
  try {
    const { username, password, question, options } = req.body;
    
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Nesprávne prihlasovacie údaje' });
    }

    // Deaktivuj všetky staré polls
    await Poll.updateMany({}, { active: false });

    const poll = new Poll({
      question,
      options: options.map(opt => ({ text: opt, votes: 0 })),
      createdBy: username
    });

    await poll.save();
    res.status(201).json({ success: true, data: poll });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/polls/:id/vote', async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const voterIp = req.ip || req.connection.remoteAddress;

    const poll = await Poll.findById(req.params.id);
    
    if (!poll || !poll.active) {
      return res.status(404).json({ error: 'Poll nie je aktívny' });
    }

    // Skontroluj či už hlasoval
    if (poll.voters.includes(voterIp)) {
      return res.status(400).json({ error: 'Už si hlasoval!' });
    }

    // Pridaj hlas
    poll.options[optionIndex].votes += 1;
    poll.voters.push(voterIp);
    
    await poll.save();
    res.json({ success: true, data: poll });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/polls/:id', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Nesprávne prihlasovacie údaje' });
    }

    await Poll.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server je spustený na http://localhost:${PORT}`);
});
