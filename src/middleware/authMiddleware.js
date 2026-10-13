import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleWare = (req,res,next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                status: "error",
                message: "empty token"
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN);
        req.user = decoded;
              
        next();
        }catch(err){
            return res.status(401).json({
                status: "error",
                message: "token invalid"
            })
        }
}
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
      req.user = decoded;
    }
    next(); 
  } catch (err) {
    next(); 
  }
};
const authorizeRoles = (allowedRoles = []) => {
    return (req,res,next) => {
        if(allowedRoles.length && !allowedRoles.includes(req.user.isAdmin)){
            return res.status(403).json({
                status: "error",
                message: "you haven't permission to access this route"
            });
        }
        next();
    }
}
const authorizeOwner = (req,res,next) => {
    const userId = req.params.id || req.body.id;
    if(req.user.id !== userId){
        return res.status(403).json({
            status: "error",
            message: "the account is not yours, you can't access this route"
        });
    }
    next();
}
module.exports = {
    authMiddleWare,
    authorizeOwner,
    authorizeRoles,
    optionalAuth
}