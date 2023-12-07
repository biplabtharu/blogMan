import { validateToken } from "../services/authentication.js";

function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{
        const tokenCookieValue = req.cookies[cookieName]
        // console.log(tokenCookieValue);
        
        if(!tokenCookieValue){
            console.log(`no cookie`)
            return next();
        }

        try{
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            console.log(req.user)
        }catch(err){
            console.log(`check for authentication cookie error ${err}`);
        }

       return next();
    }
}

export {checkForAuthenticationCookie};