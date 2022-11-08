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

    async checkUserDevice(userId: string, deviceId: string) {
        return await securityCollection
            .findOne({$and: [{userId}, {'userDevice.deviceId': deviceId}]})
    },

    async giveUserDevice(userId: string, userDevice: string): Promise<DeviceSecurityType | null> {
        return await securityCollection
            .findOne({$and: [{userId}, {'userDevice.deviceTitle': userDevice}]})
    },

    async giveAllActiveSessions(userId: string) {
        return await securityCollection
            .find({userId}, {projection: {_id: false}}).toArray()
    },

    async giveUserId(deviceId: string) {
        return await securityCollection.findOne({deviceId}/*, {projection: {_id: false, userDevice: false}}*/)
    },

    async deleteDeviceById(deviceId: string) {
        const result = await securityCollection.deleteOne({deviceId})

        return result.deletedCount === 1
    },

    async deleteAllActiveSessions(userId: string) {
        return await securityCollection.deleteMany({userId: {$nin: [userId]}})
    },

    async deleteAll(): Promise<boolean> {
        try {
            await securityCollection.deleteMany({})
            return true
        } catch (e) {
            console.log('postsCollection => deleteAllPosts =>', e)
            return false
        }
    }
}