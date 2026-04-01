import express from "express";
import CatagorypropertyController from "../controllers/CatagorypropertyControllers.js";


const router = express.Router();
router.post("/create",CatagorypropertyController.createCatagoryProperty);
router.put("/update/:id", CatagorypropertyController.updateCatagoryProperty);
router.get("/getAll", CatagorypropertyController.getAllCatagoryProperty);
router.delete("/delete/:id", CatagorypropertyController.deleteCatagoryProperty);

module.exports = router;