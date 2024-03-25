const Order=require("../models/order");

const getAllOrderServices = async(queryData) =>{
    try{
        const { page=1, limit=10 }=queryData;
        const orders=await Order.find().limit(limit*1).skip((page-1)*limit).sort({ createdAt: -1 });

        return {success : true ,status : 200 , orders};
    }
    catch(error){
            return {success : false , status : 500 };
    }

}

const getUserOrderService = async(userInfo) =>{
    try{
        const orders = await Order.find({user :userInfo });
        return {success : true , status : 200 , orders};

    }
    catch(error){
        return {success : false , status : 500};
    }
}

const genericOrderService = async(orderStatus) =>{
    try{

        const orders = await Order.find({status : orderStatus});
        return {success : true , orders , status : 200};
    }
    catch(error){
        return {success : false , status : 500};
    }
}

const deleteOrderService = async(id) =>{
    try{
        const order = await Order.findByIdAndDelete(id);
        if(!order){
            return {success : false , status: 404 ,message : "Order not found"};
        }

        return {success : true , status : 200 , message : "Order deleted successfully"};
    }
    catch(error){
        return {success : false , status : 500 , message : "Interval server error"};
    }

}
const cancelOrderService = async(id) =>{
    try{
        const order = await Order.findById(id);

        if(!order){
            return {success : false , status : 404 , message : "Order not found"};
        }

        if(order.status==="cancelled"){
            return {success : false , status : 400 , message : "Order already cancelled"};
        }
        order.status = "cancelled";
        order.save();
        return {success : true ,status : 200 ,  order};

    }
    catch(error){
        return {success : false , status : 500 , message : "Interval server error" };
    }

}

module.exports = {getAllOrderServices , getUserOrderService , genericOrderService , deleteOrderService , cancelOrderService};