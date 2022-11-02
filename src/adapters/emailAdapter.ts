import nodemailer from 'nodemailer'
import "dotenv/config";

export const emailAdapter = {
    async send(user:any,subject:string, message:string) {
        let transporter = nodemailer.createTransport({
            //service: "gmail",
            host:"smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "devliss158@gmail.com",//process.env.SMTP_USER || "",
                pass: "fvjtotzebownrwmk" //process.env.SMTP_PASSWORD || ""
            }
        });

        let result = await transporter.sendMail({
            from:  "devliss158@gmail.com",
            to: user.email,
            subject: subject,
            html: message
        })

        return result
    }
}