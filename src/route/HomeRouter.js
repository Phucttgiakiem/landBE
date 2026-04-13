import express from "express";
import HomeController from "../controllers/homeControllers.js";

const router = express.Router();
router.get("/get-all",HomeController.getHomePage);

module.exports = router;