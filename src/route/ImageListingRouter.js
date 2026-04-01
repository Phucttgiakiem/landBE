import express from "express";
import ImagelistingController from "../controllers/ImagelistingController";
const router = express.Router();
router.get("/getAllImage/:id",ImagelistingController.getAllImageListing);
module.exports = router;