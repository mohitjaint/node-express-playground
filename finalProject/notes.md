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