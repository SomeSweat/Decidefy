const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// in-memory store of decisions and arguments
const decisions = {
  coffee: {
    label: 'Drink coffee',
    pro: ['Boosts alertness', 'Tastes good'],
    contra: ['May cause jitters', 'Can disrupt sleep']
  },
  tea: {
    label: 'Drink tea',
    pro: ['Relaxing', 'Lots of varieties'],
    contra: ['Caffeine still present', 'May be expensive']
  },
  code: {
    label: 'Write code',
    pro: ['Builds skills', 'Creates value'],
    contra: ['Tiring eyes', 'Can be frustrating']
  }
};

app.get('/api/decisions', (req, res) => {
  // return array of {key, label}
  const list = Object.entries(decisions).map(([key, val]) => ({ key, label: val.label }));
  res.json(list);
});

app.get('/api/arguments/:decision', (req, res) => {
  const { decision } = req.params;
  const entry = decisions[decision];
  if (!entry) {
    return res.status(404).json({ error: 'Decision not found' });
  }
  res.json({ pro: entry.pro, contra: entry.contra });
});

// fallback to index for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));