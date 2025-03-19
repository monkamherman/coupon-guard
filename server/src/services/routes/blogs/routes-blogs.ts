import { Router } from "express";

import BlogController from "../../../controlleurs/blogs/blog_controllers";

const blogs = Router()

blogs.post('',  BlogController.postBlog)
blogs.post('/file',  BlogController.blogFile)



export default (blogs)


