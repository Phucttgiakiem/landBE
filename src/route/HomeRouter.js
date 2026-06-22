import express from "express";
import HomeController from "../controllers/homeControllers.js";
import {optionalAuth} from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/get-all",HomeController.getHomePage);
router.get("/get-listing-related",HomeController.getListingRelated);
router.get("/get-listing-filter",HomeController.getListingFilter);
router.get("/getAllListingofbroder",HomeController.getAllpropertyofbroker);

module.exports = router;