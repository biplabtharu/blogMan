import jwt from "jsonwebtoken";

const secret = "ALJDKDLDJDKDKSS";

function generateToken(user){

    const userPayload = {
        id : user._id,
        fullname: user.fullname,
        email: user.email,
        profileImg: user.profileImg,
        role: user.role
    }

    const token = jwt.sign(userPayload, secret);
    // console.log(token);
    return token;
}

function validateToken(token){
    const userPayload = jwt.verify(token, secret)
    // console.log(`user payload ${JSON.stringify(userPayload)}`)
    console.log(userPayload)
    // console.log(`user payload ${JSON.stringify(userPayload)}`)
    return userPayload;
}

export {generateToken, validateToken};