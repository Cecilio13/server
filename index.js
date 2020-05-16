const express = require('express');
const mongoose = require('mongoose');

const keys = require('./config/keys');

const bodyParser = require('body-parser');

const app = express();
var cors = require('cors');
app.use(bodyParser.json());
//require models
require('./model');
//apply CORS middleware
app.use(cors())
//require Routes
require('./routes/routes')(app);
//connecting to MongoDB Database
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Congratulatiions! Your mongo db connection is successful');
});
// look for process.env.PORT for port or else use 5001 as port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log('Listening to Port ' + PORT);
});