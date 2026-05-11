
const express = require('express');

// `pool` is the shared MySQL connection pool exported from db.js.
// This file defines customer route handlers, but does not create or listen on an Express app.
const pool=require("../config/db.js");  // database connection
const router = express.Router();

//Inserting data into Customers

router.post('/AddCustomers',async(req,res)=>{
    try{
const{fName,last_Name,City,Email,Phone,Address}=req.body;
if(!fName){
    return res.status(400).json({error:"Customer Name is required"});
}
// const [first_Name,...rest]=supp_full_name.split(" ");
// lastName=rest.join(" ");
// console.log(lastName);
await pool.query("insert into Customer (fName,lName,city,email,phone_no,Address) values(?,?,?,?,?,?)",
    [fName,last_Name,City,Email,Phone,Address]
);
res.json({success:true,message:"Customer Added"})
    }catch(err){
console.log(err.message);
    }

})
//View Customer Data 
router.get('/Customers_View',async(req,res)=>{
   try{
    const param = req.query.param;
    if (param === 'all'){
        console.log("All customer data requested");
        const [customers]=await pool.query('select * from Customer');
        return res.json(customers);
    }else{
        console.log("Limited customer data requested");
    const [customers]=await pool.query('select * from Customer limit 10');
    res.json(customers);
    }
   }catch(err){
      console.log(err.message);
      res.status(500).json({ error: 'Server error' });
   }
})
// Updating customer info
router.patch('/UpdateCustomers', async (req, res) => {
  try {
    const { customer_id, update_data } = req.body;
    if (!customer_id || !update_data || Object.keys(update_data).length === 0) {
      return res.status(400).json({ error: 'customer_id and update_data are required' });
    }

    const fields = Object.keys(update_data);
    const values = Object.values(update_data);
    const sql_query = fields.map(f => `${f}=?`).join(",");
    values.push(customer_id);

    await pool.query(`UPDATE Customer SET ${sql_query} WHERE customer_id=?`, values);
    res.json({ success: true, message: 'Customer Info Updated' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;