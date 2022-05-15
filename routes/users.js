const express=require('express');
const router=express.Router();
const passport=require('passport');
const jwt=require('jsonwebtoken');
const config=require('../config/database')
const User =require('../models/user');


router.post('/register',(req,res,next)=>{
    // res.send('Register');
    let newuser=new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newuser, (err,user) =>{
        if(err){
            res.json({success: false , msg: 'Registration failed'});
        }
        else{
            res.json({success: true , msg: 'Registration success'});
        }
    });
});

router.post('/authenticate',(req,res,next)=>{
    // res.send('Authenticate');
    const username=req.body.username;
    const password=req.body.password;

    User.getUserByUserName(username, (err,user)=>{
        if(err)
        throw err;
        if(!user){
            return res.json({success: false , msg: 'Authentication failed'});
        }
        User.comparePassword(password,user.password,(err,isMatch)=>{
            if(err)
            throw err;
            if(isMatch){
                const token=jwt.sign({user},config.secret,{
                    expiresIn: 604800
                });
                res.json({
                    success: true ,
                    token: 'JWT '+token,
                    user:{
                        id:user._id,
                        name:user.name,
                        username:user.username,
                        email:user.email
                    }
                });
            }
            else{
                return res.json({success : false ,msg :'Wrong password'});
            }
        });
    });
});

router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
  });

module.exports=router;