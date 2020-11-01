const jwt = require('jsonwebtoken');
// const userModel = require('./models/user');

function authCheckIndex(req,res,next){
    const token = req.cookies.authToken;
    // console.log(token);
    if (!token){
        res.status(400).redirect('/login');
    }
    else{
        const userId = jwt.verify(token,process.env.TOKEN_SECRET);
        if(!userId){
            //kill token as it is invalid
            res.clearCookie('authToken');
            res.status(401).redirect('/login');
        }
        else{
            next();
        }
    } 
}
function authCheckLogin(req,res,next){
    try{
        const token = req.cookies.authToken;

        if (!token){
            next();
        }
        else{
            const userId = jwt.verify(token,process.env.TOKEN_SECRET);
            if(!userId){
                //kill token as it is invalid
                res.clearCokkie('authToken');
                res.status(401);
                next();
            }
            else{
                res.redirect('/');
            }
        }
    }
    catch(err){
        next();
    }
}


module.exports = {authCheckIndex,authCheckLogin};