const Application = require("../models/Application");

// APPLY JOB
exports.applyJob = async (req,res)=>{

  try{

    const application = new Application(req.body);

    await application.save();

    res.status(201).json({
      message:"Application submitted successfully"
    });

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }

};