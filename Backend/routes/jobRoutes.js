const express = require("express");

const router = express.Router();

const { postJob, getJobs } = require("../controllers/jobController");

router.post("/", postJob);

router.get("/", getJobs);

module.exports = router;