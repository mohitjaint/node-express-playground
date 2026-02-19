import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (filePath) => {
    try {
        //console.log("Uploading file to Cloudinary:", filePath);
        if(!filePath) {
            throw new Error('File path is required');
        }
        //upload the file to cloudinary
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type : 'auto',

        })
        //file has been uploaded successfully.
        //console.log('File uploaded successfully', response.url);

        fs.unlinkSync(filePath); // remove the locally saved temporary file as it has been uploaded to cloudinary successfully.

        return response;
    }
    catch (error) {
        fs.unlinkSync(filePath); // remove the locally saved temporary file as uploading to cloudinary failed.
        console.error('Error uploading file to Cloudinary:', error);
        return null;
    }
}


export default uploadOnCloudinary;

