const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const po_items = new Schema({
    product: [{ type: Schema.Types.ObjectId, ref: 'products' }],
    bill_to: String,
    ship_to: String,
    delivery_due_date: Date,
    quantity: Number,
    item_cost: Number,
    tax: Number,
    total: Number,
    created_at: Date,
    updated_at: Date,
})
const POSchema = new Schema({

    po_no: String,
    invoice_no: String,
    supplier_note: String,
    total: Number,
    supplier: [{ type: Schema.Types.ObjectId, ref: 'suppliers' }],
    stock_source: String,
    entry_by: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    received_by: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    due_date: Date,
    received: {
        Type: Boolean,
        default: false
    },
    type: String,
    po_items: [po_items],
    status: String,
    created_at: Date,
    updated_at: Date,
})
POSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }

    next();
});
po_items.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }

    next();
});
module.exports = mongoose.model('purchase_orders', POSchema);
