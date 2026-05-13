import express from "express";
import DashboardController from "../controllers/DashboardControllers";

const router = express.Router();
router.get("/admin/overview",DashboardController.getAdminOverview);
router.get("/seller/overview",DashboardController.getSellerOverview);
router.get("/user/overview",DashboardController.getUserOverview);
module.exports = router;