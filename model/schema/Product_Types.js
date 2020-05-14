const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const ProductTypeSchema = new Schema({
    product_type_name: String,
    product_type_description: String,
    product_type_active: {
        type: Boolean,
        default: true,
    },
    created_at: Date,
    updated_at: Date,
})
ProductTypeSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});
ProductTypeSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }

    next();
});

mongoose.model('product_types', ProductTypeSchema);
