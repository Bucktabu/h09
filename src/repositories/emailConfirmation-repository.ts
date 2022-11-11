import {emailConfirmCollection, usersCollection} from "./db";
import {EmailConfirmationType} from "../types/email-confirmation-type";

export const emailConfirmationRepository = {
    async createEmailConfirmation(emailConfirmation: EmailConfirmationType) {
        try {
            await emailConfirmCollection.insertOne(emailConfirmation)
            return emailConfirmation
        } catch (e) {
            return null
        }
    },

    async giveEmailConfirmationByCodeOrId(codeOrId: string): Promise<EmailConfirmationType | null> {
        return await emailConfirmCollection
            .findOne({$or: [{confirmationCode: codeOrId}, {id: codeOrId}]})
    },

    async giveConfirmationByIpAddress(ipAddress: string) {
        return await emailConfirmCollection
            .find({'accountData.ipAddress': ipAddress}, {projection: {_id: false, accountData: false}})
            .toArray()
    },

    // async updateConfirmationDate(ipAddress: string) {
    //     const result = await usersCollection.updateMany({'accountData.ipAddress': ipAddress}, {$set: {lastConfirmation}})
    // },

    async updateConfirmationCode(id: string, confirmationCode: string) {
        let result = await emailConfirmCollection
            .updateOne({id}, {$set: {confirmationCode}})

        return result.modifiedCount === 1
    },

    async updateConfirmationInfo(id: string) {
        let result = await emailConfirmCollection
            .updateOne({id}, {$set: {isConfirmed: true}})

        return result.modifiedCount === 1
    },

    async deleteAllEmailConfirmation(): Promise<boolean> {
        try {
            await emailConfirmCollection.deleteMany({})
            return true
        } catch (e) {
            console.log('blogsCollection => deleteAllBlogs =>', e)
            return false
        }
    }
}