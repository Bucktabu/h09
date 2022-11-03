import {blogsCollection} from "./db";
import {BlogsType, BlogType} from "../types/blogs-type";
import {giveSkipNumber} from "../helperFunctions";

export const blogsRepository = {
    async createNewBlog(newBlog: BlogType): Promise<BlogType | null> {
        try {
            await blogsCollection.insertOne(newBlog)
            return newBlog
        } catch (e) {
            return null
        }
    },

    async giveBlogs(searchNameTerm: string,
                    sortBy: string,
                    sortDirection: string,
                    pageNumber: string,
                    pageSize: string): Promise<BlogsType> {

        return await blogsCollection
            .find({name: {$regex: searchNameTerm, $options: 'i'}}, {projection: {_id: false}})
            .sort(sortBy, sortDirection === 'asc' ? 1 : -1)
            .skip(giveSkipNumber(pageNumber, pageSize))
            .limit(Number(pageSize))
            .toArray()
    },

    async giveTotalCount(searchNameTerm: string): Promise<number> {
        return await blogsCollection.countDocuments({name: {$regex: searchNameTerm, $options: 'i'}})
    },

    async giveBlogById(id: string): Promise<BlogType | null> {
        return await blogsCollection.findOne({id: id}, {projection: {_id: false}})
    },

    async giveBlogName(id: string): Promise<string> {
        const blog = await blogsRepository.giveBlogById(id)

        if (!blog) {
            return ''
        }

        return blog.name
    },

    async updateBlog(blogId: string, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await blogsCollection.updateOne({id: blogId}, {$set: {name: name, youtubeUrl: youtubeUrl}})

        return result.matchedCount === 1
    },

    async deleteBlogById(blogId: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: blogId})

        return result.deletedCount === 1
    },

    async deleteAllBlogs(): Promise<boolean> {
        try {
            await blogsCollection.deleteMany({})
            return true
        } catch (e) {
            console.log('blogsCollection => deleteAllBlogs =>', e)
            return false
        }
    }
}