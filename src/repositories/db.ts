import * as dotenv from "dotenv";
dotenv.config()

import {BlogType} from "../types/blogs-type";
import {CommentBDType} from "../types/comment-type";
import {DeviceSecurityType} from "../types/deviceSecurity-type";
import {EmailConfirmationType} from "../types/email-confirmation-type";
import {MongoClient} from 'mongodb';
import {PostType} from "../types/posts-type";
import {TokenType} from "../types/token-type";
import {UserDBType} from "../types/user-type";
import {UserIpAddressType} from "../types/UserIpAddress";

const mongoUri = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/?maxPoolSize=20&w=majority';

const client = new MongoClient(mongoUri)
const db = client.db('blogsAndPostsDb')

export const blogsCollection = db.collection<BlogType>('blogs')
export const commentsCollection = db.collection<CommentBDType>('comments')
export const ipAddressCollection = db.collection<UserIpAddressType>('ipAddress')
export const securityCollection = db.collection<DeviceSecurityType>('deviceSecurity')
export const emailConfirmCollection = db.collection<EmailConfirmationType>('emailConfirm')
export const postsCollection = db.collection<PostType>('posts')
export const tokenBlackList = db.collection<TokenType>('tokenBlackList')
export const usersCollection = db.collection<UserDBType>('users')

export async function runDb() {
    try {
        await client.connect()
        await client.db('blogsAndPostsDb').command({ping: 1})
        console.log(`Connected successfully to mongo server: ${mongoUri}`)
    } catch {
        console.log('Can`t connect to db')
        await client.close()
    }
}