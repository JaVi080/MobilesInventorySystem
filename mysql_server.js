

const express = require('express'); // allow easy communication between frontend and backend
const cors=require('cors'); // allow frontend to access the backend api

const path =require('path');

// express
const app=express();
const corsOptions = {
  origin: 'http://127.0.0.1:5501', // your frontend origin
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 200 // preflight response for older browsers
};
// CORS is applied as Express middleware.
app.use(cors());



app.use(express.json()); // to parse incoming data
app.use (express.static(path.join(__dirname, 'html_Code')));//serves frontend files

const {createPool}=require('mysql2');
const pool=createPool({
    host:"localhost",
    user:'root',
    password:"0348jav.",
   database:"MobileInventory",
   connectionLimit:10
}).promise();

//inserting data OF Phones
app.post('/AddPhones',async(req,res)=>{
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
app.get('/Phones_View',async(req,res)=>{
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
app.post('/Phones_Filter', async (req, res) => {
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
app.patch('/UpdatePhones',async(req,res)=>{
  
   try{
   const {phone_id,update_data}=req.body;
  let fields=Object.keys(update_data);
  let values=Object.values(update_data);
  let sql_query=fields.map(f=>`${f}=?`).join(",");
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

//Inserting data of SUPPLIERS 
app.post('/AddSuppliers',async(req,res)=>{
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
app.get('/Suppliers_View',async(req,res)=>{
   try{
   const [SUPPLIERS]=await pool.query('select * from  Suppliers');
   console.log("hello there SUPPLIERS")
 //  console.log(phones[0]);
  res.json(SUPPLIERS);
   }catch(err){
      console.log(err.message);
   }
})
//Stock in Data 
app.post('/Stock_in',async(req,res)=>{
try{
    console.log("Ok i am in Stock_In data");
const {ModelNo,Supplier,Quantity,Price}=req.body;
if(!ModelNo||!Supplier||Quantity<1){
    return res.status(400).json({error:"One field is missing or the stock Quantity is less than 1"})
}
await pool.query("insert into Stock_in_Purchase(model_no,supplier_id,Stock_in_Quantity,price_mb) values(?,?,?,?)",
    [ModelNo,Supplier,Quantity,Price]);
    await pool.query("update Phones set Total_Stock=Total_Stock+?,base_price=? where Model_no=?",
        [Quantity,Price,ModelNo]);
    res.json({success:true,message:"Stock added successfully"});
}catch(e){
console.log(e.message);
}
})

//Inserting data into Customers

app.post('/AddCustomers',async(req,res)=>{
    try{
const{fName,last_Name,City,Email,Phone,Address}=req.body;
if(!fName){
    return res.status(400).json({error:"Customer Name is requires"});
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
app.get('/Customers_View',async(req,res)=>{
   try{
   const [Customers]=await pool.query('select * from Customer');
   console.log("hello there Customers")
 //  console.log(phones[0]);
  res.json(Customers);
   }catch(err){
      console.log(err.message);
   }
})

//Inserting data into Employees

app.post('/AddEmployees',async(req,res)=>{
    try{
const{f_name,city,email}=req.body;
if(!f_name){
    return res.status(400).json({error:"Employees Name is requires"});
}
// const [first_Name,...rest]=supp_full_name.split(" ");
// lastName=rest.join(" ");
// console.log(lastName);
await pool.query("insert into Employes (fName,city,email) values(?,?,?)",
    [f_name,city,email]
);
res.json({success:true,message:"Employees Added"})
    }catch(err){
console.log(err.message);
    }

})
//View Employes
app.get('/EMPLOYES_View',async(req,res)=>{
   try{
   const [employees]=await pool.query('select * from  Employes');
   console.log("hello there SUPPLIERS")
 //  console.log(phones[0]);
  res.json(employees);
   }catch(err){
      console.log(err.message);
   }
})

//Sales

app.post('/Sales',async(req,res)=>{
try{
    console.log("Ok i am in Sales data");
const {cust_id,emp_id,Model_No,Phones_Sale,selling_price,deposit}=req.body;
if(!cust_id||!emp_id||!Model_No||Phones_Sale<1){
    return res.status(400).json({error:"Check ur fields correctly"})
}
console.log(Phones_Sale);
await pool.query("insert into sales(Customer_id,SalesPerson_id,mb_model_no,No_Phones_Sales,selling_price,Deposit) values(?,?,?,?,?,?)",
    [cust_id,emp_id,Model_No,Phones_Sale,selling_price,deposit]);
    await pool.query(`update Phones set Total_Stock=Total_Stock-? where Model_no=?`,
        [Phones_Sale,Model_No]);
    res.json({success:true,message:"Sale successfully"});
}catch(e){
console.log(e.message);
}
})

const PORT=5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

