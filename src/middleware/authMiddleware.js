const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Decoded JWT:", decoded);

      req.user = await userModel.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      // console.log("Authenticated User:", req.user);
      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

module.exports = { protect };
