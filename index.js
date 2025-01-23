const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db.js");
const userRoutes = require("./src/routes/userRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const cors=require("cors");
dotenv.config(); 

const app = express();

connectDB();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server connected");
});
app.use("/api/users", userRoutes); 
app.use("/api/tasks", taskRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
