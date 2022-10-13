import {v4 as uuidv4} from "uuid";
import {sessionDbRepo} from "../repositories/session-db-repo";
import {SessionDbType} from "../types";
import {jwtService} from "../application/jwt-service";


export const sessionService = {
    async addSession(ip:string, title:string, expiredDate:Date, userId:string){

        const deviceId = uuidv4();
        const session:SessionDbType = {
            ip,
            title,
            lastActivateDate:new Date(),
            expiredDate,
            deviceId,
            userId
        }
        return await sessionDbRepo.createSession(session)
    },

    async removeSessionByDeviceId(devId:string){
        return await sessionDbRepo.removeSessionByDeviceId(devId);
    },

    async removeSessionsByUserId(userId:string, deviceId:string){
        return await sessionDbRepo.removeAllSessionsByUserId(userId, deviceId);
    },

    async getSessionsByUserId(userId:string){
                return await sessionDbRepo.getSessionsByUserId(userId);
    },
    async getSessionByDeviceId(deviceId:string){
        return await sessionDbRepo.getSessionByDeviceId(deviceId);
    }
}