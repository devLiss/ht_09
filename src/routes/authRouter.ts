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

export const authRouter = Router({})

authRouter.post('/login', body('login').trim().isLength({min:1}),body('password').trim().isLength({min:1}) , inputValidationMiddleware, async (req:Request, res:Response)=>{
    const user = await userService.checkCredentials(req.body.login, req.body.password)
    if(!user){
        res.send(401)
        return
    }
    const token = await jwtService.createJwt(user)
    console.log(token)
    res.status(200).send(token)
})

authRouter.get('/me', authMiddleware, async (req:Request, res:Response)=>{
    console.log(req)
    //@ts-ignore
    const user = await userService.getUserById(req.user!.userId)
    res.status(200).send(user)
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