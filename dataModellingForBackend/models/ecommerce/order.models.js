import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    productId :{
        type : mongoose.Schema.Types.ObjectI,
        ref : "Product",
    },
    quantity :{
        type : Number,
        required : true,
    }
});

const orderSchema = new mongoose.Schema({
    orderPrice :{
        type : Number,
        required: true,
    },
    customer :{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems : {
        type : [orderItemSchema]
    },
    address : {
        type : String,
        required : true,
    },
    status:{
        type : String,
        enum : ['pending', 'shipped', 'delivered', 'cancelled'], // enum -> choices
        default : 'pending',
    }
}, {timestamps: true});

export const Order = mongoose.model('Order', orderSchema);