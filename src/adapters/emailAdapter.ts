import nodemailer from 'nodemailer'
import "dotenv/config";

export const emailAdapter = {
    async send(user:any,subject:string, message:string) {
        let transporter = nodemailer.createTransport({
            //service: "gmail",
            host:"smtp.yandex.ru",
            port: 465,
            secure: true,
            auth: {
                user: "devliss@yandex.ru",//process.env.SMTP_USER || "",
                pass: "u*qY5tTJ*w53f" //process.env.SMTP_PASSWORD || ""
            }
        });

        let result = await transporter.sendMail({
            from:  "devliss@yandex.ru",
            to: user.email,
            subject: subject,
            html: message
        })

        return result
    }
}