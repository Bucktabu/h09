import {usersCollection} from "./db";
import {UserDBType, UsersType} from "../types/user-type";
import {giveSkipNumber} from "../helperFunctions";

export const usersRepository = {
    async createNewUser(newUser: UserDBType): Promise<UserDBType | null> {
        try {
            await usersCollection.insertOne(newUser)
            return newUser
        } catch (e) {
            return null
        }
    },

    async giveUsers(sortBy: string,
                    sortDirection: string,
                    pageNumber: string,
                    pageSize: string,
                    searchLoginTerm: string,
                    searchEmailTerm: string): Promise<UsersType> {

        return await usersCollection
            .find({$and: [{login: {$regex: searchLoginTerm, $options: 'i'}},
                               {email: {$regex: searchEmailTerm, $options: 'i'}}]},
                {projection: {_id: false, passwordHash: false, passwordSalt: false}})
            .sort(sortBy, sortDirection === 'asc' ? 1 : -1)
            .skip(giveSkipNumber(pageNumber, pageSize))
            .limit(Number(pageSize))
            .toArray()
    },

    async giveTotalCount(searchLoginTerm: string, searchEmailTerm: string): Promise<number> {
        return await usersCollection
            .countDocuments({$and: [{login: {$regex: searchLoginTerm, $options: 'i'}},
                                         {email: {$regex: searchEmailTerm, $options: 'i'}}]})
    },

    async giveUserById(id: string): Promise<UserDBType | null> {
        return await usersCollection.findOne({id})
    },

    async giveUserByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
    },

    async deleteUserById(userId: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: userId})
        return result.deletedCount === 1
    },

    async deleteAllUsers(): Promise<boolean> {
        try {
            await usersCollection.deleteMany({})
            return true
        } catch (e) {
            console.log('blogsCollection => deleteAllBlogs =>', e)
            return false
        }
    }
}