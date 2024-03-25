const Blog=require("../models/blog.js");

const User = require('../models/User.js');

const getAllBlogService = async(queryData) =>{

    try{
        const { page=1, limit=10 } = queryData;
        const blogs=await Blog.find().limit(limit*1).skip((page-1)*limit).sort({ createdAt: -1 });

        return {success : true ,status : 200 , blogs};

    }
    catch(error){
        return {success : false , status : 500};
    }


}

const getBlogByIdService =  async(id) =>{
    try{
        const blog = await Blog.findById(id);

        return {success : true ,status : 200 ,  blog};
    }
    catch(error){
        return {success : false , status : 500};
    }
}




const createBlogService = async (data, imageUrl , user) => {
  try {
    
    const { title, content } = data;
    console.log("new");
    console.log(imageUrl);
    const blog = new Blog({
      title,
      content,
      imgSrc : imageUrl,
      author: user,
    });

    await blog.save();

    if (!user.roles.includes("blogger")) {
      user.roles.push("blogger");
      await user.save();
    }

    return { success: true, status: 201, message: "Blog created successfully" };
  } catch (error) {
    return { success: false, status: 500, message: error.message };
  }
};

const deleteBlogService = async (blogId) => {
  try {
    const blog = await Blog.findByIdAndDelete(blogId);

    if (!blog) {
      return { success: false, status: 404, message: "Blog not found" };
    }

    return { success: true, status: 200, message: "Blog deleted successfully" };
  } catch (error) {
    return { success: false, status: 500, message: error.message };
  }
};

const updateBlogService = async(id , updates) =>{
  try{
    const blog = await Blog.findByIdAndUpdate(id , updates , {new : true});
    if(!blog){
      return {success : false , status : 404 , message : "Blog not found"};
    }
    return {success : true , blog ,status : 200 , message : "Blog updated successfully "};


  }
  catch(error){

      return {success : false ,status : 500 , message : "Internal server error"};
  }
}






module.exports = {getAllBlogService , getBlogByIdService , createBlogService , deleteBlogService , updateBlogService};