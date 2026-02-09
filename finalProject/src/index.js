//require("dotenv").config({path: "./.env"});

import connectDB from "./db/index.js";
import dotenv from "dotenv";
import {app} from "./app.js";

dotenv.config({path: "./.env"});

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
})
.catch((err)=>{
    console.log("MONGO db connection failed : ", err);
    throw err;
});

/*
import express from "express";

const app = express();

( async()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        app.on("error",(error)=>{
            console.log("Error: ", error);
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    }
    catch(err){
        console.log("Error: ",err);
        throw err;
    }
})()

*/