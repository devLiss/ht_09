import {emailAdapter} from "../adapters/emailAdapter";

export const emailManager = {
    async sendConfirmation(user:any){

        const subject = "Регистрация";
        const message = "<h1>Thank for your registration</h1>\n" +
            "       <p>To finish registration please follow the link below:\n" +
            "          <a href='https://somesite.com/confirm-email?code="+user.emailConfirmation.confirmationCode+"'>complete registration</a>\n" +
            "      </p>"

        console.log(message)
        return await emailAdapter.send( user,subject, message);
    },
}