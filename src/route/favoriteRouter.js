import express from "express";
import {authMiddleWare,authorizeOwner} from "../middleware/authMiddleware.js";
import favoriteController from "../controllers/favoriteController.js";

const router = express.Router();
router.post('/create-newfavorite',authMiddleWare,authorizeOwner,favoriteController.createnewfavoriteofuser);
router.delete('/delete-likefavorite/:id/:listingId',authMiddleWare,authorizeOwner,favoriteController.deletefavoriteofuser);

module.exports = router;