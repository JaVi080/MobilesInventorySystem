const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');

router.post('/Sales', async (req, res) => {
    try {
        console.log('Ok i am in Sales data');
        const { cust_id, emp_id, Model_No, Phones_Sale, selling_price, deposit, Quality } = req.body;
        if (!cust_id || !emp_id || !Model_No || Phones_Sale < 1) {
            return res.status(400).json({ error: 'Check ur fields correctly' });
        }

        await pool.query(
            'INSERT INTO sales(Customer_id,SalesPerson_id,mb_model_no,No_Phones_Sales,selling_price,Deposit,Quality) VALUES(?,?,?,?,?,?,?)',
            [cust_id, emp_id, Model_No, Phones_Sale, selling_price, deposit, Quality || 'new']
        );
        await pool.query('UPDATE Phones SET Total_Stock=Total_Stock-? WHERE Model_no=?', [Phones_Sale, Model_No]);
        res.json({ success: true, message: 'Sale successfully' });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/Sales_View', async (req, res) => {
    try {
        const param = req.query.param;
        let query = `SELECT s.sales_id,
            s.Customer_id,
            CONCAT(COALESCE(c.fName, ''), ' ', COALESCE(c.lName, '')) AS customer_name,
            s.SalesPerson_id AS Employee_ID,
            s.mb_model_no,
            s.No_Phones_Sales,
            s.selling_price,
            s.Deposit,
            s.Quality,
            s.sales_date,
            (s.No_Phones_Sales * s.selling_price) AS total_price,
            (s.No_Phones_Sales * s.selling_price - s.Deposit) AS pending_amount
          FROM sales s
          LEFT JOIN Customer c ON c.customer_id = s.Customer_id
        `;
        if (param !== 'all') {
            query += ' LIMIT 10';
        }
        const [sales] = await pool.query(query);
        res.json(sales);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

const ALLOWED_COLUMNS = ['No_Phones_Sales', 'selling_price', 'Deposit', 'Quality'];
router.patch('/UpdateSales', async (req, res) => {
    try {
        const { sales_id, update_data } = req.body;
        if (!sales_id || !update_data || Object.keys(update_data).length === 0) {
            return res.status(400).json({ error: 'sales_id and update_data are required' });
        }

        const safeFields = Object.keys(update_data).filter(field => ALLOWED_COLUMNS.includes(field));
        if (safeFields.length === 0) {
            return res.status(400).json({ error: 'No allowed fields to update' });
        }

        const values = safeFields.map(field => update_data[field]);
        const sql_query = safeFields.map(f => `${f}=?`).join(', ');
        values.push(sales_id);

        await pool.query(`UPDATE sales SET ${sql_query} WHERE sales_id=?`, values);
        res.json({ success: true, message: 'Sales record updated' });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;