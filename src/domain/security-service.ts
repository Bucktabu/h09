import {securityRepository} from "../repositories/security-repository";
import {DeviceSecurityType} from "../types/deviceSecurity-type";
import {activeSessionsOutputType} from "../dataMapping/toActiveSessionsOutputType";

export const securityService = {
    async createUserDevice(userId: string, tokenInfo: any, userDevice: any, ipAddress: string): Promise<DeviceSecurityType | null> {

        const createDevice: DeviceSecurityType = {
            userId,
            userDevice: {
                deviceId: tokenInfo.deviceId,
                deviceTitle: userDevice.deviceCategory,
                browser: userDevice.userAgent,
                ipAddress,
                iat: tokenInfo.iat,
                exp: tokenInfo.exp
            }
        }
        console.log('-----> createDevice:', createDevice)

        const createdDevice = await securityRepository.createUserDevice(createDevice)

        if (!createdDevice) {
            return null
        }

        return await securityRepository.giveUserDevice(userId, userDevice.deviceCategory, userDevice.userAgent)
    },

    async checkUserDevice(userId: string, deviceId: string) {
        return await securityRepository.checkUserDevice(userId, deviceId)
    },

    async giveUserDevice(userId: string, userDevice: any): Promise<DeviceSecurityType | null> {
        return await securityRepository.giveUserDevice(userId, userDevice.deviceCategory, userDevice.userAgent)
    },

    async giveAllActiveSessions(userId: string) {
        const activeSessions = await securityRepository.giveAllActiveSessions(userId)

        if (!activeSessions) {
            return null
        }

        return activeSessions.map(activeSession => activeSessionsOutputType(activeSession))
    },

    async giveDeviceById(deviceId: string): Promise<DeviceSecurityType | null> {
        const device = await securityRepository.giveDeviseById(deviceId)

        if (!device) {
            return null
        }

        return device
    },

    async deleteDeviceById(deviceId: string): Promise<boolean> {
        return await securityRepository.deleteDeviceById(deviceId)
    },

    async deleteAllActiveSessions(userId: string, deviceId: string): Promise<boolean> {
        const result = await securityRepository.deleteAllActiveSessions(userId, deviceId)

        if (!result) {
            return false
        }

        return true
    }
}