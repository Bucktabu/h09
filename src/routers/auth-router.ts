import {Request, Response, Router} from "express";
import UserAgent from 'user-agents';
import {v4 as uuidv4} from "uuid";
import {authService} from "../domain/auth-service";
import {securityService} from "../domain/security-service";
import {jwsService} from "../application/jws-service";
import {usersService} from "../domain/user-service";
import {getAuthRouterMiddleware,
        postAuthRouterMiddleware,
        postRegistrationMiddleware,
        postResendingRegistrationEmailMiddleware} from "../middlewares/authRouter-middleware";
import {refreshTokenValidation} from "../middlewares/validation-middleware/refreshToken-validation";
import {createToken} from "../helperFunctions";

export const authRouter = Router({})

authRouter.post('/login',
    postAuthRouterMiddleware,
    async (req: Request, res: Response) => {

        const userDevice = new UserAgent().data.deviceCategory
        // в каком сценарии может быть null
        const deviceInfo = await securityService.giveUserDevice(req.user!.id, userDevice!)

        let deviceId
        if (!deviceInfo) {
            deviceId = uuidv4()
        } else {
            deviceId = deviceInfo.userDevice.deviceId
        }

        const token = await createToken(deviceId)

        if (!deviceInfo) {
            const tokenInfo = await jwsService.giveUserInfoByToken(token.refreshToken)
            await securityService.createUserDevice(req.user!.id, tokenInfo, userDevice!, req.ip)
        }
        console.log('----->> token.refreshToken:', token.refreshToken)
        return res.status(200)
            .cookie('refreshToken', token.refreshToken, {secure: true, httpOnly: true})
            .send({accessToken: token.accessToken})
    }
)

authRouter.post('/registration',
    postRegistrationMiddleware,
    async (req: Request, res: Response) => {

        const result = await authService.createUser(req.body.login, req.body.password, req.body.email)
        console.log('-----> result: ', result)
        return res.sendStatus(204)
    }
)

authRouter.post('/registration-confirmation',
    async (req: Request, res: Response) => {

        const emailConfirmed = await authService.confirmEmail(req.body.code)

        if (!emailConfirmed) {
            return res.status(400).send({errorsMessages: [{ message: 'Bad Request', field: "code" }]})
        }

        return res.sendStatus(204)
    }
)

authRouter.post('/registration-email-resending',
    ...postResendingRegistrationEmailMiddleware,
    async (req: Request, res: Response) => {

        const result = await authService.resendConfirmRegistration(req.body.email)

        if (!result) {
            return res.status(400).json({ errorsMessages: [{ message: 'Wrong email', field: "email" }] }) // поменял send на json и тесты стали проходить
        }

        return res.sendStatus(204)
    }
)

authRouter.post('/refresh-token',
    refreshTokenValidation,
    async (req: Request, res: Response) => {

        await jwsService.addTokenInBlackList(req.cookies.refreshToken)
        const token = await createToken(req.user!.id)

        return res.status(200)
            .cookie('refreshToken', token.refreshToken, {secure: true, httpOnly: true})
            .send({accessToken: token.accessToken})
    }
)

authRouter.post('/logout',
    refreshTokenValidation,
    async (req: Request, res: Response) => {
        await jwsService.addTokenInBlackList(req.cookies.refreshToken)

        return res.sendStatus(204)
    }
)

authRouter.get('/me',
    getAuthRouterMiddleware,
    async (req: Request, res: Response) => {
        const aboutMe = await usersService.aboutMe(req.user!)

        return res.status(200).send(aboutMe)
    }
)