const express = require('express');

// `pool` is the shared MySQL connection pool exported from mysql_server.js.
// This file defines supplier route handlers, but does not create or listen on an Express app.
const pool=require("../config/db.js"); // database connection
const router = express.Router();

//Inserting data of SUPPLIERS 
router.post('/AddSuppliers',async(req,res)=>{
    try{
        console.log("I AM IN SUPPLIER POST");
const{Supplier_Name,Company_Name,City,Country,Email,Phone_1,Phone_2,Supply_Type,Address}=req.body;
if(!Company_Name||!Supplier_Name){
    return res.status(400).json({error:"Company Name and Supplier Name is requires"});
}
const [first_Name,...rest]=Supplier_Name.split(" ");
lastName=rest.join(" ");
console.log(lastName);
await pool.query("insert into Suppliers (Company_Name,contact_person_fName,contact_person_lName,city,country,email,phone_no_1,phone_no_2,supply_type,Address) values(?,?,?,?,?,?,?,?,?,?)",
    [Company_Name,first_Name,lastName,City,Country,Email,Phone_1,Phone_2,Supply_Type,Address]
);
res.json({success:true,message:"SUPPLIER Added"})
    }catch(err){
console.log(err.message);
    }

})
//Viewing Suppliers Data
router.get('/Suppliers_View',async(req,res)=>{
     try{
    const param = req.query.param;
    if (param === 'all'){
        console.log("All data requested");
        const [suppliers]=await pool.query('select * from Suppliers');
        return res.json(suppliers);
    }else{
        console.log("Limited data requested");
    const [suppliers]=await pool.query('select * from Suppliers limit 10');
    res.json(suppliers);
    }
   console.log("hello there")
 //  console.log(suppliers[0]);

   }catch(err){
      console.log(err.message);
      res.status(500).json({ error: 'Server error' });
   }
})
// Updating supplier info
router.patch('/UpdateSuppliers', async (req, res) => {
  try {
    const { supplier_id, update_data } = req.body;
    if (!supplier_id || !update_data || Object.keys(update_data).length === 0) {
      return res.status(400).json({ error: 'supplier_id and update_data are required' });
    }

    const fields = Object.keys(update_data);
    const values = Object.values(update_data);
    const sql_query = fields.map(f => `${f}=?`).join(",");
    values.push(supplier_id);

    await pool.query(`UPDATE Suppliers SET ${sql_query} WHERE supplier_id=?`, values);
    res.json({ success: true, message: 'Supplier Info Updated' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
})
module.exports = router;