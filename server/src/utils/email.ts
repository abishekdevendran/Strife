import nodemailer from 'nodemailer';
require('dotenv').config();

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  }
});

const sendMail = async (toName:string,to: string, emailToken:string) => {
  const html = `
  <html>
  <h1>Strife.</h1>
  <h3>Email Verification</h3>
  <div>
  Click on the following link to verify your email address:
  <a href=${process.env.FRONTEND_URL}/verify/${emailToken}>Verify Email</a>
  </div>
  </html>
  `;
  to=`<${to}>`
  const mailOptions = {
    from:"mailer@strife.com",
    to,
    subject: "Strife Email Verification",
    html
  }
  try{
    await transport.sendMail(mailOptions);
  }
  catch(err){
    console.log(err);
  }
}

export default sendMail;