import {postsCollection, tokenBlackList} from "./db";

export const jwtBlackList = {
    async removeRefreshToken(refreshToken: string) {
        return await tokenBlackList.insertOne({refreshToken})
    },

    async giveToken(refreshToken: string) {
        return await tokenBlackList.findOne({refreshToken})
    },

    async deleteAll(): Promise<boolean> {
        try {
            await postsCollection.deleteMany({})
            return true
        } catch (e) {
            console.log('postsCollection => deleteAllPosts =>', e)
            return false
        }
    }
}