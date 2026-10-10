import { get } from "mongoose";
import UserService from "../services/UserService.js";
import JWTService from "../services/JwtService.js";


const verifyEmail = async (req,res) => {
    try {
        const {token} = req.query;
        const response = await UserService.verifyEmail(token);
        if (response.status === "error") {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    }catch(e){
        return res.status(500).json({
            status: "error",
            message: e.message
        });
    }
}
const resendVerifyEmail = async (req,res) => {
    try {
        const {email,type} = req.body;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = regex.test(email);
        if(!email) {
            return res.status(400).json({
                status: "error",
                message: "the input field email is required"
            });
        }
        if(!isEmailValid) {
            return res.status(400).json({
                status: "error",
                message: "Email is not valid"
            });
        }
        if(!type) {
            return res.status(400).json({
                status: "error",
                message: "the input field type is required"
            });
        }
        const response = await UserService.resendVerificationEmail(email,type);
        if (response.status === "error") {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch(e){
        return res.status(500).json({
            status: "error",
            message: e.message
        });
    }
}
const createUser = async (req, res) => {
    try {
        const {name, email, password,confirmPassword,phone,address,typeuser} = req.body;
        const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isEmailValid = reg.test(email);
        if(!name || !email || !password || !confirmPassword || !phone || !address || !typeuser){
            return res.status(400).json({
                status: "error",
                message: "All field is required"
            })
        }
        else if(!isEmailValid) {
            return res.status(400).json({ 
                status: "error",
                message: "Email is not valid"
            })
        }else if(password !== confirmPassword) {
            return res.status(400).json({
                status: "error",
                message: "The password is equal to confirm password"
            });
        }
       const response =  await UserService.createUser(req.body);
       if (response.status === "error") {
        return res.status(400).json(response);
       }
       return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            message: e.message
        })
    }
}
const loginUser = async (req, res) => {
    try {
        
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({
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
       if (response.status === "error") {
            return res.status(400).json(response);
       }
       return res.status(200).json(newResponse);
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        if(!userId){
            return res.status(400).json({
                status: "error",
                message: "The userId is required"
            });
        }
        const response = await UserService.updateUser(userId, data);
        return res.status(200).json(response);
    }catch(e){
        return res.status(500).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if(!userId){
            return res.status(400).json({
                status: "error",
                message: "The userId is required"
            });
        }
        const response = await UserService.deleteUser(userId);
        return res.status(200).json(response);
    }catch(e){
        return res.status(500).json({
            message: e
        })
    }
}
const resetpass = async (req,res) => {
    try {
        const {newpass,confirmpass,email} = req.body;
        const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(?=\S+$).{8,16}$/
        const ispassvalid = reg.test(newpass);
        if(!newpass) {
            return res.status(400).json({
                field: "newpass",
                message: "Please enter a new password"
            })
        }
        if(!confirmpass) {
            return res.status(400).json({
                field: "confirmpass",
                message: "Please enter the password again"
            })
        }
        if(!ispassvalid){
            return res.status(400).json({
                field:"newpass",
                message: "The new password is not valid"
            })
        }
        if(newpass !== confirmpass){
            return res.status(400).json({
                field: "confirmpass",
                message: "The confirmed password does not match"
            })
        }
        const response = await UserService.resetpass(newpass,email);
        if(response.status === "error") {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    }catch(e){
        return res.status(500).json({
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
            return res.status(400).json({
                status: "error",
                message: "the input fields are required"
            });
        }else if(!ispassvalid){
            return res.status(400).json({
                status: "error",
                message: "the password is not valid"
            })
        }else if(newpass !== confirmpass){
            return res.status(400).json({
                status: "error",
                message: "the password and confirm password do not match"
            })
        }
        const response = await UserService.ChangePass(id,oldpass,newpass);
        if (response.status === "error") {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    }catch(e){
        return res.status(500).json({
            message: e
        })
    }
}
const getAllUser = async (req, res) => {
    try {
        const {limit,page,sort,filter,keyword} = req.query;

        const sorted = JSON.parse(sort || "{}");
        const filtered = JSON.parse(filter || "[]");

        const response = await UserService.getAllUser(Number(limit),Number(page),sorted,filtered,keyword);
        return res.status(200).json(response)
    }catch(e){
        return res.status(500).json({
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
        return res.status(500).json({
            message: e
        })
    }
}
const getAllowner = async (req,res) => {
    try {
        const result = await UserService.getAllowner();
        return res.status(200).json(result);
    } catch(e){
        return res.status(500).json({
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
        return res.status(500).json({
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
        return res.status(500).json({
            message: e
        })
    }
}
module.exports = {
    createUser,
    verifyEmail,
    resendVerifyEmail,
    loginUser,
    updateUser,
    deleteUser,
    resetpass,
    changePass,
    getAllUser,
    getAllowner,
    getDetailsUser,
    refreshToken,
    logoutUser
}