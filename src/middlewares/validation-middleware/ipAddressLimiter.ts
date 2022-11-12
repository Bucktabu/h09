import {NextFunction, Request, Response} from "express";
import {ipAddressCollection} from "../../repositories/db";

export const ipAddressLimiter = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip
    const endpoint = req.url
    const connectionAt = Date.now()
    await ipAddressCollection.insertOne({ipAddress: ip, endpoint, connectionAt})
    const connectionsCount = await ipAddressCollection.countDocuments({ipAddress: ip, endpoint, connectionAt: {$gte: (connectionAt - 10000)}})
    if (connectionsCount > 5) return res.sendStatus(429)
    return next()
    // const ipAddress = await ipAddressCollection.findOne({ipAddress: req.ip})
    //
    // if (!ipAddress) {
    //     await ipAddressCollection.insertOne({
    //         ipAddress: req.ip,
    //         at: Date.now(),
    //         timer: 0,
    //         count: 0
    //     })
    //     console.log('here')
    //     return next()
    // }
    //
    // const count = ipAddress.count + 1
    // const timer = Date.now() - ipAddress.at
    // console.log(count, timer)
    // await ipAddressCollection.updateOne({ipAddress: req.ip}, {$set: {count: count, timer}})
    //
    // if (ipAddress.timer > 10000) {
    //     await ipAddressCollection.updateOne({ipAddress: req.ip}, {$set: {at: Date.now(), count: 0}})
    // }
    //
    // if (ipAddress.count === 4) {
    //     await ipAddressCollection.updateOne({ipAddress: req.ip}, {$set: {at: Date.now(), count: 3}})
    //     console.log('429')
    //     return res.sendStatus(429)
    // }
    //
    // return next()
}