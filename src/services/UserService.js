import {Users} from '../models/Usermodel.js';
import {genneralAccessToken,genneralRefreshToken} from './JwtService.js';
import bcrypt from 'bcrypt';

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        
        const { fullname, email, password, phone, address } = newUser;
        try {
            const checkUser = await Users.findOne({ email: email });
            if (checkUser !== null) {
                resolve({
                    status: "error",
                    message: "the email already exists"
                });
            }
            const hash = bcrypt.hashSync(password, 10);
           
            const createdUser = await Users.create({
                fullname,
                email,
                password: hash,
                phone,
                address,
                image: 'unknown',
                role: 'watcher'
            });
            if (createdUser) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createdUser}
                );
            }
        } catch (e) {
            reject(e);
        }
    })
}
const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        
        const { email, password } = userLogin;
        try {
            const checkUser = await Users.findOne({ email: email });
            if (checkUser === null) {
                resolve({
                    status: "error",
                    message: "the user is not defined"
                });
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password);
           if(!comparePassword) {
                resolve({
                    status: "error",
                    message: "the password or user is incorrect"
                });
            }
            const access_Token = await genneralAccessToken({
                id:checkUser.id,
                isAdmin: checkUser.role
            });
            const refresh_Token = await genneralRefreshToken({
                id:checkUser.id,
                isAdmin: checkUser.role
            });
            resolve({
                status: "OK",
                message: "SUCCESS",
                access_Token,
                refresh_Token,
            });
        } catch (e) {
            reject(e);
        }
    })
}
const updateUser = (id,data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await Users.findOne({ _id: id });
            if(checkUser === null) {
                resolve({
                    status: "OK",
                    message: "the user is not defined"
                });
            }
            const {email,name,phone,address} = data;
            const updatedUser = await Users.findByIdAndUpdate(id,{email,fullname: name,phone,address}, { new: true });
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: updatedUser
            });
        } catch (e) {
            reject(e);
        }
    })
}
const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await Users.findOne({ _id: id });
            if(checkUser === null) {
                resolve({
                    status: "OK",
                    message: "the user is not defined"
                });
            }
            await Users.findByIdAndDelete(id);
            resolve({
                status: "OK",
                message: "Delete user success"
            });
        } catch (e) {
            reject(e);
        }
    })
}
const resetpass = (newpass,email) => {
    return new Promise(async (resolve,reject) => {
        try{
            const checkUser = await Users.findOne({email: email});
            if(checkUser === null){
                resolve({
                    status: "OK",
                    message: "the user is not defined"
                });
            }
            const hash = bcrypt.hashSync(newpass, 10);
            await Users.updateOne(
                {email:email},
                {$set: {password: hash}}
            );
            resolve({
                status: "OK",
                message: "Update the password of user is success"
            });
        }catch(e){
            reject(e);
        }
    })
}
const ChangePass = (id, newpass)=> {
    return new Promise (async (resolve,reject) => {
        try{
            const checkUser = await Users.findOne({_id: id});
            if(checkUser === null){
                resolve({
                    status: "OK",
                    message: "the user is not defined"
                });
            }
            const hash = bcrypt.hashSync(newpass, 10);
            await Users.updateOne(
                {_id: id},
                {$set: {password: hash}}
            );
            resolve({
                status: "OK",
                message: "Update the password of user is success"
            });
        }catch(e){
            reject(e);
        }
    })
}
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUsers = await Users.find();
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: allUsers
            });
        } catch (e) {
            reject(e);
        }
    })
}
const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await Users.findOne({ _id: id });
            if(user === null) {
                resolve({
                    status: "OK",
                    message: "the user is not defined"
                });
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: user
            });
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    resetpass,
    ChangePass,
    getAllUser,
    getDetailsUser,
}