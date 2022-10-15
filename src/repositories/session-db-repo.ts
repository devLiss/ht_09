import {commentsCollection, sessionCollection} from "./db";
import {SessionDbType, SessionType} from "../types";

export const sessionDbRepo = {

    async createSession(session:SessionDbType):Promise<SessionType>{

        await sessionCollection.insertOne(session);
        return {
            ip:session.ip,
            title:session.title,
            lastActivateDate:session.lastActivateDate,
            deviceId:session.deviceId
        }
    },
    async getSessionByDeviceId(deviceId:string){
        const session = await sessionCollection.findOne({deviceId:deviceId});
        return session;
    },
    async getSessionByUserByDeviceAndByDate(userId:string, deviceId:string, issuedAt:Date){
        const sessions = await sessionCollection.find({userId:userId, deviceId:deviceId, lastActivateDate:issuedAt}).toArray();
        return sessions;
    },

    async updateSession(userId:string,deviceId:string,expiredDate:Date,issuedAt:Date){
        const result = await sessionCollection.updateOne({userId:userId, deviceId:deviceId}, {$set:{expiredDate:expiredDate, lastActivateDate:issuedAt}})
        return result.matchedCount === 1
    },
    async getSessionsByUserId(userId:string)/*:Promise<SessionType[]>*/{
        const sessions = await sessionCollection.find({userId: userId}).project({
            "_id":0,
            "ip": 1,
            "title": 1,
            "lastActivateDate": 1,
            "deviceId": 1
        }).toArray();
        return sessions
    },
    async removeSessionByDeviceId(userId:string,deviceId:string){
        const result = await sessionCollection.deleteOne({userId:userId,deviceId:deviceId})
        return result.deletedCount === 1
    },

    async removeAllSessionsByUserId(deviceId:string, userId:string){
        const result = await sessionCollection.deleteMany({userId:userId, deviceId:{$ne:deviceId}})
        return result.deletedCount > 0
    },

    async deleteAll():Promise<boolean>{
        const result = await sessionCollection.deleteMany({})
        return result.deletedCount > 1
    }
}