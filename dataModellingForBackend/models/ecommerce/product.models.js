import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    category :{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    name :{
        type: String,
        required: true,
        trim: true,
    },
    description :{
        type: String,
        required: true,
        trim: true,
    },
    imageUrl :{
        type : String,
    },
    price :{
        type : Number,
        required: true,
        default : 0,
    },
    stock :{
        type : Number,
        required: true,
        default : 0,
    },
    owner :{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

export const Product = mongoose.model('Product', productSchema);