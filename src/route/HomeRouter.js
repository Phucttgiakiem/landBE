import express from "express";
import HomeController from "../controllers/homeControllers.js";

const router = express.Router();
router.get("/get-all",HomeController.getHomePage);
router.get("/get-listing-related",HomeController.getListingRelated);

module.exports = router;