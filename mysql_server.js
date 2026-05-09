

const express = require('express'); // allow easy communication between frontend and backend
const cors = require('cors'); // allow frontend to access the backend api
const pool = require('./db');// database connection
const path = require('path');

// express
const app = express();
const corsOptions = {
    origin: 'http://127.0.0.1:5501', // your frontend origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
    optionsSuccessStatus: 200 // preflight response for older browsers
};
// CORS is applied as Express middleware.
app.use(cors());



app.use(express.json()); // to parse incoming data
app.use(express.static(path.join(__dirname, 'html_Code')));//serves frontend files




//Stock in Data 
app.post('/Stock_in', async (req, res) => {
    try {
        console.log("Ok i am in Stock_In data");
        const { ModelNo, Supplier, Quantity, Price } = req.body;
        if (!ModelNo || !Supplier || Quantity < 1) {
            return res.status(400).json({ error: "One field is missing or the stock Quantity is less than 1" })
        }
        await pool.query("insert into Stock_in_Purchase(model_no,supplier_id,Stock_in_Quantity,price_mb) values(?,?,?,?)",
            [ModelNo, Supplier, Quantity, Price]);
        await pool.query("update Phones set Total_Stock=Total_Stock+?,base_price=? where Model_no=?",
            [Quantity, Price, ModelNo]);
        res.json({ success: true, message: "Stock added successfully" });
    } catch (e) {
        console.log(e.message);
    }
})



//Inserting data into Employees

app.post('/AddEmployees', async (req, res) => {
    try {
        const { f_name, city, email } = req.body;
        if (!f_name) {
            return res.status(400).json({ error: "Employees Name is requires" });
        }
        // const [first_Name,...rest]=supp_full_name.split(" ");
        // lastName=rest.join(" ");
        // console.log(lastName);
        await pool.query("insert into Employes (fName,city,email) values(?,?,?)",
            [f_name, city, email]
        );
        res.json({ success: true, message: "Employees Added" })
    } catch (err) {
        console.log(err.message);
    }

})
//View Employes
app.get('/EMPLOYES_View', async (req, res) => {
    try {
        const [employees] = await pool.query('select * from  Employes');
        console.log("hello there SUPPLIERS")
        //  console.log(phones[0]);
        res.json(employees);
    } catch (err) {
        console.log(err.message);
    }
})

//Sales

app.post('/Sales', async (req, res) => {
    try {
        console.log("Ok i am in Sales data");
        const { cust_id, emp_id, Model_No, Phones_Sale, selling_price, deposit } = req.body;
        if (!cust_id || !emp_id || !Model_No || Phones_Sale < 1) {
            return res.status(400).json({ error: "Check ur fields correctly" })
        }
        console.log(Phones_Sale);
        await pool.query("insert into sales(Customer_id,SalesPerson_id,mb_model_no,No_Phones_Sales,selling_price,Deposit) values(?,?,?,?,?,?)",
            [cust_id, emp_id, Model_No, Phones_Sale, selling_price, deposit]);
        await pool.query(`update Phones set Total_Stock=Total_Stock-? where Model_no=?`,
            [Phones_Sale, Model_No]);
        res.json({ success: true, message: "Sale successfully" });
    } catch (e) {
        console.log(e.message);
    }
})
const supplierRoutes = require('./routes/admin-mnage-supplier');
const phoneRoutes = require('./routes/admin-manage-phones');
const customerRoutes = require('./routes/admin-manage-cust');
const authRoutes = require('./routes/auth');
const verifyToken = require('./middleware/authMiddleware');

app.use('/api', authRoutes);
app.use('/api',supplierRoutes);
app.use('/api',verifyToken,phoneRoutes);
app.use('/api',customerRoutes);



// Error handler LAST (catches errors from everything above)
//  If you put it at the top, it won't catch errors from routes defined below it.
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statuscode = err.statusCode || 500;
    const errMsg = err.message || "Internal server error";
    res.status(statuscode).json({ success: false, error: errMsg });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = pool;