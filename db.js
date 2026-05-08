
const {createPool} = require('mysql2');
const pool = createPool({
    host: "localhost",
    user: 'root',
    password: "0348jav.",
    database: "MobileInventory",
    connectionLimit: 10
}).promise();
module.exports = pool;