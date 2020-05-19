const express = require('express');
const mongoose = require('mongoose');

const keys = require('./config/keys');

const bodyParser = require('body-parser');

const app = express();
var cors = require('cors');
//app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
//require models
require('./model');
//apply CORS middleware
app.use(cors())
//require Routes
require('./routes/routes')(app);
//connecting to MongoDB Database
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: false });
// look for process.env.PORT for port or else use 5001 as port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log('Listening to Port ' + PORT);
});