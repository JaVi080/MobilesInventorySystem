const express = require('express');
const router = express.Router();
const pool = require("../config/db.js");

// Inserting data into Employees
router.post('/AddEmployees', async (req, res) => {
    try {
        const { fName, lName, DOB, city, email, phone_no, Address, position, Hiring_Date, salary } = req.body;
        if (!fName || !email) {
            return res.status(400).json({ error: "Employee First Name and Email are required" });
        }
        await pool.query(
            "insert into Employes (fName, lName, DOB, city, email, phone_no, Address, position, Hiring_Date, salary) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [fName, lName, DOB, city, email, phone_no, Address, position, Hiring_Date, salary]
        );
        res.json({ success: true, message: "Employee Added" });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
    }
});

// View Employees
router.get('/EMPLOYES_View', async (req, res) => {
    try {
        const param = req.query.param;
        if (param === 'all') {
            const [employees] = await pool.query('select * from Employes');
            return res.json(employees);
        } else {
            const [employees] = await pool.query('select * from Employes limit 10');
            res.json(employees);
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Filter Employees
router.post('/Employees_Filter', async (req, res) => {
    try {
        const { employe_id, emp_name, city, min_salary, max_salary } = req.body;
        
        let query = 'SELECT * FROM Employes WHERE 1=1';
        const params = [];

        if (employe_id) {
            query += ' AND employe_id = ?';
            params.push(employe_id);
        }
        if (emp_name) {
            query += ' AND (fName LIKE ? OR lName LIKE ?)';
            params.push(`%${emp_name}%`, `%${emp_name}%`);
        }
        if (city) {
            query += ' AND city = ?';
            params.push(city);
        }
        if (min_salary) {
            query += ' AND salary >= ?';
            params.push(min_salary);
        }
        if (max_salary) {
            query += ' AND salary <= ?';
            params.push(max_salary);
        }

        const [employees] = await pool.query(query, params);
        return res.json(employees);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
    }
});

// Update Employee
router.patch('/UpdateEmployee', async (req, res) => {
    try {
        const { employe_id, update_data } = req.body;
        if (!employe_id || !update_data || Object.keys(update_data).length === 0) {
            return res.status(400).json({ error: 'employe_id and update_data are required' });
        }

        const fields = Object.keys(update_data);
        const values = Object.values(update_data);
        const sql_query = fields.map(f => `${f}=?`).join(",");
        values.push(employe_id);

        await pool.query(`UPDATE Employes SET ${sql_query} WHERE employe_id=?`, values);
        res.json({ success: true, message: 'Employee Info Updated' });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
