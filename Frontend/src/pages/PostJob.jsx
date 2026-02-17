import React, { useState, useContext } from "react";
import { JobContext } from "../context/JobContext";
import { useNavigate } from "react-router-dom";
import "./PostJob.css";

const PostJob = () => {
    const { addJob } = useContext(JobContext);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [form, setForm] = useState({
        title: "",
        location: "",
        wage: "",
        jobType: "Daily",
    });

    // ✅ SUCCESS MESSAGE STATE
    const [success, setSuccess] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.title || !form.location || !form.wage) {
            alert("Please fill all fields");
            return;
        }

        addJob({
            id: Date.now(),
            employerId: user?.id,   // 👈 important
            ...form,
        });
        // ✅ Success message
        setSuccess("🎉 Job posted successfully!");

        // ✅ Form reset
        setForm({
            title: "",
            location: "",
            wage: "",
            jobType: "Daily",
        });

        // ✅ Message thodi der baad hide ho jaye (optional)
        setTimeout(() => {
            setSuccess("");
        }, 3000);
    };


    return (
        <div className="post-wrapper">
            <div className="post-card">
                <h2>Post a Job</h2>

                {/* ✅ SUCCESS MESSAGE YAHAN DIKHEGA */}
                {success && (
                    <p
                        style={{
                            background: "#d4edda",
                            color: "#155724",
                            padding: "10px",
                            borderRadius: "8px",
                            textAlign: "center",
                            marginBottom: "15px",
                        }}
                    >
                        {success}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <label>Job Title</label>
                    <input
                        type="text"
                        onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                        }
                    />

                    <label>Location</label>
                    <input
                        type="text"
                        onChange={(e) =>
                            setForm({ ...form, location: e.target.value })
                        }
                    />

                    <label>Daily Wage (₹)</label>
                    <input
                        type="number"
                        onChange={(e) =>
                            setForm({ ...form, wage: e.target.value })
                        }
                    />

                    <label>Job Type</label>
                    <select
                        onChange={(e) =>
                            setForm({ ...form, jobType: e.target.value })
                        }
                    >
                        <option>Daily</option>
                        <option>Contract</option>
                    </select>

                    <button type="submit">Post Job</button>
                    <button
                        type="button"
                        className="view-jobs-btn"
                        onClick={() => navigate("/FindWork")}
                    >
                        View Jobs
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
