import {emailManager} from "../managers/emailManager";
import {userRepo} from "../repositories/user-db-repo";
import {userService} from "./user-service";
import {userAccountDbType} from "../types";
import {v4 as uuidv4} from "uuid";
import {tokenRepo} from "../repositories/token-db-repo";
import {ObjectId} from "mongodb";

export const authService = {
    async confirmEmail(code:string){
        const user = await userRepo.getUserByCode(code);
        console.log(user)
        if(!user) {return false}
        if(user.emailConfirmation.isConfirmed) {return false}
        console.log(user.id)
        const result = await userRepo.updateConfirmation(user.id);
        return true

    },

    async resendConfirmCode(email:string){
        let user = await userRepo.getByEmail(email);
        console.log("RESEND ")
        if(!user){
            return null
        }
        const confirmCode = uuidv4();
        const ypdateRes = await userRepo.updateConfirmationCode(user.id, confirmCode)
        user = await userRepo.getByEmail(email);
        const result = await emailManager.sendConfirmation(user)
            //console.log("result "+ result)
        return result
    },


}