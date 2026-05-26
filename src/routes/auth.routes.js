
const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

router.post('/SetPassword', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password || password.length < 6) {
            return res.status(400).json({ error: "Token and valid password (min 6 chars) are required" });
        }
        const [rows] = await pool.query("SELECT * FROM Login WHERE setup_token = ? and expiry > NOW()", [token]);
        if (rows.length === 0) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }
        const user = rows[0];
        const salt = await bcrypt.genSalt(10); //generate random no so that everytime hash is diff
        const password_hash = await bcrypt.hash(password, salt);
        await pool.query("UPDATE Login SET pswd_hash = ?, setup_token = NULL, expiry = NULL WHERE id = ?", [password_hash, user.id]);
        res.json({ success: true, message: "Password set successfully! You can now login." });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
    }
});

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
