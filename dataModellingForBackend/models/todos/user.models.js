import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true
        },
        password : {
            type : String,
            required : [true, 'Password is required'] // Custom error message if password is not provided
        },
        isActive : Boolean
    },
    {
        timestamps : true // Automatically add createdAt and updatedAt fields
    }
)

export const User = mongoose.model('User', userSchema); // Make a mode 'User' using userSchema and export it.