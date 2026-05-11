const express = require('express');
const router = express.Router();
const pool=require("../config/db.js"); // database connection

//inserting data OF Phones
router.post('/AddPhones',async(req,res)=>{
   try{
const {brand,model,model_no,OS,Processor,Storage,Ram,Warranty}=req.body;
 if (!brand || !model||!model_no){
        return res.status(400).json({ error: "Name and model required" });
 }
 await pool.query("insert into Phones (brand, model, model_no,os,Processor,p_storage_gb,ram_gb,Warranty_period) values (?,?,?,?,?,?,?,?) ",
    [brand,model,model_no,OS,Processor,Storage,Ram,Warranty]);

      res.json({ success: true, message: "Phone added" });
   }catch(err){
      console.log(err.message);
   }
})

//Viewing Phones Data 
router.get('/Phones_View',async(req,res)=>{
   try{
    const param = req.query.param;
    if (param === 'all'){
        console.log("All data requested");
        const [phones]=await pool.query('select * from Phones');
        return res.json(phones);
    }else{
        console.log("Limited data requested");
    const [phones]=await pool.query('select * from Phones limit 10');
    res.json(phones);
    }
   console.log("hello there")
 //  console.log(phones[0]);

   }catch(err){
      console.log(err.message);
      res.status(500).json({ error: 'Server error' });
   }
})
//Filtering Pones
router.post('/Phones_Filter', async (req, res) => {
  try {
    const { phoneId, brand, Model, ModelNo } = req.body;

    let query = 'SELECT * FROM Phones WHERE 1=1';
    const params = [];

    if (phoneId) {
      query += ' AND phone_id = ?';
      params.push(phoneId);
    }
    if (brand) {
      query += ' AND Brand = ?';
      params.push(brand);
    }
    if (Model) {
      query += ' AND Model = ?';
      params.push(Model);
    }
    if (ModelNo) {
      query += ' AND Model_no = ?';
      params.push(ModelNo);
    }

    const [phones] = await pool.query(query, params);
    return res.json(phones);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

//updating phones data 
// app.options('/UpdatePhones',cors());
// field whitelisting
// Unauthorized Column Manipulation
const ALLOWED_COLUMNS = ['Brand', 'Model', 'Model_no', 'os', 'Processor', 
                          'p_storage_gb', 'ram_gb', 'Warranty_period'];
router.patch('/UpdatePhones',async(req,res)=>{
  
   try{
   const {phone_id,update_data}=req.body;
  // let fields=Object.keys(update_data); // can cause sql injection attack so allowed_columns names used 
  const safeFields = Object.keys(update_data)
        .filter(field => ALLOWED_COLUMNS.includes(field));
  const values = safeFields.map(field => update_data[field]);
  // let sql_query=fields.map(f=>`${f}=?`).join(",");
  let sql_query = safeFields.map(f => `${f}=?`).join(",");
  for(var v of values){
    console.log(v);
  }
  values.push(phone_id);
 await pool.query(`Update Phones set ${sql_query} where phone_id=?`,values);

      res.json({ success: true, message: "Phone Info Updated" });
   }catch(err){
      console.log(err.message);
   }
})
module.exports = router;