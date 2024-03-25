const User = require('../models/User.js');
const bcrypt = require("bcryptjs");
const { generateToken, generateRefreshToken } = require("../utils/jwtUtil.js");

const signupService = async (userData) => {
    try {
      const { name, email, password, roles } = userData;
  
      
      const foundUser = await User.findOne({ email });
      if (foundUser) {
        return { success: false, message: "User already exists" };
      }
  
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      
      const user = new User({
        name,
        email,
        password: hashedPassword,
        roles
      });
      await user.save();
  
      return { success: true, message: "User registered successfully!" };
    } catch (error) {
        return {success : false}
    }
  };

  const signinService = async (value) => {
    try {
     
      
      const email   = value.email;
      const password = value.password;
     
      const user = await User.findOne({ email });
        
      if (!user) {
        return { success: false, status: 404, message: "User not found" };
      }
     
     
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return { success: false, status: 401, message: "Invalid credentials" };
      }
  
     
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);
      
     
      user.refreshToken = refreshToken;
      await user.save();
  
        
      let phoneNumber = user.phoneNumber ? user.phoneNumber : "Not Provided";
      const userData = {
        name: user.name,
        email: user.email,
        addresses: user.addresses,
        phoneNumber,
        isCustomer: user.roles.includes("customer"),
        isSeller: user.roles.includes("seller"),
        isAdmin: user.roles.includes("admin"),
        isBlogger: user.roles.includes("blogger")
      };
      
  
      return { success: true, status: 200, token, refreshToken, userData };
    } catch (error) {
        return {success : false , status : 500}
    }
  };
  


module.exports = {signupService , signinService};