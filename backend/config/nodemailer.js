import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user:process.env.SENDER_EMAIL,
        pass:process.env.SMTP_PASS
    }

})

export default transporter;

// const Nodemailer = require("nodemailer");
// const { MailtrapTransport } = require("mailtrap");

// const TOKEN = "e9d8b2267205992c48af8712f5821fb5";

// const transporter = Nodemailer.createTransport(
//   MailtrapTransport({
//     token: TOKEN,
//   })
// );

