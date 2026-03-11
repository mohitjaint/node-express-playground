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

## Lecture 9

1. Mongoose provide middlewares like pre (you can perform some task just before the data is stored) and post (you can perform some task just after the data is stored), and many more. Example :
```js
userSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})
```
- here we are encrypting the password using bcrypt just before saving it. 

2. We can also create methods for a particular schema in mongoose, example :
```js
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email : this.email,
            fullName : this.fullName,
        }, //payload
        process.env.ACCESS_TOKEN_SECRET, //secret,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        } //expiry
    )
}
```

## Lecture 10

1. Middleware : "Jaate huye mujhse milkar jana"
2. While uploading a file we save it temporarily on our server.
3. Then we attempt to upload it on cloudinary.
4. After that we unlink the file path. <span style = "color:red">Delete the file from local system (server)</span>

5. Cloundinary method : 
```js
const uploadOnCloudinary = async (filePath) => {
    try {
        if(!filePath) {
            throw new Error('File path is required');
        }
        //upload the file to cloudinary
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type : 'auto',

        })
        //file has been uploaded successfully.
        console.log('File uploaded successfully', response.url);

        fs.unlinkSync(filePath); // remove the locally saved temporary file as it has been uploaded to cloudinary successfully.

        return response;
    }
    catch (error) {
        fs.unlinkSync(filePath); // remove the locally saved temporary file as uploading to cloudinary failed.
        return null;
    }
}
```

6. Multer middleware : 
```js
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

export const upload = multer(
    { 
        storage: storage 
    }
);
```

## Lecture 12

#### In this lecture we studied about routers, how to define them and how they works
#### We also made a basic controller

```js
import {asyncHandler} from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message : "ok"
    })
});

export {registerUser};
```

- Basic router : 
```js
import {Router} from 'express';
import { registerUser } from '../controllers/user.controller.js';

const router = Router();

router.route("/register").post(registerUser);

export default router;
```

- app.js
```js 
//routes import 

import userRouter from "./routes/user.routes.js";

//routes declaration

app.use("/api/v1/users", userRouter);
```
-  When we will visit ```http//localhost:8000/api/v1/users```, the server will pass it to the router, then the router will route it to ```http//localhost:8000/api/v1/users/register```, now the controller will be called, and controller will send the response we set. Here it is 
```js
res.status(200).json({
    message : "ok"
})
```

---
## Lecture 16

- When making the logout method, we require the user details like _id and access tokens. But its not appropriate to ask them to user when clicking the logout button.
- To solve this problem we use a middleware to extract this info for us.

- ```verifyJWT``` middleware :
```js
export const verifyJWT = async(req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorized");
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401, "Invalid access token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized");
    }
}
```
- It uses cookies to extract the user object, then this object is passed to next method (another middleware or controller).

---

## Lecture 17

- We handle text and file updation differently because : 

| Text Data           | Image/File Data                |
| ------------------- | ------------------------------ |
| JSON                | multipart/form-data            |
| Simple request      | Requires file parsing (Multer) |
| No external storage | Needs Cloudinary / S3          |
| Small payload       | Large payload                  |
