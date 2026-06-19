import express from "express";
import userController from "../controllers/UserController";
import {authMiddleWare,authorizeRoles,authorizeOwner} from "../middleware/authMiddleware";

const router = express.Router();
router.post("/sign-up",userController.createUser);
router.post("/sign-in",userController.loginUser);
router.put("/resetpassword-user",userController.resetpass);
router.put("/change-password/:id",authMiddleWare,authorizeOwner,userController.changePass);
router.post("/log-out",userController.logoutUser);
router.get("/verify-email",userController.verifyEmail);
router.post("/resend-verification-email",userController.resendVerifyEmail);
router.put('/update-user/:id',authMiddleWare,authorizeOwner,userController.updateUser);
router.delete("/delete-user/:id",authMiddleWare,authorizeOwner, userController.deleteUser);
router.get('/getAll',authMiddleWare,authorizeRoles(["admin"]),userController.getAllUser);
router.get('/getAllowner',authMiddleWare,authorizeRoles(["admin"]),userController.getAllowner);
router.get('/get-details/:id',authMiddleWare,authorizeOwner,userController.getDetailsUser);
router.get('/get-detailUser/:id',authMiddleWare,authorizeRoles(["admin"]),userController.getDetailsUser);
router.post('/refresh-token',userController.refreshToken);

module.exports = router;