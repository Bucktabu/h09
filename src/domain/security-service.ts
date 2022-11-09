import {securityRepository} from "../repositories/security-repository";
import {DeviceSecurityType} from "../types/deviceSecurity-type";
import {activeSessionsOutputType} from "../dataMapping/toActiveSessionsOutputType";

export const securityService = {
    async createUserDevice(userId: string, tokenInfo: any, userDevice: string, ipAddress: string): Promise<DeviceSecurityType | null> {
        console.log('--->> userId from security service', userId)
        const createDevice: DeviceSecurityType = {
            userId,
            userDevice: {
                deviceTitle: userDevice,
                deviceId: tokenInfo.deviceId,
                ipAddress,
                iat: tokenInfo.iat,
                exp: tokenInfo.exp
            }
        }

        const createdDevice = await securityRepository.createUserDevice(createDevice)

        if (!createdDevice) {
            return null
        }

        return await securityRepository.giveUserDevice(createDevice.userId, createDevice.userDevice.deviceTitle)
    },

    async checkUserDevice(userId: string, deviceId: string) {
        return await securityRepository.checkUserDevice(userId, deviceId)
    },

    async giveUserDevice(userId: string, userDevice: string): Promise<DeviceSecurityType | null> {
        return await securityRepository.giveUserDevice(userId, userDevice)
    },

    async giveAllActiveSessions(userId: string) {
        const activeSessions = await securityRepository.giveAllActiveSessions(userId)

        if (!activeSessions) {
            return null
        }

        return activeSessions.map(activeSession => activeSessionsOutputType(activeSession))
    },

    async giveDeviseById(deviceId: string): Promise<DeviceSecurityType | null> {
        const device = await securityRepository.giveDeviseById(deviceId)

        if (!device) {
            return null
        }

        return device
    },

    async deleteDeviceById(deviceId: string): Promise<boolean> {
        return await securityRepository.deleteDeviceById(deviceId)
    },

    async deleteAllActiveSessions(deviceId: string, userId: string): Promise<boolean> {
        const currentSession = await securityRepository.giveDeviseById(deviceId)

        if (!currentSession) {
            return false
        }

        await securityRepository.deleteAllActiveSessions()
        await securityRepository.createUserDevice(currentSession!)

        return true
    }
}