import {Request, Response, Router} from "express";
import {securityService} from "../domain/security-service";
import {refreshTokenValidation} from "../middlewares/validation-middleware/refreshToken-validation";

export const securityRouter = Router({})

securityRouter.get('/devices',
    refreshTokenValidation, // если я записываю в токен айди устройства, то у меня рушится вся логика поиска юзера
    async (req: Request, res: Response) => {
        const activeSessions = await securityService.giveAllActiveSessions(req.user!.id)

        if (!activeSessions) {
            return 404
        }

        return res.status(200).send(activeSessions)
    }
)

securityRouter.delete('/devices',
    refreshTokenValidation,
    async (req: Request, res: Response) => {
        const result = await securityService.deleteAllActiveSessions(req.body.deviseInfo.deviceId, req.user!.id)

        if (!result) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }
)

securityRouter.delete('/devices/:deviceId', // возникает баг или фича, что при удалении единиственной активной сессии, нужно повторно логиниться
    refreshTokenValidation,
    async (req: Request, res: Response) => {

        if (!req.params.deviceId.trim()) {
            return res.sendStatus(404)
        }

        const userId = await securityService.giveDeviseById(req.params.deviceId)

        if (!userId) {
            return res.sendStatus(404)
        }

        if (userId.userId !== req.user!.id) {
            return res.sendStatus(403)
        }

        const isDeleted = await securityService.deleteDeviceById(req.params.deviceId)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }
)