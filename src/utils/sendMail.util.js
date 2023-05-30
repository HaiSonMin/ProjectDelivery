const nodemailer  = require('nodemailer')

const sendMail = async(emailTo ,html) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.MY_EMAIL, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: `"AppDelivery" <${process.env.MY_EMAIL}>`, // sender address
        to: emailTo, // list of receivers
        subject: "Forgot Password", // Subject line
        html: html, // html body
      });
    
      return info
}

module.exports = sendMail