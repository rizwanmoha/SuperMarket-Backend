const User=require("../models/User");
const bcrypt = require("bcryptjs");
const {getAllUserService , getAllUsersNoLimitService , getUserByIdService , updateProfileService , deleteUserservice , addAddressService , deleteAddressService , changePasswordService} = require('../services/userServices');
const {addAddressValidationSchema , changePasswordValidation} = require('../validations/userValidation');
const getAllUsers=async (req,res,next)=>
{
    try
    {
        const { page=1, limit=10 }=req.query;
        const queryData = {page : 1 , limit : 10};
        // const users=await User.find().limit(limit*1).skip((page-1)*limit).sort({ createdAt: -1 });

        // return res.json(users);
        const result = await getAllUserService(queryData);
        if(result.success){
            return res.status(result.status).json(result.users);
        }

        return res.status(result.status).json({message : result.message});
    }
    catch(err)
    {
        next(err);
    }
};
const getAllUsersNoLimit = async (req, res, next) => {
  try {
    // const users = await User.find()
    // return res.json(users);

    const result = await getAllUsersNoLimitService();
    if(result.success){
        return res.status(result.status).json(result.users);
    }

    return res.status(result.status).json({message : result.message});
  } catch (err) {
    next(err);
  }
};
const getUserById=async (req,res,next)=>
{
    try
    {
        const { id }=req.params;
        // const user=await User.findById(id);

        // if(!user)
        // {
        //     return res.status(404).json({ msg: "User not found" });
        // }

        // return res.json(user);
        const result = await getUserByIdService(id);
        if(result.success){
            return res.status(result.status).json(result.user);

        }

        return res.status(result.success).json({message : result.message});
    }
    catch(err)
    {
        next(err);
    }
};

const updateProfile=async (req,res,next)=>
{
    try
    {
        const id =req.user._id;
        const update=req.body;
        // const user=await User.findByIdAndUpdate(id,update,{ new: true });

        // if(!user)
        // {
        //     return res.status(404).json({ msg: "User not found" });
        // }

        // return res.json(user);
        const result = await updateProfileService(id , update);
        if(result.success){
            return res.status(result.status).json(result.user);

        }
        return res.status(result.status).json({message : result.message});
    }
    catch(err)
    {
        next(err);
    }
};

const deleteUser=async (req,res,next)=>
{
    try
    {
        const { id }=req.params;
        // const update=req.body;
        // const user=await User.findByIdAndDelete(id);

        // if(!user)
        // {
        //     return res.status(404).json({ msg: "User not found" });
        // }

        // return res.json({ msg: "User deleted successfully" });
        const result = await deleteUserservice(id);
        // if(result.success){
        //     return  res.status(result.status).json({msg : result.message});
        // }
        return  res.status(result.status).json({msg : result.message});
    }
    catch(err)
    {
        next(err);
    }
};

const addAddress=async (req,res,next)=>
{
    
    
    try {
        // const { name, phoneNumber, street, city, landmark, state, pincode } = req.body;
        // const newAddress = {
        //     name,
        //     phoneNumber,
        //     street,
        //     city,
        //     landmark,
        //     state,
        //     pincode
        // };

        // const user=req.user;
        // user.addresses.push(newAddress);
        
        // await user.save();

        // res.status(201).json({ message: 'Address added successfully', user });
        // console.log("coming here");
        const {error , value} = addAddressValidationSchema.validate(req.body);
        if(error){
            return res.status(400).json({ message: 'Validation Failed', error: error.details[0].message });
        }
        const user = req.user;
        const result = await addAddressService(value , user);
        if(result.success){
            return res.status(result.status).json({user : result.user , message : "Address added successfully"});
        }
        return res.status(result.status).json({message : result.message});

    } catch (err) {
        next(err);
    }

};

const deleteAddress=async (req,res,next)=>
{
   
    
    try {
        const {_id, name, phoneNumber, street, city, landmark, state, pincode } = req.body;
        const newAddress = {
            _id,
            name,
            phoneNumber,
            street,
            city,
            landmark,
            state,
            pincode
        };

        const user=req.user;
        // const adr = user.addresses.find((addr) => addr._id !== newAddress._id); 
        // user.addresses=adr;
        // await user.save();
        // res.status(201).json({ message: 'Address deleted successfully', user });
        const result = await deleteAddressService(newAddress , user);
        if(result.success){
            return res.status(result.status).json({message : "Address deleted successfully" , user : result.user});
        }

        return res.status(result.status).json({message : "Error while deleting the user address"});
    } catch (err) {
        next(err);
    }

};
const changePassword = async(req,res,next)=>{
    try {
        // const { oldPassword, newPassword } = req.body;
        // if(!oldPassword || !newPassword ){
        //     return res.status(404).json({ msg: "Current Password or New Password not provided." });
        // }
        // const match = await bcrypt.compare(oldPassword, req.user.password);
        // let updatedUser;
        // if(match){
        //     const salt = await bcrypt.genSalt(10);
        //     const hashedPassword = await bcrypt.hash(newPassword, salt);
        //     updatedUser = await User.findByIdAndUpdate(req.user._id,{password:hashedPassword},{ new: true })    
        // }
        // res.status(200).json(updatedUser);
        const {error  , value } = changePasswordValidation.validate(req.body);
        if(error){
            return res.status(400).json({message : "validation failed"});

        }
        const user = req.user ;
        const result = await changePasswordService(value , user);
        if(result.success){
            return res.status(result.status).json(result.updatedUser);

        }

        return res.status(result.status).json({message : result.message});


    } catch (error) {
        next(error);
    }
}

// $2a$10$aREATmFg.YPGBFJQNRdCT.ZqfLHFlc/xtbnw/3HDrUveTNZ3ZMgqO

module.exports={
    getAllUsers,
    getUserById,
    updateProfile,
    deleteUser,
    addAddress,
    changePassword,
    deleteAddress,
    getAllUsersNoLimit
};