const Blog=require("../models/blog");
const User = require("../models/User");
const {getAllBlogService , getBlogByIdService , createBlogService , deleteBlogService , updateBlogService} = require('../services/blogServices.js');
const {createBlogValidationSchema} = require('../validations/blogValidations.js');

const getAllBlogs=async (req,res,next)=>
{
    try
    {
        // const { page=1, limit=10 }=req.query;
        // const blogs=await Blog.find().limit(limit*1).skip((page-1)*limit).sort({ createdAt: -1 });

        // return res.json(blogs);
        const result = await getAllBlogService(req.query);
        
        if(result.success){
            return res.status(result.status).json(result.blogs);
        }

        return res.status(result.status).json({message : "error while getting blogs"})
    }
    catch(err)
    {
        return res.status(500).json({message : "error while getting blogs"})
    }
};

const getBlog=async (req,res,next)=>
{
    try
    {
        const { id }=req.params;
        // const blog=await Blog.findById(id);
        const result = await getBlogByIdService(id);
        if(result.success){
            return res.status(result.status).json(result.blog);
        }
        return res.status(result.status).json({message : "error while getting blog"})
    }
    catch(err)
    {
        return res.status(500).json({message : "error while getting blog"})
    }
};

const createBlog=async (req,res,next)=>
{
    try
    {
        // const { title, content }=req.body;
        // const blog=new Blog({
        //     title,
        //     content,
        //     author: req.user
        // });

        // await blog.save();

        // const userId=req.user._id;
        // const user = await User.findById(userId);

        // if (!user) {
        //     return res.status(404).json({ message: "User not found" });
        // }

        // if (!user.roles.includes("blogger")) {
        //     user.roles.push("blogger");
        //     await user.save();
        // }

        // return res.status(201).json({ msg: "Blog created successfully" });
        const {title , content , imageUrl} = req.body;
        const data = {
            title : title , 
            content : content
        }
        const { error, value } = createBlogValidationSchema.validate(data);
        
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

          
        
          const { success, status, message } = await createBlogService(value,imageUrl , req.user);

          if (!success) {
            return res.status(status).json({ success: false, message });
          }
      
          return res.status(status).json({ success: true, message });


    }
    catch(err)
    {
        next(err);
    }
};

const updateBlog=async (req,res,next)=>
{
    try
    {
        const { id }=req.params;
        const updates=req.body;

        // const blog=await Blog.findByIdAndUpdate(id, updates, { new: true });

        // if(!blog)
        // {
        //     return res.status(404).json({ msg: "Blog not found" });
        // }

        // return res.json(blog);
        const result = await updateBlogService(id , updates);
        if(result.success){
            return res.status(result.status).json(result.blog);
        }

        return res.status(result.status).json(result.message);
    }
    catch(err)
    {
        next(err);
    }
};

const deleteBlog=async (req,res,next)=>
{
    try
    {
        // const { id }=req.params;
        // const blog=await Blog.findByIdAndDelete(id);

        // if(!blog)
        // {
        //     return res.status(404).json({ msg: "Blog not found" });
        // }

        // return res.json({ msg: "Blog deleted successfully" });
        const { id } = req.params;

    const { success, status, message } = await deleteBlogService(id);

    return res.status(status).json({ success, message });
    }
    catch(err)
    {
        next(err);
    }
};

const addComment=async (req,res,next)=>
{
    try
    {
        const { id }=req.params;
        const updates=req.body;

        const blog=await Blog.findByIdAndUpdate(id, updates, { new: true });

        if(!blog)
        {
            return res.status(404).json({ msg: "Blog not found" });
        }

        return res.json(blog);
    }
    catch(err)
    {
        next(err);
    }
};

module.exports={
    getAllBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    addComment
};