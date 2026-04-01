import express from "express";
import userController from "../controllers/UserController";
import {authMiddleWare,authUserMiddleWare} from "../middleware/authMiddleware";

const router = express.Router();
router.post("/sign-up",userController.createUser);
router.post("/sign-in",userController.loginUser);
router.put("/resetpassword-user",userController.resetpass);
router.put("/change-password/:id",authUserMiddleWare,userController.changePass);
router.post("/log-out",userController.logoutUser);
router.put('/update-user/:id',authUserMiddleWare,userController.updateUser);
router.delete("/delete-user/:id",authMiddleWare, userController.deleteUser);
router.get('/getAll',userController.getAllUser);
router.get('/get-details/:id',authUserMiddleWare,userController.getDetailsUser);
router.post('/refresh-token',userController.refreshToken);

module.exports = router;