const keys = require('../config/keys');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const express = require('express')
const app = express();
const newPurchaseOrderRoutes = express.Router();
const transactionOrderRoutes = express.Router();
const purchaseOrder = express.Router();

let PurchaseOrder = require('../model/schema/PurchaseOrder.js')
//models
const companies = mongoose.model('companies');
module.exports = app => {
    app.get('/api/get_companies', async (req, res) => {
        const request = req.query;
        const result = await companies.find();
        res.send(result);
    });

    app.get('/purchase_orders', async (req, res) => {
        PurchaseOrder.find(function (err, stock_control) {
            if (err) {
                console.log(err);
            } else {
                res.json(stock_control);
            }
        });
    });

    app.get(function (req, res) {
        let id = request.params.id;
        PurchaseOrder.findById(id, function (err, stock_control) {
            res.json(stock_control);
        });
    });

    app.post('/purchase_orders/add', async (req, res) => {
        let stock_control = new PurchaseOrder(req.body);
        stock_control.save()
            .then(stock_control => {
                res.status(200).json({ 'Purchase Order': 'New Transaction Order Added' });
            })
            .catch(err => {

                res.status(400).send(err)
            });
    });

}
