const express = require("express");
const app = express();
const cors = require("cors");
const methodOverride = require("method-override");

// Connect to database
const sequelize = require('./app/config/db.config.js');

// Test database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection DATABASE successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/app/views');


app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));


// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

//Import route application
const route = require("./app/routes/index.js")
// Routes
route(app)

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));