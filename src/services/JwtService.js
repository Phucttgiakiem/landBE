import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const genneralAccessToken = async(payload) => {
    const access_token = jwt.sign({
        ...payload
    },process.env.ACCESS_TOKEN,{expiresIn: '2000'});
    return access_token;
}
const genneralRefreshToken = async(payload) => {
    const refresh_token = jwt.sign({
        ...payload
    },process.env.REFRESH_TOKEN,{expiresIn: '3000'});
    return refresh_token;
}
const refreshTokenJwtService = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if(err){
                   return resolve({
                        status: "ERROR",
                        message: 'The authentication'
                    })
                }
               
                const access_token = await genneralAccessToken({
                    id: user?.id, 
                    isAdmin: user?.isAdmin
                });
              return resolve({
                    status: "OK",
                    message: "SUCCESS",
                    access_token
                })
            })
        }catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenJwtService
}