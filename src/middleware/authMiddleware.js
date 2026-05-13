import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleWare = (req,res,next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                status: "error",
                message: "Không có token"
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN);
        req.user = decoded;
              
        next();
        }catch(err){
            console.log(err);
            return res.status(401).json({
                status: "error",
                message: "token không hợp lệ"
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
    next(); // LUÔN cho qua
  } catch (err) {
    next(); // token lỗi cũng cho qua
  }
};
const authorizeRoles = (allowedRoles = []) => {
    return (req,res,next) => {
        if(allowedRoles.length && !allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                status: "error",
                message: "Không đủ quyền"
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
            message: "Không phải tài khoản của bạn"
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