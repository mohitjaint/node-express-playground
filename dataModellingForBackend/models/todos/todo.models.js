import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
    {
        content :{
            type : String,
            required : true,
            trim : true
        },
        completed : {
            type : Boolean,
            default : false
        },
        createdBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User', //It is the same name as the model name in user.models.js
            required : true
        },
        subTodos : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'SubTodo' 
            }
        ] // Array of ObjectIds referencing the SubTodo model
    },{timestamps : true});

export const Todo = mongoose.model('Todo', todoSchema);