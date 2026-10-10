import {Users} from '../models/Usermodel.js';
import {genneralAccessToken,genneralRefreshToken} from './JwtService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import {BrevoClient} from '@getbrevo/brevo';

const brevoClient = new BrevoClient({apiKey: process.env.API_KEY_BREVO});

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

const sendEmail = async (to,subject,html) => {
    await transporter.sendMail({
        from:process.env.SMTP_USER,
        to,
        subject,
        html
    });
}
const sendEmailBrevo = async (toEmail,subject,htmlContent) => {
        try {
            const result = await brevoClient.transactionalEmails.sendTransacEmail({
                sender: {
                    name: 'Property Management',
                    email: process.env.BROVO_SENDER_EMAIL
                },
                to: [{email: toEmail}],
                subject,
                htmlContent
            });
            return {
                status: "OK",
                message: "the code for verification has been sent to your email. Please check your email to verify your account",
                data: result.messageId
            };
        }catch(e){
            console.error("Error in sendEmailBrevo:", e);
            return {
                status: "error",
                message: "Failed to send verification email. Please try again later."
            };
        }
}
const verifyEmail = (token) => {
    return new Promise(async (resolve,reject) => {
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            const user = await Users.findById(decoded.userId);
            let response = {};
            if(decoded.type !== "reset-password") {
                if(!user){
                    response = {
                        status: "error",
                        message: "the account is not found"
                    };
                }else if(user.isVerified) {
                    response = {
                        status: "error",
                        message: "the account has already been verified"
                    };
                }else {
                    user.isVerified = true;
                    await user.save();
                    response = {
                        status: "OK",
                        message: "the account has been verified successfully, you can now log in to the system"
                    };
                }
            }else {
                if(!user){
                    response = {
                        status: "error",
                        message: "the account is not found"
                    };
                }
                else {
                    response = {
                        status: "OK",
                        email:user.email,
                        message:"you can now reset your password with instructions below"
                    }
                }
            }
            resolve(response);
        } catch (e) {
            let response = {};
            if(e.name === "TokenExpiredError") {
                response = {
                    status: "error",
                    message: "the token has expired"
                };
            }else {
                response = {
                    status: "error",
                    message: "failed to verify the account"
                };
            }
            reject(response);
        }
    })
}
const resendVerificationEmail = (email,type) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await Users.findOne({ email });

            if (!user) {
                return resolve({
                    status: "error",
                    message: "the account is not found"
                });
            }

            const validTypes = ["login", "register", "reset-password"];

            if (!validTypes.includes(type)) {
                return resolve({
                    status: "error",
                    message: "the type is not valid"
                });
            }

            // login hoặc register
            if (type !== "reset-password" && user.isVerified) {
                return resolve({
                    status: "error",
                    message: "the account has already been verified"
                });
            }

            // reset password
            if (type === "reset-password" && !user.isVerified) {
                return resolve({
                    status: "error",
                    message: "the account has not been verified"
                });
            }

            const verifyToken = jwt.sign(
                {
                    userId: user._id,
                    type
                },
                process.env.JWT_SECRET,
                { expiresIn: "15m" }
            );

            const linkverify =
                type === "reset-password"
                    ? `${process.env.CLIENT_URL}/forgot-password?token=${verifyToken}`
                    : `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;

            const result = await sendEmailBrevo(
                email,
                type === "reset-password"
                    ? "Đặt lại mật khẩu"
                    : "Xác thực tài khoản",
                `
                <p>Xin chào ${user.fullname}</p>
                <p>Vui lòng nhấn vào link bên dưới:</p>
                <a href="${linkverify}">
                    ${
                        type === "reset-password"
                            ? "Đặt lại mật khẩu"
                            : "Xác thực tài khoản"
                    }
                </a>
                <p>Link sẽ hết hạn sau 15 phút.</p>
                `
            );

            return resolve({
                status: result.status,
                message: result.message
            });

        } catch (e) {
            return reject(e);
        }
    });
}
const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        
        const { name, email, password, phone, address,typeuser } = newUser;
        try {
            let response = {};
            const checkUser = await Users.findOne({ email: email });
            if (checkUser !== null) {
                response ={
                    status: "error",
                    errorfield: "email",
                    message: "Email đã tồn tại trên hệ thống"
                };
            }
            else {
                const hash = bcrypt.hashSync(password, 10);
           
                const createdUser = await Users.create({
                    fullname:name,
                    email,
                    password: hash,
                    phone,
                    address,
                    image: 'unknown',
                    role: typeuser,
                    isVerified:false,
                });
                const verifyToken = jwt.sign(
                    {
                        userId: createdUser._id,
                        email: createdUser.email,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '15m' }
                );
                const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;
                const result = await sendEmailBrevo (
                    createdUser.email,
                    "Xác thực tài khoản",
                    `
                    <p>Xin chào ${createdUser.fullname},</p>
                    <p>Vui lòng click vào link dưới đây để xác thực tài khoản của bạn:</p>
                    <a href="${verifyLink}" target="_blank">Xác thực tài khoản</a>
                    <p>Link sẽ hết hạn sau 15 phút.</p>
                    `
                );
                if(result.status === "error"){
                    await Users.deleteOne({email:createdUser.email});
                }
                response = {
                    status: result.status,
                    message:result.message,
                }
            }
            resolve(response);
        } catch (e) {
            reject(e);
        }
    })
}
const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        
        const { email, password } = userLogin;
        let response = {};
        try {
            const checkUser = await Users.findOne({ email: email });
            if (checkUser === null) {
                response ={
                    status: "error",
                    message: "the user is not defined"
                };
            }else {
                const comparePassword = bcrypt.compareSync(password, checkUser.password);
                if(!comparePassword) {
                        response = {
                            status: "error",
                            message: "the password or user is incorrect"
                        };
                }
                else  if(!checkUser.isVerified) {
                    response = {
                        status: "error",
                        code: "EMAIL_NOT_VERIFIED",
                        message: "the account has not been verified, You will be redirected to the authentication page"
                    };
                }
                else {
                    const access_Token = await genneralAccessToken({
                        id:checkUser.id,
                        isAdmin: checkUser.role
                    });
                    const refresh_Token = await genneralRefreshToken({
                        id:checkUser.id,
                        isAdmin: checkUser.role
                    });
                    response = {
                        status: "OK",
                        message: "SUCCESS",
                        access_Token,
                        refresh_Token,
                    };
                }
            }
            resolve(response);
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
            const {email,name,phone,address,dateofbirth,Idnumber,idIssuedDate,idIssuedPlace} = data;
            const updatedUser = await Users.findByIdAndUpdate(id,{
                email,
                fullname: name,
                phone,
                address,
                dateOfBirth:dateofbirth,
                idNumber:Idnumber,
                idIssuedDate,
                idIssuedPlace
            }, { new: true });
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
            console.log("email and pass: ",email," ",newpass);
            const checkUser = await Users.findOne({email: email});
            let response = {}
            if(checkUser === null){
                response = {
                    status: "error",
                    message: "the user is not found in the system"
                };
            }
            const hash = bcrypt.hashSync(newpass, 10);
            await Users.updateOne(
                {email:email},
                {$set: {password: hash}}
            );
            response = {
                status: "OK",
                message: "the password has been updated successfully, you can now log in with the new password"
            }
            resolve(response);
        }catch(e){
            reject(e);
        }
    })
}
const ChangePass = (id,oldpass,newpass)=> {
    return new Promise (async (resolve,reject) => {
        try{
            const checkUser = await Users.findOne({_id: id});
            let response = {};
            if(checkUser === null){
                response = {
                    status: "error",
                    message: "the account with this password is not found"
                };
            }else  {
                const isMatched = await bcrypt.compare(oldpass, checkUser.password);

                if (!isMatched) {
                    response = {
                        status: "error",
                        message: "the old password does not match the password in the system"
                    };
                }else {
                    const hash = bcrypt.hashSync(newpass, 10);
                    await Users.updateOne(
                        {_id: id},
                        {$set: {password: hash}}
                    );
                    response = {
                        status: "OK",
                        message: "the password has been updated successfully"
                    };
                }
            }
            resolve(response);
        }catch(e){
            reject(e);
        }
    })
}
const getAllUser = (limit,page,sort,filter,keyword) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = {
                role: { $ne: "admin" }
            };

            if (filter.length > 0) {
                query.role.$in = filter;
            }

            if (keyword) {
                query.fullname = { $regex: keyword, $options: "i" };
            }
            const sortOption = {};

            if (sort?.field) {
                sortOption[sort.field] =
                    sort.order === "ascend" ? 1 : -1;
            }
            const allUsers = await Users.find(query)
                .sort(sortOption)
                .skip((page - 1) * limit)
                .limit(limit);

            const totalUser = await Users.countDocuments(query);
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: allUsers,
                pageCurrent: page,
                totalPage:Math.ceil(totalUser/limit),
                totalitem: totalUser,
            });
        } catch (e) {
            reject(e);
        }
    })
}
const getAllowner = () => {
    return new Promise(async (resolve,reject) => {
        try {
            const query = await Users.find({role: { $in: ['admin', 'sell-user']}}).select({_id: 1,fullname: 1,phone: 1,role: 1});
            if(query.length > 0){
                resolve({
                    status: "OK",
                    message: "success",
                    owner: query
                });
            }else {
                resolve({
                    status: "OK",
                    message: "the owner is not found",
                    owner: []
                });
            }
        } catch(e){
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
    getAllowner,
    getDetailsUser,
    verifyEmail,
    resendVerificationEmail
}