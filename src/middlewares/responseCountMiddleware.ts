import {NextFunction, Request, Response} from "express";
import {requestDbRepo} from "../repositories/request-db-repo";

export const responseCountMiddleware = async (req:Request, res:Response, next:NextFunction) =>{
    const interval = 10*1000
    const currentDate = new Date();
    const count = await requestDbRepo.getRequestsCountPer10sec(req.ip, req.url, new Date(currentDate.getTime()-interval));
    console.log("COUNT "+ count)
    if(count > 5){
        console.log("Count requests grate then 5!")
        res.send(429)
        return
    }
    await requestDbRepo.createRequestRow(req.ip, req.url,new Date())
    next();
}