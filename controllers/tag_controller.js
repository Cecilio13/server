let Tags = require('../model/schema/Product_Tags')
//const ProductTag = db.productTags;

// Create and Save a new Product Tag
exports.create = (req, res) => {
  // Validate request
  if (!req.body.product_tag_name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // Create a Product Tag
  /*const tag = new ProductTag({
    product_tag_name: req.body.product_tag_name,
    product_tag_description: req.body.product_tag_description,
    product_tag_active: req.body.product_tag_active ? req.body.product_tag_active : false
  });*/
  // Save Product Tag in the database
  let tag = new Tags(req.body);
  tag
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating a Product Tag."
      });
    });
};

// Retrieve all Product Tags from the database.
exports.findAll = (req, res) => {
    const name = req.query.product_tag_name;
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

    ProductTag.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving product tags."
      });
    });
};

// Find a single Product Tag with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    ProductTag.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Product Tag with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Product Tag with id=" + id });
    });
};

// Update a Product Tag by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
    }
    
    const id = req.params.id;

    ProductTag.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Product Tag with id=${id}. Maybe Product Tag was not found!`
        });
      } else res.send({ message: "Product Tag was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Product Tag with id=" + id
      });
    });
};

// Delete a Product Tag with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    ProductTag.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Product Tag with id=${id}. Maybe Product Tag was not found!`
        });
      } else {
        res.send({
          message: "Product Tag was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Tags from the database.
exports.deleteAll = (req, res) => {
    ProductTag.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Product Tags were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all product tags."
      });
    });
};

// Find all active Tags
exports.findAllActive = (req, res) => {
    ProductTag.find({ product_tag_active: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving product tags."
      });
    });
};