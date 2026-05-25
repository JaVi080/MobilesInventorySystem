
const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');

//Stock in Data 
router.post('/Stock_in', async (req, res) => {
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

module.exports = router;