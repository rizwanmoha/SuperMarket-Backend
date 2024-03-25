const Complaint = require('../models/complaints');

const addComplaintService = async(complaintData) =>{
    try{
        const {name,email,phone,subject,message} = complaintData;

        const complaint=new Complaint({name,email,phone,subject,message});
   

         await complaint.save()

         return {success : true ,status : 201 ,  message : "Query added successfully" };

    }
    catch(error){
            return {success : false , status : 500 ,  message : "Interval server error"};
    }


}

const getComplaintService = async() =>{
    try{
        const complaints = await Complaint.find();
        return {success : true , status : 200 , complaints};


    }
    catch(error){
        return {success : false , status : 500 };
    }

} 


module.exports = {addComplaintService , getComplaintService};