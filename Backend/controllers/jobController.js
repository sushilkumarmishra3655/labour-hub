const Job = require("../models/Job");

// POST JOB
exports.postJob = async (req,res)=>{

  try{

    const job = new Job(req.body);

    await job.save();

    res.status(201).json({
      message:"Job posted successfully",
      job
    });

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }

};


// GET ALL JOBS
exports.getJobs = async (req,res)=>{

  try{

    const jobs = await Job.find().sort({createdAt:-1});

    res.json(jobs);

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }

};