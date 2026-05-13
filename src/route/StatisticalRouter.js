import express from "express";
import StatisticalController from "../controllers/StatisticalController";

const router = express.Router();
router.get("/StatisticalbyType",StatisticalController.StatisticalbyType);
router.get("/getAllowners",StatisticalController.getAllowners);

module.exports = router;