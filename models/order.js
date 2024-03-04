const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const addressSchema = new mongoose.Schema({
    name: { type: String },
    phoneNumber: { type: String },
    street: { type: String },
    city: { type: String },
    landmark: { type: String },
    state: { type: String },
    pincode: { type: String }
});


const orderSchema = new mongoose.Schema({
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    shippingAddress: { type: addressSchema },
    paymentMode: { type: String },
    status: { type: String, enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'placed' }
});

module.exports = mongoose.model('Order', orderSchema);
