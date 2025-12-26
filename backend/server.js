require('dotenv').config();
const app = require('./src/app');
const cronService = require('./src/services/cronService');

// Start Background Jobs
cronService.start();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
