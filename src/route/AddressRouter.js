import express from "express";
import AddressController from "../controllers/AddressControllers";

const router = express.Router();
router.get("/getProvinces",AddressController.getProvinces);
router.get("/getCommune/:code",AddressController.getCommune);

module.exports = router;