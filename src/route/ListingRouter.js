import express from "express";
import ListingController from "../controllers/ListingController.js";
//import {authUserMiddleWare} from "../middleware/authMiddleware";

import upload from "../middleware/upload.js";
const router = express.Router();
router.post("/create-listing",upload.array("images"),ListingController.createListing);
router.put('/update-listing/:id',upload.array("images"),ListingController.updateListing);
router.patch("/softdelete-listing",ListingController.deleteListing);
router.delete("/delete-listing",ListingController.deleteListing);
router.patch("/restore-listing",ListingController.restoreListing);
router.get('/me/getAllDeleted',ListingController.getAllListingDeleted);
router.get('/getAll',ListingController.getAllListing);
router.get('/me/getAll',ListingController.getAllmeListing);
router.get('/get-detail/:id',ListingController.getDetailListing);

module.exports = router;