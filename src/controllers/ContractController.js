import ContractService from "../services/ContractService";

const getinfoforCreatecontract = async (req,res) => {
    try {
        const iduser = req.query.iduser;
        const response = await ContractService.getinfoforCreatecontract(iduser);
        return res.status(200).json(response);
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message:err
        })
    }
}
const createContract = async (req,res) => {
    try {
        //sửa key tới tenantfullName
        const iduser = req.user.id;
        const {idproperty,idbuyer,idtenant,typecontract,price,deposit,startdate,enddate,
                paymentMethod,transferDate,statusContract,fullnamebuyer,idNumberbuyer,addressbuyer,fullnameowner,idNumberowner,addressowner,
                fullnametenant,idNumbertenant,addresstenant,titleproperty,addressproperty,areaproperty,term
        } = req.body;
        if(!typecontract){
            return res.status(400).json({
                status: "error",
                message: "các trường nhập không được để trống"
            });
        }
        if((typecontract === "rent" && (!idproperty || !idtenant || !idNumbertenant || !startdate || !enddate || !deposit || !idNumberowner || !statusContract))||
           ( typecontract === "sale" && (!idproperty || !idbuyer || !idNumberbuyer || !paymentMethod || !transferDate || !idNumberowner || !statusContract))
        ){
            return res.status(400).json({
                status: "error",
                message: "các trường nhập không được để trống"
            });
        }
        const response = await ContractService.createContract(iduser,req.body);
        if(response.status === "error") {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:err
        })
    }
}
const getAllContract = async (req,res) => {
    try {
        const { limit,page,sort,filter,user,role} = req.query;
        
        console.log("data query",req.query);    
        const parsedSort = sort ? JSON.parse(sort) : null;
        const response = await ContractService.getAllContract(Number(page) || 1,Number(limit) || 8,parsedSort,filter,user,role);
        return res.status(200).json(response);
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message: e
        });
    }
}
const updateContract = async (req,res) => {
    try {
        const userId = req.user.id;
        const {idcontract,statusContract} = req.body;
        if(!idcontract || !statusContract){
            return res.status(400).json({
                status: "error",
                message: "các trường nhập không được để trống"
            });
        }
        const response = await ContractService.updateContract(idcontract,userId,req.body);
        if(response.status === "error"){
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    }catch(err){
        console.log(err);
        return res.status(500).json({   
            message:err
        })
    }
}
const getContractById = async (req,res) => {
    try {
        const idcontract = req.params.id;
        const iduser = req.query.iduser;
        const response = await ContractService.getContractById(idcontract,iduser);
        return res.status(200).json(response);
    }catch(err){
        console.log(err);
        return res.status(500).json({   
            message:err
        })
    }
}
const getContractByIdnotiduser = async (req,res) => {
    try {
        const idcontract = req.params.id;
        const response = await ContractService.getContractByIdnotiduser(idcontract);
        return res.status(200).json(response);
    }catch(err){
        return res.status(500).json({
            message:err
        })
    }
}
module.exports = {
    getinfoforCreatecontract,
    createContract,
    getAllContract,
    updateContract,
    getContractById,
    getContractByIdnotiduser
}