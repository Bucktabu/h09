import {Request, Response, Router} from "express";

import {postsRepository} from "../repositories/posts-repository";
import {blogsRepository} from "../repositories/blogs-repository";
import {usersRepository} from "../repositories/users-repository";
import {commentsRepository} from "../repositories/comments-repository";
import {emailConfirmationRepository} from "../repositories/emailConfirmation-repository";
import {jwtBlackList} from "../repositories/jwtBlackList";
import {securityRepository} from "../repositories/security-repository";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    try {
        await blogsRepository.deleteAllBlogs()
        await commentsRepository.deleteAllComments()
        await emailConfirmationRepository.deleteAllEmailConfirmation()
        await jwtBlackList.deleteAll()
        await postsRepository.deleteAllPosts()
        await securityRepository.deleteAll()
        await usersRepository.deleteAllUsers()

        return res.sendStatus(204)
    } catch (e) {
        console.log('testingRouter => all-data =>', e)
        return res.sendStatus(503)
    }
})