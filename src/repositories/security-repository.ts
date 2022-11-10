import {postsCollection, securityCollection} from "./db";
import {DeviceSecurityType} from "../types/deviceSecurity-type";

export const securityRepository = {
    async createUserDevice(createDevice: DeviceSecurityType) {
        try {
            return await securityCollection.insertOne(createDevice)
        } catch (e) {
            return null
        }
    },

    async giveLastSeveralSessions(ipAddress: string, sessionsСount: number) {
        return await securityCollection
            .find({'userDevice.ipAddress': ipAddress})
            .sort('userDevice.iat', 'desc')
            .limit(sessionsСount)
            .toArray()
    },

    async giveAllActiveSessions(userId: string) {
        return await securityCollection
            .find({userId}, {projection: {_id: false}}).toArray()
    },

    async giveDeviseById(deviceId: string) {
        return await securityCollection
            .findOne({'userDevice.deviceId': deviceId}, {projection: {_id: false}})
    },

    async updateCurrentActiveSessions(deviceId: string, iat: string, exp: string): Promise<boolean> {
        const result = await securityCollection
            .updateOne({
                    'userDevice.deviceId': deviceId
                },
                {
                    $set: {'userDevice.iat': iat, 'userDevice.exp': exp}
                }
            )

        return result.matchedCount === 1
    },

    async deleteDeviceById(deviceId: string): Promise<boolean> {
        const result = await securityCollection.deleteOne({'userDevice.deviceId': deviceId})

        return result.deletedCount === 1
    },

    async deleteAllActiveSessions(userId: string, deviceId: string): Promise<boolean> {
        try {
            await securityCollection
                .deleteMany({userId, 'userDevice.deviceId': {$ne: deviceId}})
            return true
        } catch (e) {
            console.log('securityCollection => deleteAllActiveSessions =>', e)
            return false
        }
    },

    async deleteAll(): Promise<boolean> {
        try {
            await securityCollection.deleteMany({})
            return true
        } catch (e) {
            console.log('securityCollection => deleteAll =>', e)
            return false
        }
    }
}