import {Request, Response, Router} from "express";
import {authMiddleware} from "../middlewares/authMiddleware";
import {sessionService} from "../domain/session-service";
import {jwtService} from "../application/jwt-service";

export const  sessionRouter = Router({})

sessionRouter.get('/',async (req:Request, res:Response)=>{
    if(!req.cookies.refreshToken){
        res.sendStatus(401)
        return
    }
    const payload = await jwtService.getPayloadByRefreshToken(req.cookies.refreshToken)
    if(!payload){
        res.sendStatus(401)
        return
    }
    const sessions = await sessionService.getSessionsByUserId(payload.userId)
    res.send(200).send(sessions)
})
sessionRouter.delete('/',async (req:Request, res:Response)=>{
    if(!req.cookies.refreshToken){
        res.sendStatus(401)
        return
    }
    const payload = await jwtService.getPayloadByRefreshToken(req.cookies.refreshToken)
    if(!payload){
        res.sendStatus(401)
        return
    }
    const isDeleted = await sessionService.removeSessionsByUserId(payload.userId, payload.deviceId);
    if(!isDeleted){
        res.sendStatus(401)
        return
    }

    res.sendStatus(204)

})
sessionRouter.delete('/:id',async (req:Request, res:Response)=>{
    if(!req.cookies.refreshToken){
        res.sendStatus(401)
        return
    }
    const payload = await jwtService.getPayloadByRefreshToken(req.cookies.refreshToken)
    if(!payload){
        res.sendStatus(401)
        return
    }
    const session = await sessionService.getSessionByDeviceId(req.params.id);
    if(!session){
        res.sendStatus(404)
        return
    }
    if(session.userId !== payload.userId)
    {
        res.sendStatus(403)
        return
    }

    const isDeleted = await sessionService.removeSessionByDeviceId(req.params.id)
    res.sendStatus(204)

})