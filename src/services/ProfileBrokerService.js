import mongoose from "mongoose";
import {Listing} from "../models/Listingmodel.js"
import { Users } from "../models/Usermodel.js";
import { Imageproperty } from "../models/Imageproperty.js";

const getAllNewsofBroker = (Idowner,) => {
    return new Promise(async (resolve,reject) => {
        try {
            if(Idowner){
                const owner = await Users.findOne({_id:id});
                
            }
        }catch(err){

        }
    })
}