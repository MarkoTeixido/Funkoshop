const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const cookieSession = require('cookie-session');

// Routes imports
const mainRoutes = require('./router/mainRoutes');
const shopRoutes = require('./router/shopRoutes');
const adminRoutes = require('./router/adminRoutes');
const authRoutes = require('./router/authRoutes');

const app = express();

// Static files
app.use(express.static(path.resolve(__dirname, '../public')));

// Template Engine - REMOVED

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(require('cors')());

// Session
app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET_1 || 'S3cr3t01', process.env.SESSION_SECRET_2 || 'S3cr3t02'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Routes
app.use('/', mainRoutes);
app.use('/shop', shopRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found', message: 'The requested resource could not be found.' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: 'Algo salió mal!' });
});

module.exports = app;
