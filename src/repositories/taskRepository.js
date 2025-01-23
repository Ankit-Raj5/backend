const Task = require("../models/taskModel");

const createTask = async (taskData) => await Task.create(taskData);
const getTasksByUserId = async (userId, filters, page, limit) => {
    const queryFilters = { user: userId };
  
    if (filters.priority) {
      queryFilters.priority = filters.priority;
    }
    if (filters.status) {
      queryFilters.status = filters.status;
    }
  
    const skip = (page - 1) * limit;
    const tasks = await Task.find(queryFilters).skip(skip).limit(limit);
    const total = await Task.countDocuments(queryFilters); // For total count
  
    return { tasks, total };
  };
  
const updateTaskRepo = async (taskId, updates) => await Task.findByIdAndUpdate(taskId, updates, { new: true });
const deleteTask = async (taskId) => await Task.findByIdAndDelete(taskId);

module.exports = { createTask, getTasksByUserId, updateTaskRepo, deleteTask };
