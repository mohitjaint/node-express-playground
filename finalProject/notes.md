## Lecture 6

1. When we want the git to track empty folders, we make a .gitkeep file in that folder.
2. When making a change in file during backend development, we have to restart the backend to see the changes, there are many tool to automate that. The one we are using is nodemon. So instead of using ``` npm i ``` we will use ``` npm i -D nodemon``` -D is used for dev dependencies, so when building the project it will not be used. 

## Lecture 7

1. Don't connect db in one line. db connection takes time so use async method.
```js
onst connectDB = async () =>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`\nConnected to MongoDB. DB Host : ${connectionInstance.connection.host}`);                            
    }
    catch(err){
        console.log("Error: ",err);
        process.exit(1)
    }
}
```
2. Study about process method.
3. While importing db in index file, don't forget to write the full path with extension
```js
import connectDB from "./db/index.js";
```

## Lecture 8

1. Check what is there in the Error class and why we set it to null usually.
2. Study what this code chunk do :
```js
if(stack){
            this.stack = stack;
}
else {
    Error.captureStackTrace(this, this.constructor);
}
```