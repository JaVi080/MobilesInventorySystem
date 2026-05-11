

const express = require('express'); // allow easy communication between frontend and backend
const cors = require('cors'); // allow frontend to access the backend api
const pool = require('./src/config/db');// database connection
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
app.use(express.static(path.join(__dirname, 'public')));//serves frontend files




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




const supplierRoutes = require('./src/routes/supplier.routes');
const phoneRoutes=require('./src/routes/phone.routes')
const customerRoutes = require('./src/routes/customer.routes');
const employeeRoutes = require('./src/routes/employee.routes');
const authRoutes = require('./src/routes/auth.routes');
const verifyToken = require('./src/middleware/auth.js');

app.use('/api', authRoutes);
app.use('/api',verifyToken,supplierRoutes);
app.use('/api',verifyToken,phoneRoutes);
app.use('/api',verifyToken,customerRoutes);
app.use('/api',verifyToken,employeeRoutes);



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