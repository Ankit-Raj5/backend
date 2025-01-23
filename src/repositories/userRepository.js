const User = require("../models/userModel");

const createUser = async (userData) => await User.create(userData);
const findUserByEmail = async (email) => await User.findOne({ email });

module.exports = { createUser, findUserByEmail };
