require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jiraRoutes = require('./routes/jiraRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', jiraRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
