require('dotenv').config();
require('./src/database/dbconfig/DB_mongodb_connection');

const Utilities = require('./src/Utilities');
const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, './public')));
app.use(cookieParser());

// Serve the React frontend
app.use(express.static(path.join(__dirname, './admin_panel/build')));

// API routes
app.use(require('./src/Routes'));

// Catch-all route for handling other requests and serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './admin_panel/build', 'index.html'), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// Error handling middleware
app.use(logger('dev'));
app.use(Utilities.send404);
app.disable('x-powered-by');

// Start the server
const server = app.listen(process.env.PORT || process.env.APP_PORT, () => {
  console.log(
    `********** Server is running on  http://localhost:${server.address().port}  **********`,
  );
})
.on('error', (error) => {
  console.log(
    '********** \x1b[31mPort ' + error.port + ' is already in use\x1b[0m **********',
  );
});
