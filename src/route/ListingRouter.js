import express from "express";
import ListingController from "../controllers/ListingController.js";
import {authMiddleWare,authorizeRoles,authorizeOwner} from "../middleware/authMiddleware";

import upload from "../middleware/upload.js";
const router = express.Router();
router.post("/create-listing",upload.array("images"),ListingController.createListing);
router.put('/update-listing/:id',authMiddleWare,authorizeRoles(["admin","sell-user"]),upload.array("images"),ListingController.updateListing);
router.patch("/softdelete-listing/:id",authMiddleWare,authorizeOwner,ListingController.deleteListing);
router.delete("/delete-listing/:id",authMiddleWare,authorizeOwner,ListingController.deleteListing);
router.patch("/restore-listing/:id",authMiddleWare,authorizeOwner,ListingController.restoreListing);
router.get('/me/getAllDeleted/:id',authMiddleWare,authorizeOwner,ListingController.getAllListingDeleted); 
router.get('/getAll',ListingController.getAllListing);
router.get('/me/getAll',ListingController.getAllmeListing);
router.get('/get-detail/:id',ListingController.getDetailListing);
router.get('/searchpropery',ListingController.getTitleproperty);

module.exports = router;