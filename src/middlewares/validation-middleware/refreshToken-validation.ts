import {NextFunction, Request, Response} from "express";
import {jwsService} from "../../application/jws-service";
import {usersService} from "../../domain/user-service";
import {securityService} from "../../domain/security-service";

export const refreshTokenValidation = async (req: Request, res: Response, next: NextFunction) => {
    // Проверяем токен в блеклисте. Тк в токене у нас хранится айди девайса, по этому айди
    // достаем из бд информацию о девайсе, в которой к айди девайса привязан айди пользователя
    // и находим пользователя по айди
    const tokenInBlackList = await jwsService.checkTokenInBlackList(req.cookies.refreshToken)

    if (tokenInBlackList) {
        return res.sendStatus(401)
    }

    const deviseInfo = await jwsService.giveUserInfoByToken(req.cookies.refreshToken)

    if (!deviseInfo) {
        return res.sendStatus(401)
    }

    const devise = await securityService.giveDeviseById(deviseInfo.id)
    console.log('----->> devise: ', devise)
    if (!devise) {
        return res.sendStatus(401)
    }

    const user = await usersService.giveUserById(devise.userId)

    if (!user) {
        console.log('4')
        return res.sendStatus(401)
    }

    req.user = user
    //req.body.device = devise
    next()
}