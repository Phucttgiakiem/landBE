import { Imageproperty } from "../models/Imageproperty.js";
import s3 from "../config/sufy.js";
import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
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
module.exports = {
    createImagePtmultip,
    getAllImagewithId
}