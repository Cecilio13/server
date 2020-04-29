const keys = require('../config/keys');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//models
const companies = mongoose.model('companies');
module.exports = app => {
    app.get('/api/get_companies', async (req, res) => {
        const request = req.query;
        const result = await companies.find();
        res.send(result);
    });
}