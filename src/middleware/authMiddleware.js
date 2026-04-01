import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleWare = (req,res,next) => {
    //console.log("authMiddleware called",req.headers.token);
    const token = req.headers.token.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN,function(err,user){
        if(err){
            return res.status(404).json({
                status: "error",
                message: "the authentication",
            })
        }
        if(user?.isAdmin == "Admin"){
            next();
        }else {
            return res.status(404).json({
                status: "error",
                message: "The authentication",
            })
        }
    })
}
const authUserMiddleWare = (req,res,next) => {
    const token = req.headers.token.split(' ')[1];
    const userId = req.params.id || req.body.id;
    jwt.verify(token, process.env.ACCESS_TOKEN,function(err,user){
        if(err){
            return res.status(404).json({
                status: "error",
                message: "the authentication",
            })
        }
        if(user?.id === userId){
            next();
        }else {
            return res.status(404).json({
                status: "error",
                message: "The authentication",
            })
        }
    })
}
module.exports = {
    authMiddleWare,
    authUserMiddleWare
}