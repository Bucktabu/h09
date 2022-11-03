import {postsCollection} from "./db";
import {PostsType, PostType} from "../types/posts-type";
import {giveSkipNumber} from "../helperFunctions";
import {WithId} from "mongodb";

export const postsRepository = {
    async createNewPost(newPost: PostType): Promise<PostType | null> {
        try {
            await postsCollection.insertOne(newPost)
            return newPost
        } catch (e) {
            return null
        }
    },

    async givePosts(sortBy: string,
                    sortDirection: 'asc' | 'desc',
                    pageNumber: string,
                    pageSize: string,
                    blogId: string | undefined): Promise<PostsType> {

        return await postsCollection
            .find({blogId: {$regex: blogId ? blogId : '', $options: 'i'}}, {projection: {_id: false}})
            .sort(sortBy, sortDirection === 'asc' ? 1 : -1)
            .skip(giveSkipNumber(pageNumber, pageSize))
            .limit(Number(pageSize))
            .toArray()
    },

    async giveTotalCount(blogId: string | undefined): Promise<number> {
        return await postsCollection.countDocuments({blogId: {$regex: blogId ? blogId : '', $options: 'i'}})
    },

    async givePostById(postId: string): Promise<PostType | null> {
       return await postsCollection.findOne({id: postId}, {projection: {_id: false}})
    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const result = await postsCollection.updateOne({id: id}, {$set: {title: title, shortDescription: shortDescription, content: content, blogId: blogId}})

        return result.matchedCount === 1
    },

    async deletePostById(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id: id})

        return result.deletedCount === 1
    },

    async deleteAllPosts(): Promise<boolean> {
        try {
            await postsCollection.deleteMany({})
            return true
        } catch (e) {
            console.log('postsCollection => deleteAllPosts =>', e)
            return false
        }
    }
}