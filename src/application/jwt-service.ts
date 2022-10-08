import {userDBType} from "../types";
import jwt, {verify} from 'jsonwebtoken'
import {settings} from "../settings/settings";
import {ObjectId} from "mongodb";
import {tokenRepo} from "../repositories/token-db-repo";

export const jwtService = {
    async createJwt(user:userDBType){
        const token = jwt.sign({userId:user.id}, settings.JWT_SECRET, {expiresIn:'10s'})
        return {accessToken:token}
    },
    async createRefreshToken(user:any){
        const refreshToken = jwt.sign({userId:user.id}, settings.JWT_REFRESH_SECRET, {expiresIn:'20s'})
        return refreshToken
    },

    async generateTokens(user:any){
        const token = jwt.sign({userId:user.id}, settings.JWT_SECRET, {expiresIn:'10s'})
        const refreshToken = jwt.sign({userId:user.id}, settings.JWT_REFRESH_SECRET, {expiresIn:'20s'})

        return {
            accessToken:token,
            refreshToken:refreshToken
        }
    },
    async getUserByAccessToken(token:string){
      try{
          const result:any = jwt.verify(token, settings.JWT_SECRET);
          console.log(result)
          console.log(new ObjectId(result.userId))
          return new ObjectId(result.userId)
      }
      catch(e){
          console.log(e)
          return null
      }
    },
    async getUserByRefreshToken(refreshToken:string){
        try{
            const result:any = jwt.verify(refreshToken, settings.JWT_REFRESH_SECRET);
            return new ObjectId(result.userId)
        }
        catch (e){
            return null
        }
    },

    async revokeToken(userId:string, token:string){
        await tokenRepo.revokeToken(userId, token)
        return null
    },

    async checkRevokedTokens(userId:string, token:string){
        const findToken = await tokenRepo.getBlackList(userId,token);
        return findToken
    }
}