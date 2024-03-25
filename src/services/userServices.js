const User=require("../models/User");
const bcrypt = require("bcryptjs");
const getAllUserService = async(queryData) =>{

    try{
        const {page , limit} = queryData;
        const users = await User.find().limit(limit*1).skip((page-1)*limit).sort({createdAt : -1});
        return {success : true , status : 200 , users , message : "List of all users"};

    }
    catch(error){
        return {success : false , status : 500 , message : "Error while getting the users"}
    }
}

const getAllUsersNoLimitService = async() =>{
    try{
        const users = await User.find();
        return {success : true , users , status : 200 , message : "List of Users"};
    }
    catch(error){
        return {success : false , status : 500 , message : "Error while getting all the users"};
    }
}
const getUserByIdService = async(id) =>{
    try{
        const user = await User.findById(id);
        if(!user){
            return {success : false , status : 404 ,message : "User not found with this id"};
        }

        return {success : true , status : 200 , user , message : "User with a particular id"};
    }
    catch(error){
        return {success : false , status : 500 , message : "Interval server error"};
    }



}


const updateProfileService = async(id , updateData) =>{
    try{
        const user = await User.findByIdAndUpdate(id, updateData , {new : true});
        if(!user){
           return {success : false , status : 404 , message : "User not found"}; 
        }

        return {success : true  , user , status : 200 , message : "User updated successfully"};

    }
    catch(error){
        return {success : false , status : 500 , message : "Internal server error "};
    }

}

const deleteUserservice = async(id) =>{
    try{
        const user=await User.findByIdAndDelete(id);

        if(!user)
        {
            return {success : false ,status : 404 , message : "User not found"};
        }        

        return {success : true, status : 200  , message : "user deleted successfully"};
    }
    catch(error){
        return {success : false, status : 500  , message : "Interval server error"};
    }
}
const addAddressService = async(newAddress , user) =>{

    try{
        user.addresses.push(newAddress);
        await user.save();

        return {success : true , status : 200 ,user , message : "Address added successfully" };
    }
    catch(error){
        return {success : false , status : 500 ,message : "Internal server error"};
    }
}

const deleteAddressService = async(newAddress , user) =>{
    try{
        const adr = user.addresses.find((addr) => addr._id!==newAddress._id);
        user.addresses=adr;
        await user.save();
        return {success : true , status : 200 , user};

    }
    catch(error){
        return {success : false , status : 500 }
    }

}

const changePasswordService = async(userData , user) =>{
    try{
        const { oldPassword, newPassword } = userData;
        const match = await bcrypt.compare(oldPassword , user.password);
        let updatedUser ;
        if(match){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword , salt);
            updatedUser = await User.findByIdAndUpdate(user._id ,{password :hashedPassword} , {new : true});

            return  {success : true , status : 200 , message : "Password updated successfully" , updatedUser};
        }

        return {success : false , status : 400 , message : "Wrong credentials"};


    }
    catch(error){
        return {success : false , status : 500 , message : "Internal server error"};
    }

}


module.exports = {getAllUserService , getAllUsersNoLimitService , getUserByIdService , updateProfileService , deleteUserservice , addAddressService , deleteAddressService , changePasswordService};