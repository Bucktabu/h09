import {NextFunction, Request, Response} from "express";
import {jwsService} from "../../application/jws-service";
import {usersService} from "../../domain/user-service";
import {securityService} from "../../domain/security-service";

export const refreshTokenValidation = async (req: Request, res: Response, next: NextFunction) => {

    const tokenInBlackList = await jwsService.checkTokenInBlackList(req.cookies.refreshToken)

    if (tokenInBlackList) {
        return res.sendStatus(401)
    }

    const deviseInfo = await jwsService.giveUserInfoByToken(req.cookies.refreshToken)

    if (!deviseInfo) {
        return res.sendStatus(401)
    }

    const devise = await securityService.giveUserId(deviseInfo.id)

    if (!devise) {
        return res.sendStatus(401)
    }

    const user = await usersService.giveUserById(devise.userId)

    if (!user) {
        return res.sendStatus(401)
    }

    await jwsService.addTokenInBlackList(req.cookies.refreshToken)

    req.user = user
    //req.body.device = devise
    next()
}