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

export const authRouter = Router({})

authRouter.post('/login', body('login').trim().isLength({min:1}),body('password').trim().isLength({min:1}) , inputValidationMiddleware, async (req:Request, res:Response)=>{
    const user = await userService.checkCredentials(req.body.login, req.body.password)
    if(!user){
        res.send(401)
        return
    }
    const tokens = await jwtService.generateTokens(user);
    res.cookie('refreshToken', tokens.refreshToken, {
        //maxAge: 24 * 3600,
        secure:true,
        expires:  dayjs().add(20, "seconds").toDate(),
        httpOnly: true,
      });
    res.status(200).send({
        accessToken:tokens.accessToken
    })
})
authRouter.post('/refresh-token',async (req:Request, res:Response)=> {

    if(!req.cookies.refreshToken){
        res.sendStatus(401)
        return
    }
    console.log(req.cookies.refreshToken)
    const refreshToken = req.cookies.refreshToken
    const userId = await jwtService.getUserByRefreshToken(refreshToken)
    console.log("REfresh")
    console.log(userId)
    if(!userId){
        res.sendStatus(401)
        return
    }
    const check = await jwtService.checkRevokedTokens(userId, refreshToken)
    if(check){
        res.sendStatus(401)
        return
    }
    const user = await userService.getUserById(userId);
    if(!user){
        res.sendStatus(401)
        return
    }
    const tokens = await jwtService.generateTokens(user);
    console.log(tokens)
    await jwtService.revokeToken(userId, refreshToken)
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
    const userId = await jwtService.getUserByRefreshToken(refreshToken)
    if(!userId){
        res.sendStatus(401)
        return
    }
    const check = await jwtService.checkRevokedTokens(userId, refreshToken)
    if(check){
        res.status(401).send("Token in Blacklist")
        return
    }
    await jwtService.revokeToken(userId, refreshToken)
    res.clearCookie("refreshToken");
    res.sendStatus(204)
})
authRouter.get('/me', authMiddleware, async (req:Request, res:Response)=>{
    //@ts-ignore
    console.log(req.user)
    //@ts-ignore
    const user = await userService.getUserById(req.user!.userId)
    res.status(200).send(user)
})