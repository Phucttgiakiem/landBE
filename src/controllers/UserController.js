import { get } from "mongoose";
import UserService from "../services/UserService.js";
import JWTService from "../services/JwtService.js";

const createUser = async (req, res) => {
    try {
        //console.log(req.body);
        const {fullname, email, password,confirmPassword,phone,address,typeuser} = req.body;
        const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isEmailValid = reg.test(email);
       // console.log("param: ",req.body);
        if(!fullname || !email || !password || !confirmPassword || !phone || !address || !typeuser) {
            return res.status(200).json({
                status: "error",
                message: "The input is required"
            });
        }else if(!isEmailValid) {
            return res.status(200).json({ 
                status: "error",
                message: "Email is not valid"
            })
        }else if(password !== confirmPassword) {
            return res.status(200).json({
                status: "error",
                message: "The password is equal to confirm password"
            });
        }
       const response =  await UserService.createUser(req.body);
       return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(404).json({
            message: e
        })
    }
}
const loginUser = async (req, res) => {
    try {
        
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(200).json({
                status: "error",
                message: "The input is required"
            });
        }
       const response =  await UserService.loginUser(req.body);
       const { refresh_Token,...newResponse} = response;
       res.cookie('refresh_token', refresh_Token, {
            httpOnly: true,
            secure: false,
            samesite: 'strict'
       })
       return res.status(200).json(newResponse);
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        if(!userId){
            return res.status(200).json({
                status: "error",
                message: "The userId is required"
            });
        }
        const response = await UserService.updateUser(userId, data);
        return res.status(200).json(response);
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if(!userId){
            return res.status(200).json({
                status: "error",
                message: "The userId is required"
            });
        }
        const response = await UserService.deleteUser(userId);
        return res.status(200).json(response);
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const resetpass = async (req,res) => {
    try {
        const {newpass,confirmpass,email} = req.body;
        const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(?=\S+$).{8,16}$/
        const ispassvalid = reg.test(newpass);
        if(!newpass || !confirmpass || !email){
            return res.status(200).json({
                status: "error",
                message: "The input is required"
            });
        }else if(newpass !== confirmpass){
            return res.status(200).json({
                status: "error",
                message: "the password is equal to confirm password"
            })
        }else if(!ispassvalid){
            return res.status(200).json({
                status: "error",
                message: "Pass is not valid"
            })
        }
        const response = await UserService.resetpass(newpass,email);
        return res.status(200).json(response);
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const changePass = async (req,res) => {
    try {
        const {oldpass,newpass,confirmpass} = req.body;
        const id = req.params.id;

        const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(?=\S+$).{8,16}$/
        const ispassvalid = reg.test(newpass);
        if(!oldpass || !newpass || !confirmpass || !id){
            return res.status(200).json({
                status: "error",
                message: "The input is required"
            });
        }else if(!ispassvalid){
            return res.status(200).json({
                status: "error",
                message: "Pass is not valid"
            })
        }else if(newpass !== confirmpass){
            return res.status(200).json({
                status: "error",
                message: "the password is equal to confirm password"
            })
        }
        const response = await UserService.ChangePass(id,newpass);
        return res.status(200).json(response);
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser();
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const getDetailsUser = async (req,res) => {
    try {
        const userId = req.params.id;
        if(!userId){
            return res.status(200).json({
                status: "error",
                message: "The userId is required"
            });
        }
        const response = await UserService.getDetailsUser(userId);
        return res.status(200).json(response);
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token;
        if(!token) {
            return res.status(200).json({
                status: "error",
                message: "The token is required"
            });
        }
        const response = await JWTService.refreshTokenJwtService(token);
        return res.status(200).json(response);
    }
    catch (e){
        return res.status(404).json({
            message: e
        })
    }
}
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token');
        const response = {
            status: "OK",
            message: "Logout successfully"
        };
        return res.status(200).json(response);
    }
    catch (e){
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    resetpass,
    changePass,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser
}