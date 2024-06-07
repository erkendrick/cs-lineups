require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const SQLiteStore = require('connect-sqlite3')(session);

const imageRoutes = require('./routes/images');
const filterRoutes = require('./routes/filters');
const uploadRoutes = require('./routes/upload');
const deleteRoutes = require('./routes/delete');
const testRoutes = require('./routes/test');

const app = express();
const PORT = 3001;

// passport config
passport.use(new LocalStrategy((username, password, done) => {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPasswordHash = process.env.ADMIN_PASSWORD;
    if (username !== adminUsername) {
        return done(null, false, { message: 'Incorrect username' });
    }
    bcrypt.compare(password, adminPasswordHash, (err, isMatch) => {
        if (err) return done(err);
        if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
        return done(null, { id: 1, username: adminUsername });
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    if (id === 1) {
        return done(null, { id: 1, username: process.env.ADMIN_USERNAME });
    } else {
        return done(new Error('Invalid user ID'));
    }
})

// middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://192.168.1.51:3000',
    'https://your-production-domain.com'
];

app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(session({
    store: new SQLiteStore({ db: 'sessions.db', dir: './db'}),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log(`Session ID: ${req.sessionID}`);
    console.log(`Session:`, req.session);
    next();
});

// authentication routes
app.post('/login', (req, res, next) => {
    console.log('Login request body:', req.body);
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Authentication error:', err);
            return next(err);
        }
        if (!user) {
            console.error('Authentication failed:', info);
            return res.status(400).send(info);
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Login error:', err);
                return next(err);
            }
            res.send({ message: 'Logged in successfully' });
        });
    })(req, res, next);
});

app.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send({ message: 'Logout failed' });
        }
        res.send({ message: 'Logged out successfully' });
    });
});

// routes, specific routes are protected inside the routes modules
app.use('/api/images', imageRoutes);
app.use('/api/filters', filterRoutes);
app.use('/api/images', uploadRoutes);
app.use('/api/images', deleteRoutes);
app.use('/api/test', testRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'An internal error occurred' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
