const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const cookieSession = require('cookie-session');
const expressLayouts = require('express-ejs-layouts');

// Routes imports
const mainRoutes = require('./router/mainRoutes');
const shopRoutes = require('./router/shopRoutes');
const adminRoutes = require('./router/adminRoutes');
const authRoutes = require('./router/authRoutes');

const app = express();

// Static files
app.use(express.static(path.resolve(__dirname, '../public')));

// Template Engine
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './views'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout'); // Default layout if you have one, or remove if not using strict layouts yet

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
    res.status(404).render('404', { title: 'Página no encontrada' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

module.exports = app;
