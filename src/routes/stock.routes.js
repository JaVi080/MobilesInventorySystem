
const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');

//View Stock in Data 
router.get('/Stock_View', async (req, res) => {
    try {
        const { param } = req.query;
        let query = `SELECT 
                    s.stock_id,
                    s.model_no,
                    s.supplier_id,
                    s.Stock_in_Quantity,
                    s.price_mb,
                    s.scnd_hand,
                    s.date_added,
                    p.Brand,
                    p.Model,
                    p.Total_Stock,
                    p.scnd_hand_mb,
                    sup.supplier_name
                FROM Stock_in_Purchase s
                JOIN Phones p ON s.model_no = p.Model_no
                JOIN Supplier sup ON s.supplier_id = sup.supplier_id
                ORDER BY s.date_added DESC`;
        
        if (param === 'limit') {
            query += ' LIMIT 10';
        }
        
        const [results] = await pool.query(query);
        res.json(results);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
});

//Stock in Data 
router.post('/Stock_in', async (req, res) => {
    try {
        console.log("Ok i am in Stock_In data");
        const { ModelNo, Supplier, Quantity, Price, scnd_hand } = req.body;
        const quantity = Number(Quantity);
        const price = Number(Price);

        if (!ModelNo || !Supplier || Number.isNaN(quantity) || Number.isNaN(price) || quantity < 1) {
            return res.status(400).json({ error: "One field is missing or the stock Quantity is less than 1" })
        }

        await pool.query("insert into Stock_in_Purchase(model_no,supplier_id,Stock_in_Quantity,price_mb,scnd_hand) values(?,?,?,?,?)",
            [ModelNo, Supplier, quantity, price, scnd_hand ? quantity : 0]);
        await pool.query("update Phones set Total_Stock=Total_Stock+?,scnd_hand_mb=scnd_hand_mb+?,base_price=? where Model_no=?",
            [quantity, scnd_hand ? quantity : 0, price, ModelNo]);
        res.json({ success: true, message: "Stock added successfully" });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
});

// Filter Stock Data
router.post('/Stock_Filter', async (req, res) => {
    try {
        const { stockId, brand, model, supplier } = req.body;
        let query = `SELECT 
                    s.stock_id,
                    s.model_no,
                    s.supplier_id,
                    s.Stock_in_Quantity,
                    s.price_mb,
                    s.scnd_hand,
                    s.date_added,
                    p.Brand,
                    p.Model,
                    p.Total_Stock,
                    p.scnd_hand_mb,
                    sup.supplier_name
                FROM Stock_in_Purchase s
                JOIN Phones p ON s.model_no = p.Model_no
                JOIN Supplier sup ON s.supplier_id = sup.supplier_id
                WHERE 1=1`;

        const params = [];

        if (stockId) {
            query += ` AND s.stock_id = ?`;
            params.push(stockId);
        }
        if (brand) {
            query += ` AND p.Brand = ?`;
            params.push(brand);
        }
        if (model) {
            query += ` AND p.Model = ?`;
            params.push(model);
        }
        if (supplier) {
            query += ` AND sup.supplier_name = ?`;
            params.push(supplier);
        }

        query += ` ORDER BY s.date_added DESC`;

        const [results] = await pool.query(query, params);
        res.json(results);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
});

// Update Stock Data
router.put('/Stock_Update', async (req, res) => {
    try {
        const { stock_id, Stock_in_Quantity, price_mb, scnd_hand } = req.body;

        if (!stock_id) {
            return res.status(400).json({ error: "Stock ID is required" });
        }

        let updateQuery = `UPDATE Stock_in_Purchase SET `;
        const updateParams = [];
        const updateFields = [];

        if (Stock_in_Quantity !== undefined) {
            updateFields.push(`Stock_in_Quantity = ?`);
            updateParams.push(Number(Stock_in_Quantity));
        }
        if (price_mb !== undefined) {
            updateFields.push(`price_mb = ?`);
            updateParams.push(Number(price_mb));
        }
        if (scnd_hand !== undefined) {
            updateFields.push(`scnd_hand = ?`);
            updateParams.push(Number(scnd_hand));
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        updateQuery += updateFields.join(", ") + ` WHERE stock_id = ?`;
        updateParams.push(stock_id);

        await pool.query(updateQuery, updateParams);
        res.json({ success: true, message: "Stock updated successfully" });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;