import {NextFunction, Request, Response} from "express";
import {jwsService} from "../../application/jws-service";
import {usersService} from "../../domain/user-service";

export const refreshTokenValidation = async (req: Request, res: Response, next: NextFunction) => {

    const tokenInBlackList = await jwsService.checkTokenInBlackList(req.cookies.refreshToken)

    if (tokenInBlackList) {
        return res.sendStatus(401)
    }

    const userInfo = await jwsService.giveUserInfoByToken(req.cookies.refreshToken)

    if (!userInfo) {
        return res.sendStatus(401)
    }

    const user = await usersService.giveUserById(userInfo.userId)

    if (!user) {
        return res.sendStatus(401)
    }

    await jwsService.addTokenInBlackList(req.cookies.refreshToken)

    req.user = user
    next()
}