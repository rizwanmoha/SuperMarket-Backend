const Complaint=require('../models/complaints');
const {addComplaintService , getComplaintService} = require('../services/complaintService.js');
const {addComplaintValidation} = require('../validations/complaintValidations.js');
const addComplaint=async (req,res,next)=>{

    try{


    const {error  , value} = addComplaintValidation.validate(req.body);
    if(error){
        return res.status(400).json({success : false , message : error.message});
    }

    const {success  , status , message } = await addComplaintService(value);

   
    return res.status(status).json({success , message});
    

    

}
catch (e){
   next(e);

}
}

const getComplaints=async (req,res,next)=>{
    try {
       
        const result = await getComplaintService();
        if(result.success){
            return res.status(result.status).json(result.complaints);
        }

        return res.status(result.status).json({message : "Error while getting the complaints"});


    } catch (e) {
        next(e);
    }
}
module.exports={addComplaint,getComplaints};