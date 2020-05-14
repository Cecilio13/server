const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
const app = express();
const uri = "mongodb+srv://yudz:AdDU2201400119084W@cluster0-hu5gv.gcp.mongodb.net/OJTAPP?retryWrites=true&w=majority";

const stockControlRoutes = express.Router();


var cors = require('cors');
app.use(bodyParser.json());


//require models
require('./model');
//apply CORS middleware
app.use(cors())
//require Routes
require('./routes/routes')(app);
//connecting to MongoDB Database
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: false });
// look for process.env.PORT for port or else use 5001 as port
const connection = mongoose.connection;

const PORT =  5001;
app.listen(PORT, () => {
    console.log('Listening to Port ' + PORT);
});
connection.once('open', function () {
    console.log("MongoDB is Connected!")
})

