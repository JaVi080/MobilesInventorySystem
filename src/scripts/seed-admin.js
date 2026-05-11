
// seed-admin.js (interactive version)
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../../db.js');
const readline = require('readline');  // built-in Node.js module
// readline creates a way to ask questions in the terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Helper: ask a question and get the answer
function ask(question) {
    return new Promise(resolve => rl.question(question, resolve));
}
async function createAdmin() {
    try {
        console.log("=== Create Admin Account ===\n");
        
        const email = await ask("Enter admin email: ");
        const password = await ask("Enter password (min 6 chars): ");
        
        if (password.length < 6) {
            console.log("Password too short! must be 6 char");
            process.exit(1);
        }
        // Hash and save
        const salt = await bcrypt.genSalt(10); //generate random no so that everytime hash is diff
        const password_hash = await bcrypt.hash(password, salt);
        await pool.query(
            "INSERT INTO Login (email, pswd_hash) VALUES (?, ?)",
            [email, password_hash]
        );
        console.log("\n✅ Admin created! You can now login at the website.");
        rl.close();
        process.exit(0);
    } catch (err) {
        console.error("Error:", err.message);
        rl.close();
        process.exit(1);
    }
}
createAdmin();