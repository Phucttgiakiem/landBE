import express from "express";
import ListingController from "../controllers/ListingController.js";
//import {authUserMiddleWare} from "../middleware/authMiddleware";

import upload from "../middleware/upload.js";
const router = express.Router();
router.post("/create-listing",upload.array("images"),ListingController.createListing);
router.put('/update-listing/:id',ListingController.updateListing);
router.delete("/delete-listing/:id",ListingController.deleteListing);
router.get('/getAll',ListingController.getAllListing);
router.get('/me/getAll',ListingController.getAllmeListing);
router.get('/get-detail/:id',ListingController.getDetailListing);

module.exports = router;