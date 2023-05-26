const express=require('express');
const User = require('../models/User');
const router=express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT_SECRET='varadkasignature';
const jwt = require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser');

let success=false;
//ROUTE 1: create a user using: POST '/api/auth'
router.post('/createuser', [
    body('email','enter a valid email').isEmail(),
    body('name','enter a valid name').isString(),
    body('password','enter a valid password').isLength({min:5})
], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success:false,errors: errors.array()});
    }

    try{
    let user= await User.findOne({email:req.body.email});
    if(user){
        res.status(400).json({success:false,error:'a user with this email already exists'});
    }

    const salt= await bcrypt.genSalt(10);
    const secPass= await bcrypt.hash(req.body.password,salt);
    user =await User.create({
        name:req.body.name,
        email:req.body.email,
        password:secPass
    })
    
    const data={
        user:{
            id:user.id
        }
    }

    const authToken=jwt.sign(data,JWT_SECRET);
    success=true;
    res.json({success:true,authToken}) ;
}catch(error){
    success=false;
    console.log(error.message);
    res.status(500).json({success:false,error:'Internal server error'});
}
})


//ROUTE 2: login a user using: POST '/api/login'
router.post('/login', [
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists()
], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success:false,errors: errors.array()});
    }

    const {email,password}=req.body;

    try {
        let user= await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,errors: "Please login with correct credentials"});
        }
        const passwordCompare= await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({success:false,errors: "Please login with correct credentials"});
        }

        const data={
            user:{
                id:user.id
            }
        }
    
        const authToken=jwt.sign(data,JWT_SECRET);
    
        res.json({success:true,authToken}) ;

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,error:'Internal server error'});
    }

})

//ROUTE 2: create a user using: POST '/api/getuser'

router.post('/getuser',fetchuser, async (req,res)=>{
try {
    const userId=req.user.id;
    const user=await User.findById(userId).select("-password");
    success=true;
    res.send(user);
} catch (error) {
    console.log(error.message);
    res.status(500).json({success:false,error:'Internal server error'});
}
})

module.exports=router;