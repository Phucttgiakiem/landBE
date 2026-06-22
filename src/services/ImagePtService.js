import { Imageproperty } from "../models/Imageproperty.js";
import s3 from "../config/sufy.js";
import crypto from "crypto";
import { PutObjectCommand,DeleteObjectCommand } from "@aws-sdk/client-s3";
const createImagePtmultip = (files,listingId) => {
    return new Promise(async (resolve,reject) => {
        try {
            const imageDocs = [];
            for (const file of files){
                const extension = file.mimetype.split("/")[1];
                const fileName = `${crypto.randomUUID()}.${extension}`;

                const command = new PutObjectCommand({
                    Bucket: process.env.SUFY_BUCKET,
                    Key: fileName,
                    Body: file.buffer,
                    ContentType: file.mimetype
                });

                await s3.send(command);

                const fileUrl = `${process.env.SUFY_PUBLIC_URL}/${fileName}`;
                imageDocs.push({
                    URL: fileUrl,
                    Listing:listingId,
                })
            }
            await Imageproperty.insertMany(imageDocs);
            resolve({
                status: "OK",
                message: "SUCCESS",
            })
        } catch(e){
            reject(e);
        }
    })
}
const getAllImagewithId = (idlisting) => {
    return new Promise(async(resolve, reject) => {
        try {
            const imagearr = await Imageproperty.find({Listing:idlisting});
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: imagearr
            })
        }catch(e){
            reject(e);
        }
    })
}
const deleteImageonS3 = (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const fileName = url.split("/").pop();  
            const command = new DeleteObjectCommand({
                Bucket: process.env.SUFY_BUCKET,
                Key: fileName,
            });
            await s3.send(command);
            resolve({
                status: "OK",
                message: "Delete Image on S3 success"
            });
        } catch (e) {
            reject(e);
        }       
    });
}
const deleteImagewithId = (listimageremove) => {
    return new Promise(async (resolve, reject) => {
        try {
            for (const url of listimageremove){
                await Imageproperty.findOneAndDelete({ URL: url });
            }
            // delete image on S3
            for (const url of listimageremove){
                await deleteImageonS3(url);
            }
            resolve({
                status: "OK",
                message: "Delete Image success"
            });
        } catch (e) {
            reject(e);
        }
    })
}
const deleteAllImagewithId = async(arrId) => {
    try {
        //check input arrId
        if(!arrId || arrId.length === 0){
            return {
                status: "ERROR",
                message: "The arrayId is required"
            }
        }
        // get all image with listing id in arrId
        const listImage = await Imageproperty.find({Listing: {$in: arrId}});
        if(!listImage.length){
            return {
                status: "OK",
                message: "No images to delete"
            }
        }
        // delete image on S3
        const results = await Promise.allSettled(
            listImage.map(image => deleteImageonS3(image.URL)));

        // classify results
        const successIds = [];
        const failedIds = [];
        results.forEach((result, index) => {
            if (result.status === "fulfilled") {
                successIds.push(listImage[index]._id);
            } else {
                failedIds.push({
                    imageId: listImage[index]._id
                });
            }
        });
        // delete image in array successsfully
        if(successIds.length > 0){
            await Imageproperty.deleteMany({_id: {$in: successIds}});
        }
        return {
            status: "OK",
            message:"Delete images with listing id in array success",
        }

    } catch(e){
        return {
            status: "ERROR",
            message: e
        }
    }
}
module.exports = {
    createImagePtmultip,
    getAllImagewithId,
    deleteImagewithId,
    deleteAllImagewithId
}