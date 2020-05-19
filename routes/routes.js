const keys = require('../config/keys');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const tagController = require("../controllers/tag_controller");
var express = require("express");
const app = express();
const newProductTagRoutes = express.Router();
const newProductRoutes = express.Router();

//models
const companies = mongoose.model('companies');
const productTags = mongoose.model('product_tags');
const products = mongoose.model('products');

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
    
    app.use('/product_tags', newProductTagRoutes);
    app.use('/products', newProductRoutes);
}