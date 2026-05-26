const nodemailer=require('nodemailer');

const setUpMail=async (email, token, text)=>{
    try{
        const transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        });

       const setupLink = `http://localhost:5000/pages/auth/setup-password.html?token=${token}`;

        const mailOptions={
            from:process.env.EMAIL_USER,
            to:email,      
            subject:"Set Your Password",
             html: `
      <h2>Welcome to Inventory System!</h2>
      <p>Your account has been created. Click below to set your password:</p>

      <a href="${setupLink}" style="
        background:#4F46E5; color:white; padding:12px 24px;
        text-decoration:none; border-radius:6px; display:inline-block;
      ">Set My Password</a>

      <p>This link expires in <strong>24 hours</strong>.</p>
      <p>If you didn't request this, ignore this email.</p>
    `
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
    }catch(err){
        console.log(`Failed to send email to ${email}: ${err.message}`);
    }

}

module.exports=setUpMail;