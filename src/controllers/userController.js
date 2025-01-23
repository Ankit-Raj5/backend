const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../repositories/userRepository");

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.createUser({ email, password: password });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.status(201).json({
      id: user._id,
      email: user.email,
      token: token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password Comparison Result: ", isPasswordValid); 

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      id: user._id,
      email: user.email,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
