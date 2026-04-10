const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/worker", require("./routes/workerRoutes"));

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/jobs", require("./routes/jobRoutes"));

app.use("/api/applications", require("./routes/applicationRoutes"));

app.use("/api/admin", require("./routes/adminRoutes"));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/subscription", require("./routes/subscriptionRoutes"));

app.get("/", (req, res) => {
  res.send("Labour Hub API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});