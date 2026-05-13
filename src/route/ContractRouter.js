import express from "express";
import ContractController from "../controllers/ContractController";
import {authMiddleWare,authorizeOwner} from "../middleware/authMiddleware";

const router = express.Router();
router.get("/getInfoforContract",ContractController.getinfoforCreatecontract);
router.post("/createContract/:id",authMiddleWare,authorizeOwner,ContractController.createContract);
router.get("/getAllContract",ContractController.getAllContract);
router.put("/updateContract",authMiddleWare,authorizeOwner,ContractController.updateContract);
router.get("/getContractById/:id",ContractController.getContractById);
router.get("/getContractByIdnotiduser/:id",ContractController.getContractByIdnotiduser);

module.exports = router;