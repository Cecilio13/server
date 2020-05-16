const keys = require('../config/keys');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const tagController = require("../controllers/tag_controller");
var express = require("express");
const app = express();
const newProductTagRoutes = express.Router();
const newProductRoutes = express.Router();

let PurchaseOrder = require('../model/schema/PurchaseOrder.js')
//models
const companies = mongoose.model('companies');
const productTags = mongoose.model('product_tags');
const products = mongoose.model('products');
const users = mongoose.model('users');

//routes
module.exports = app => {
    app.get('/api/get_companies', async (req, res) => {
        const request = req.query;
        const result = await companies.find();
        res.send(result);
    });

    // Create a new Product Tag
    app.post("/product_tags/add", async (req, res) => {
        let tag = new productTags(req.body);
        tag.save()
            .then(tag => {
                res.status(200).json('tag added');
                console.log(tag);
            })
            .catch(err => {
                res.status(400).send('adding new failed')
            });
    });

    // Retrieve all Product Tags
    app.get("/product_tags", async (req, res) => {
        productTags.find(function (err, tags) {
            if (err) {
                console.log(err);
            } else {
                res.json(tags);
            }
        });
    });

    // Update a Product Tag with id
    app.post("/product_tags/update/:id", async (req, res) => {
        productTags.findById(req.params.id, function (err, tag) {
            if (!tag) {
                res.status(400).send('data not found');
            }
            else {
                tag.product_tag_name = req.body.product_tag_name;
                tag.product_tag_description = req.body.product_tag_description;
                tag.product_tag_active = req.body.product_tag_active;

                tag.save()
                    .then(tag => {
                        res.json('Tag updated')
                    })
                    .catch(err => {
                        res.status(400).send("Update not possible")
                    });
            }
        });
    });

    // Retrieve all active Product Tags
    app.get("/product_tags/active", async (req, res) => {
        productTags.find({ product_tag_active: true }, function (err, tags) {
            if (err) {
                console.log("err");
            } else {
                res.json(tags);
            }
        });
    });

    // Create a new Product
    app.post("/products/add", async (req, res) => {
        let product = new products(req.body);
        product.save()
            .then(product => {
                res.status(200).json('product added');
                console.log(product);
            })
            .catch(err => {
                res.status(400).send('adding new failed')
            });
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


    app.use('/product_tags', newProductTagRoutes);
    app.use('/products', newProductRoutes);

    //get staff data
    app.get('/staff', function(req, res){
        users.find(function(err, users){
            if(err){
                console.log('failed');
            }
            else{
                res.json(users);
            }
        });
    });

    // add staff
    app.post('/staff/add', function(req, res){
        let user = new users(req.body);
        user.save()
            .then(user => {
                res.status(200).json({'user': 'added'});
            })
            .catch(err => {
                res.status(400).send('failed adding staff');
            });
    });

    // update status active or disabled
    var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May','Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var date = new Date().getDate();
    var month = monthNames[new Date().getMonth()];
    var year = new Date().getFullYear();

    app.post('/staff/update/status', function(req, res){
        for(let i = 0; i < req.body.length; i++){
            users.findById(req.body[i]._id, function(err, user){
                if(!user){
                    res.status(400).send('id not found');
                }
                else{
                    if(user.status === req.body[i].status){
                        console.log(user.name + ' is already active');                        
                    }
                    else{
                        user.status = req.body[i].status;
                        user.action_log.push('Status changed into active at ' + date + '-'+month+'-'+year);

                        user.save()
                            .then(user => {
                                res.json('add status successful')
                            })
                            .catch(err => {
                                res.status(400).send('add status unsuccessful ' + err)
                            });
                    }
                }
            })
        }
    });
    
    //edit staff info
    app.post('/staff/edit', function(req, res){
        users.findById(req.body._id, function(err, user){
            if(!user){
                res.status(400).send('id not found');
            }
            else{
                user.name = req.body.name,
                user.position = req.body.position,
                user.email = req.body.email,
                user.address = req.body.address,
                user.birthday = req.body.birthday,
                user.username = req.body.username

                user.save()
                    .then(user => {
                        res.json('edit staff info successful')
                    })
                    .catch(err => {
                        res.status(400).send('edit staff info unsuccessful' + err)
                    });
            }
        })
    });
    
    //edit account info 
    app.post('/profile/edit', function(req, res){
        users.findById(req.body._id, function(err, user){
            if(!user){
                res.status(400).send('id not found');
            }
            else{
                user.name = req.body.name,
                user.password = req.body.password,
                user.email = req.body.email,
                user.address = req.body.address,
                user.birthday = req.body.birthday,
                user.username = req.body.username

                user.save()
                    .then(user => {
                        res.json('edit profile info successful')
                    })
                    .catch(err => {
                        res.status(400).send('edit profile info unsuccessful' + err)
                    });
            }
        })
    });

    //add note
    app.post('/staff/add_note', function(req, res){
        for(let i = 0; i < req.body.length; i++){
            users.findById(req.body[i]._id, function(err, user){
                if(!user){
                    res.status(400).send('id not found');
                }
                else{
                    user.note.push({
                        info: req.body[i].info,
                        status: req.body[i].status
                    })
                    user.save()
                        .then(user => {
                            res.json('add note successful')
                        })
                        .catch(err => {
                            res.status(400).send('add note unsuccessful' + err)
                        });
                }
            })
        }
    });

    //delete note
    app.post('/staff/delete/note', function(req, res){
        users.findById(req.body._id, function(err, user){
            if(!user){
                res.status(400).send('id not found');
            }
            else{
                user.remove(user.note)
                    .then(user => {
                        res.json('remove note successful')
                    })
                    .catch(err => {
                        res.status(400).send('remove note unsuccessful' + err);
                    })
            }
        })
    });
}
