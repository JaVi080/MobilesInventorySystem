
const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');

//View Stock in Data 
router.get('/Stock_View', async (req, res) => {
    try {
        console.log("Stock_View API called");
        const { param } = req.query;
        let query = `SELECT 
                    s.purchase_id,
                    s.model_no,
                    s.supplier_id,
                    s.Stock_in_Quantity,
                    s.price_mb,
                    s.scnd_hand,
                    s.stock_in_date,
                    p.Brand,
                    p.Model,
                    p.Total_Stock,
                    p.scnd_hand_mb,
                    CONCAT(sup.contact_person_fName, ' ', sup.contact_person_lName) AS supplier_name
                FROM Stock_in_Purchase s
                JOIN Phones p ON s.model_no = p.Model_no
                JOIN Suppliers sup ON s.supplier_id = sup.supplier_id
                ORDER BY s.stock_in_date DESC`;
        
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
        const { stockId, brand, model, modelNo, supplier } = req.body;
        let query = `SELECT 
                    s.purchase_id,
                    s.model_no,
                    s.supplier_id,
                    s.Stock_in_Quantity,
                    s.price_mb,
                    s.scnd_hand,
                    s.stock_in_date,
                    p.Brand,
                    p.Model,
                    p.Total_Stock,
                    p.scnd_hand_mb,
                    CONCAT(sup.contact_person_fName, ' ', sup.contact_person_lName) AS supplier_name
                FROM Stock_in_Purchase s
                JOIN Phones p ON s.model_no = p.Model_no
                JOIN Suppliers sup ON s.supplier_id = sup.supplier_id
                WHERE 1=1`;

        const params = [];

        if (stockId) {
            query += ` AND s.purchase_id = ?`;
            params.push(stockId);
        }
        if (brand) {
            query += ` AND p.Brand = ?`;
            params.push(brand);
        }
        if (modelNo) {
            query += ` AND s.model_no = ?`;
            params.push(modelNo);
        } else if (model) {
            query += ` AND p.Model = ?`;
            params.push(model);
        }
        if (supplier) {
            query += ` AND s.supplier_id = ?`;
            params.push(supplier);
        }

        query += ` ORDER BY s.stock_in_date DESC`;

        const [results] = await pool.query(query, params);
        res.json(results);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
});

// Update Stock Data
const STOCK_COLUMNS = ['model_no', 'supplier_id', 'Stock_in_Quantity', 'price_mb', 'scnd_hand'];
const PHONE_COLUMNS = ['Brand', 'Model'];

router.patch('/Stock_Update', async (req, res) => {
    try {
        const { stock_id,updateData} = req.body;

        if (!stock_id) {
            return res.status(400).json({ error: "Purchase ID is required" });
        }
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        const [rows] = await pool.query(
            'SELECT model_no FROM Stock_in_Purchase WHERE purchase_id = ?',
            [purchase_id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: "Stock record not found" });
        }

        const currentModelNo = rows[0].model_no;
        const stockFields = Object.keys(update_data).filter(field => STOCK_COLUMNS.includes(field));
        const phoneFields = Object.keys(update_data).filter(field => PHONE_COLUMNS.includes(field));

        if (stockFields.length === 0 && phoneFields.length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
        }

        if (stockFields.length > 0) {
            const stockValues = stockFields.map(field => {
                const value = update_data[field];
                if (['supplier_id', 'Stock_in_Quantity', 'scnd_hand', 'price_mb'].includes(field)) {
                    return Number(value);
                }
                return value;
            });
            const stockSql = stockFields.map(field => `${field}=?`).join(', ');
            stockValues.push(purchase_id);
            await pool.query(
                `UPDATE Stock_in_Purchase SET ${stockSql} WHERE purchase_id = ?`,
                stockValues
            );
        }

        if (phoneFields.length > 0) {
            const phoneValues = phoneFields.map(field => updateData[field]);
            const phoneSql = phoneFields.map(field => `${field}=?`).join(', ');
            phoneValues.push(currentModelNo);
            await pool.query(
                `UPDATE Phones SET ${phoneSql} WHERE Model_no = ?`,
                phoneValues
            );
        }

        res.json({ success: true, message: "Stock updated successfully" });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;