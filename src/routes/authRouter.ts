import {Router,Request, Response} from "express";
import {userService} from "../domain/user-service";
import {
    emailNotExistsValidation,
    emailRegValidation,
    emailVAlidator, loginRegValidation,
    loginValidator,
    passwordValidator
} from "../middlewares/userMiddleware";
import {inputValidationMiddleware} from "../middlewares/inputValidationMiddleware";
import {body} from "express-validator";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../middlewares/authMiddleware";
import {authService} from "../domain/auth-service";
import dayjs from "dayjs";
import {sessionService} from "../domain/session-service";
import add from "date-fns/add";
import {sessionDbRepo} from "../repositories/session-db-repo";

export const authRouter = Router({})

authRouter.post('/login', body('login').trim().isLength({min:1}),body('password').trim().isLength({min:1}) , inputValidationMiddleware, async (req:Request, res:Response)=>{
    const user = await userService.checkCredentials(req.body.login, req.body.password)
    if(!user){
        res.send(401)
        return
    }
    console.log(req.headers["user-agent"]);

    /*const session = await sessionService.addSession(req.ip, req.headers["user-agent"]!, add(new Date(), {seconds:10}),user.id)

    const tokens = await jwtService.generateTokens(user, session.deviceId);
    console.log(tokens.refreshToken)*/

    const session = await sessionService.createSession(user, req.ip, req.headers["user-agent"]!);

    console.log(session.currentSession)
    res.cookie('refreshToken', session.refreshToken, {
        //maxAge: 24 * 3600,
        secure:true,
        expires:  dayjs().add(20, "seconds").toDate(),
        httpOnly: true,
      });
    res.status(200).send({
        accessToken:session.accessToken
    })
})
authRouter.post('/refresh-token',async (req:Request, res:Response)=> {

    if(!req.cookies.refreshToken){
        res.sendStatus(401)
        return
    }
    console.log(req.cookies.refreshToken)
    const refreshToken = req.cookies.refreshToken
    //const userId = await jwtService.getUserByRefreshToken(refreshToken)
    /*const payload = await jwtService.getPayloadByRefreshToken(refreshToken)
    if(!payload){
        res.sendStatus(401)
        return
    }

    const tokens = await jwtService.generateTokens(payload.userId,payload.deviceId);*/

    const tokens = await sessionService.updateSession(refreshToken);
    if(!tokens){
        res.sendStatus(401);
        return
    }
    res.cookie('refreshToken', tokens.refreshToken, {
        expires:  dayjs().add(20, "seconds").toDate(),
        secure:true,
        httpOnly: true,
    });
    res.status(200).send({
        accessToken:tokens.accessToken
    })
})
authRouter.post('/registration-confirmation',async (req:Request, res:Response)=>{
    const result = await authService.confirmEmail(req.body.code)

    console.log(result);
    if(result){
        res.status(204).send(result);
        return
    }
    res.status(400).send({errorsMessages:[{
            message:"некорректный код",
            field:"code"
        }]})
})
authRouter.post('/registration',loginValidator, passwordValidator, loginRegValidation, emailRegValidation, inputValidationMiddleware,async (req:Request, res:Response)=>{

    const createdUser = await userService.createUser(req.body.login, req.body.password, req.body.email)
    console.log(createdUser);
    if(!createdUser){
        res.sendStatus(400)
        return
    }
    res.sendStatus(204)
})
authRouter.post('/registration-email-resending',emailNotExistsValidation, inputValidationMiddleware,async (req:Request, res:Response)=>{
    const result = await authService.resendConfirmCode(req.body.email)
    res.sendStatus(204)
})
authRouter.post('/logout',async (req:Request, res:Response)=>{

    if(!req.cookies.refreshToken){
        res.sendStatus(401)
        return
    }
    const refreshToken = req.cookies.refreshToken
    const payload = await jwtService.getPayloadByRefreshToken(refreshToken)
    if(!payload){
        res.sendStatus(401)
        return
    }

    await sessionService.removeSessionByDeviceId(payload.userId,payload.deviceId);
    res.clearCookie("refreshToken");
    res.sendStatus(204)
})
authRouter.get('/me', authMiddleware, async (req:Request, res:Response)=>{
    //@ts-ignore
    console.log(req.user)
    //@ts-ignore
    const user = await userService.getUserById(req.user!.id)
    //@ts-ignore
    delete Object.assign(user, {["userId"]: user["id"] })["id"];
    res.status(200).send(user)
})