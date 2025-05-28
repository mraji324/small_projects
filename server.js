const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// In-memory user store
const users = {};

// Sample games data
const games = [
  { id: 1, name: 'Chess' },
  { id: 2, name: 'Sudoku' },
  { id: 3, name: 'Tetris' },
  { id: 4, name: 'Pac-Man' },
];

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to protect dashboard route
function authMiddleware(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Routes
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render('signup', { error: 'Username and password are required.' });
  }
  if (users[username]) {
    return res.render('signup', { error: 'Username already exists.' });
  }
  users[username] = { password };
  req.session.user = username;
  res.redirect('/dashboard');
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username].password === password) {
    req.session.user = username;
    res.redirect('/dashboard');
  } else {
    res.render('login', { error: 'Invalid username or password.' });
  }
});

app.get('/dashboard', authMiddleware, (req, res) => {
  res.render('dashboard', { user: req.session.user, games });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
