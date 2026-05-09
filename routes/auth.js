
const express = require('express');
const router = express.Router();
const pool=require("../db.js");
const bcrypt=require("bcryptjs");
const JWT=require("jsonwebtoken");
require('dotenv').config();

router.post("/Login",async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
   try{
    const [rows] = await pool.query('SELECT * FROM Login WHERE Email = ?', [email]);
    if(rows.length===0){
        return res.json({ success: false, message: "Invalid email or password" });
    }
    const user=rows[0];
    const passwordMatch=await bcrypt.compare(password,user.pswd_hash);
    if(!passwordMatch){
        return res.json({ success: false, message: "Invalid email or password" });
    }
    const token=JWT.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
    res.json({ success: true, message: "Login successful",token });

   }catch(err){
    console.log(err.message);
   }
})

module.exports=router;
