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