const keys = require('../config/keys');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const tagController = require("../controllers/tag_controller");
var express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const newProductTagRoutes = express.Router();
const newProductRoutes = express.Router();

let PurchaseOrder = require('../model/schema/PurchaseOrder.js')
//models
const companies = mongoose.model('companies');
const productTags = mongoose.model('product_tags');
const products = mongoose.model('products');
const purchaseOrder = mongoose.model('purchase_orders')
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
                res.status(400).send(err)
                //console.log(err);
            });
    });
    app.get('/products', async (req, res) => {
        products.find(function (err, stock_control) {
            if (err) {
                console.log(err);
            } else {
                res.json(stock_control);
            }
        });
    });

    app.get(function (req, res) {
        let id = request.params.id;
        products.findById(id, function (err, stock_control) {
            res.json(stock_control);
        });
    });
    // Retrieve all Products
    app.get("/products", async (req, res) => {
        products.find(function (err, products) {
            if (err) {
               console.log(err); 
            } else {
                res.json(products);
            }
        });
    });

    // Retrieve all Product Variants
    app.get("/products/variants", async (req, res) => {
        let arr = [];
        products.find({}, {'variants': 1}, function (err, prodVariants) {
            if (err) {
               console.log(err); 
            } else {
                prodVariants.map((x) => arr.push(x));
                res.json(arr);
            }
        });
    });

    // Update a Product Status with id
    app.post("/products/update_status/:id", async (req, res) => {
        products.findById(req.params.id, function (err, product) {
            if (!product) {
                res.status(400).send('data not found');
            }
            else {
                product.active = req.body.active;
    
                product.save()
                .then(prod => {
                    res.json('Product status updated')
                })
                .catch(err => {
                    res.status(400).send("Update not possible")
                });
            }
        });
    });

    // Update a Product Variant Status with id
    app.post("/products/variants/update_status/:id", async (req, res) => {
        products.findById(req.params.id, function (err, product) {
            if (!product) {
                res.status(400).send('data not found');
            } else {
                //var parent_id = req.body.parent_id;
                var variant_id = req.body.id;
                var variant_status = req.body.active;
                product.variants.forEach((element, index, variants) => {
                    if (element.id === variant_id) {
                        variants[index].active = variant_status;
                    }
                });
                product.save()
                .then(prod => {
                    res.json('Product variant status updated')
                })
                .catch(err => {
                    res.status(400).send(err)
                });
            }
        });
    });

    //Process Product array bulk action and update multiple active status
    app.post("/products/bulk_action", async (req, res) => {
        let arr = [];
        arr = req.body;
        console.log(arr);
        for (let index = 0; index < arr.length; index++) {
            let product_id = arr[index].id;
            let product_active = arr[index].active;
            products.findById(product_id, function (err, product) {
                if (!product) {
                    res.status(400).send('data not found');
                } else {
                    product.active = product_active;
                    product.save()
                    .then(prod => {
                        //console.log(prod)
                    })
                    .catch(err => {
                        console.log(err)
                    });
                }
            });
        }
        res.json('Product status bulk action updated');
    });

    //Process Product variant array bulk action and update multiple active status
    app.post("/products/variants/bulk_action", async (req, res) => {
        let arr = [];
        arr = req.body;
        console.log(arr);
        for (let index = 0; index < arr.length; index++) {
            let product_id = arr[index].parent_id;
            let variant_id = arr[index].variant_id;
            let product_active = arr[index].variant_status;
            products.findById(product_id, function (err, product) {
                if (!product) {
                    res.status(400).send('data not found');
                } else {
                    product.variants.forEach((element, index, variants) => {
                        if (element.id === variant_id) {
                            variants[index].active = !product_active;
                            if (product_active === true) {
                                variants[index].active = !product_active;
                            }
                        }
                    });
                    product.save()
                    .then(prod => {
                        //console.log(prod)
                    })
                    .catch(err => {
                        console.log(err)
                    });
                }
            });
        }
        res.json('Product status bulk action updated');
    });

    app.post("/products/variants/bulk_action1", async (req, res) => {
        let arr = [];
        arr = req.body;
        console.log(arr);
        for (let index = 0; index < arr.length; index++) {
            let product_id = arr[index].parent_id;
            let variant_id = arr[index].variant_id;
            let product_active = arr[index].variant_status;
            products.findById(product_id, function (err, product) {
                if (!product) {
                    res.status(400).send('data not found');
                } else {
                    product.variants.forEach((element, index, variants) => {
                        if (element.id === variant_id) {
                            variants[index].active = product_active;
                            /*if (product_active === true) {
                                variants[index].active = !product_active;
                            }*/
                        }
                    });
                    product.save()
                    .then(prod => {
                        //console.log(prod)
                    })
                    .catch(err => {
                        console.log(err)
                    });
                }
            });
        }
        res.json('Product status bulk action updated');
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


    app.get('/purchase_orders/purchase_order', async (req, res) => {
        let x = await PurchaseOrder.find({ type: "Purchase Order" })
        res.send(x);
    });
    app.get('/purchase_orders/stock_order', async (req, res) => {
        let x = await PurchaseOrder.find({ type: "Stock Order" })
        res.send(x);
    });
    app.get('/purchase_orders/return_order', async (req, res) => {
        let x = await PurchaseOrder.find({ type: "Return Order" })
        res.send(x);
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


    app.delete("/purchase_orders/delete/:id", (req, res) => {
        purchaseOrder.findByIdAndDelete(req.params.id)
            .then(() => res.json({ remove: true }))
    });


    // Update a Product  with id
    app.post("/purchase_orders/update/:id", async (req, res) => {
        purchaseOrder.findById(req.params.id, function (err, order) {
            if (!order) {
                res.status(400).send('data not found');
            }
            else {
                order.po_no = req.body.po_no;
                order.invoice_no = req.body.invoice_no;
                order.supplier_note = req.body.supplier_note;
                order.total = req.body.total;
                order.stock_source = req.body.stock_source;
                order.due_date = req.body.due_date;
                order.received = req.body.received;
                order.type = req.body.type;
                order.status = req.body.status;
                order.po_items[0].ship_to = req.body.po_items[0].ship_to;
                order.po_items[0].bill_to = req.body.po_items[0].bill_to;
                order.po_items[0].quantity = req.body.po_items[0].quantity;
                order.po_items[0].delivery_due_date = req.body.po_items[0].delivery_due_date;
                order.po_items[0].item_cost = req.body.po_items[0].item_cost;
                order.po_items[0].tax = req.body.po_items[0].tax;
                order.po_items[0].total = req.body.po_items[0].total;

                order.save()
                    .then(tag => {
                        res.json('Update Succesful')
                    })
                    .catch(err => {
                        res.status(400).send("Update not possible")
                    });
            }
        });
    });


    // Update a Product  with Status Draft
    app.post("/purchase_orders/updated/draft", async (req, res) => {
        const data = req.body.length;
        for (let x = 0; x < data; x++) {

            purchaseOrder.findById(req.body[x], function (err, order) {
                if (!order) {
                }
                else {
                    order.status = "Draft";
                    order.save()
                        .then(tag => {
                        })
                        .catch(err => {
                        });
                }
            });

        }


    });

    // Update a Product  with Status Open
    app.post("/purchase_orders/open", async (req, res) => {
        const request = req.body;
        const data = req.body.length;
        const stats = 0;
        for (let x = 0; x < data; x++) {

            purchaseOrder.findById(req.body[x], function (err, order) {
                if (!order) {
                }
                else {
                    order.status = "Open";
                    order.save()
                        .then(tag => {
                        })
                        .catch(err => {
                        });
                }
            });

        }


    });

    // Update a Product  with Status Void
    app.post("/purchase_orders/void", async (req, res) => {
        const request = req.body;
        const data = req.body.length;
        const stats = 0;
        for (let x = 0; x < data; x++) {

            purchaseOrder.findById(req.body[x], function (err, order) {
                if (!order) {
                }
                else {
                    order.status = "Void";
                    order.save()
                        .then(tag => {
                        })
                        .catch(err => {
                        });
                }
            });

        }


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
        console.log(req.body.birthday, 'this birthday');
        console.log(typeof req.body.birthday, 'this is type of birthday');
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

    var dateToday = date+'-'+month+'-'+year;

    app.post('/staff/update/status', function(req, res){
        for(let i = 0; i < req.body.length; i++){
            users.findById(req.body[i]._id, function(err, user){
                if(!user){
                    res.status(400).send('id not found');
                }
                else{
                    if(user.status === req.body[i].status){
                        if(req.bod[i].status == true){
                            console.log(user.name + ' is already active');   
                        }                 
                        else{
                            console.log(user.name + ' is already disabled');   
                        }                            
                    }
                    else{
                        user.status = req.body[i].status;
                        if(req.body[i].status == true){
                            user.action_log.push('Status changed into active at ' + dateToday);
                        }
                        else{
                            user.action_log.push('Status changed into disabled at ' + dateToday);
                        }                        

                        user.save()
                            .then(user => {
                                res.json('update status successful')
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
                user.username = req.body.username,
                user.action_log.push('staff info edited at ' + dateToday);

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
                user.action_log.push('Profile account edited at ' + dateToday);

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
                    user.action_log.push('Note: ' + req.body[i].info + ' was added at ' + dateToday);
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
        users.findById(req.body.staff_id, function(err, user){
            if(!user){
                res.status(400).send('id not found');
            }
            else{
                for(let i = 0; i < user.note.length; i++){
                    if(user.note[i]._id == req.body.note_id){
                        user.note[i].status = false;
                        user.action_log.push('Note: ' + user.note[i].info + ' was deleted at ' + dateToday);
                        user.save()                        
                            .then(user => {
                                res.json('delete note successful')
                            })
                            .catch(err => {
                                res.status(400).send('delete note unsuccessful' + err)
                            });
                        break;
                    }
                    else{
                        continue;
                    }
                    
                }
            }
        })
        
    });
}
