const mongoose=require("mongoose");

async function connectDB()
{
    try
    {
       
        await mongoose.connect("mongodb+srv://rehan:3456tyui@ecommerce-web.ljy5jgh.mongodb.net/Shopping");

        console.log('MongoDB connection established');
    }
    catch(err)
    {
        console.error("Error connecting to MongoDB",err);
    }
}

module.exports=connectDB;