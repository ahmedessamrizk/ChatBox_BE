import nodemailer from "nodemailer"

export const sendEmail = async(email, subject, html, attachments) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.SENDEREMAIL, // generated ethereal user
              pass: process.env.SENDERPASSWORD, // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
          });
        
          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: `"ChatBox" <${process.env.SENDEREMAIL}>`, // sender address
            to: email, // list of receivers
            subject,
            html,
            attachments
          });
           return info
    } catch (error) {
        console.log("Catch error!" , error);
    }
}