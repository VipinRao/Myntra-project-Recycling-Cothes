const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.js');
const jwt = require('jsonwebtoken');

const {authCheckIndex,authCheckLogin} = require('../helperfunc');
 
require('dotenv').config();



router.get('/login',authCheckLogin,(req,res) => {
    res.render('login',{layout : 'auth'});
})

router.post('/login',(req,res) => {
    // console.log(req.body);  // adding fields(input) a name is must for getting their values
    const details = req.body;
    const {username,password} = details;
    let errors = [];
    userModel.findOne({username})
        .then(user => {
            console.log(user);
            if(user){
                let hash = user.password;
                console.log(bcrypt.compareSync(password, hash));
                //compare will return promise i guess but login is a must functionality so all crypto should be completed once
                //compareSync will use cpu resorce till it completes
                //compare splits crypto operations into small junks. after completetin of a chunk, next chunk is placed on the
                //back of js event loop queue, thus effictively hsaring cpu resources.  
                // Load hash from your password DB.
                if (bcrypt.compareSync(password, hash)){
                    //ASYNC JWT TOKEN
                    // jwt.sign({_id : user._id},process.env.TOKEN_SECRET,(err,token) => {
                    //     res.cookie('auth-token',token,{httpOnly: true, secure: true, maxAge:24*60*60});
                    //     // res.header('Set-Cookie:','')
                    // }) /// before variable indicate its private variable and dont play with it
                    //this is asynchronous style of signing token       
                    //SYNC JWT TOKEN SIGNING
                    const token = jwt.sign({_id : user._id},process.env.TOKEN_SECRET);
                    res.cookie('authToken',token,{httpOnly: true,sameSite: true,
                         secure: true, expires:new Date(Date.now() + 24*60*60*1000)});                                                     
                    res.redirect('/');
                }
                else{
                    errors = ['wrong password'];
                    res.render('login',{errors,layout : 'auth'});
                }
            }
            else{
                console.log('yes');
                errors = ['No user found'];
                res.render('login',{errors,layout : 'auth'});
            }
        })
        .catch(err => {
            console.log(err);
            errors = ['error occured plz try again']
            res.render('login',{errors,layout : 'auth'});
        });
});

router.get('/register',(req,res) => {
    res.render('register',{layout : 'auth'});
})

router.post('/register',(req,res) => {
    // console.log(req.body);
    const details = req.body
    const {username,email,password,conformPassword} = details;
    // console.log(username,email,password,conformPassword);
    const i1 = email.indexOf('@');
    const i2 = email.indexOf('.com');
    let errors = [];
    //other options is to create array of errors and then render the same page eith error or redirect to login page
    if(! (i2 != -1 & i1 != -1 & i1 + 1 < i2)){
        errors.push('Incorrect email');
    }
    if (password.length < 5){
        errors.push('Password too short');
    }
    if(password != conformPassword){
        errors.push('Password do not match');
    }
    if(errors.length == 0){
        //check  if email already exists or username
        const promise1 = userModel.findOne({ email : email });
        const promise2 = userModel.findOne({ username : username});
        Promise.all([promise1,promise2])
            .then( (values) => {  //values -> [result of p1, result of p2]
                console.log(values);
                if (values[0]) errors.push('username already exists');
                if(values[1]) errors.push('email already exists');
                if(errors.length == 0){
                    //store in db, just copied from documentation
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(password, salt);
                    // Store hash in your password DB.
                    const newUser = new userModel({
                        username,
                        email,
                        password : hash
                    })
                    console.log(newUser);
                    newUser.save()
                        .then(() => res.redirect('login')) //rendering doesnt changes the url
                        .catch(err => console.log(err));
                }
                else {
                    res.render('register',{errors,layout : 'auth'});
                }
            })
            .catch(err => console.log(err));
    }
    else{
        // console.log(errors);
        res.render('register',{errors,layout : 'auth'});
    }
});

function deleteAuthToken(req,res,next){
    res.clearCookie('authToken');
    next();
}

router.get('/logout',deleteAuthToken,(req,res) => {
    res.redirect('/login');
})

module.exports = router;