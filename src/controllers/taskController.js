const taskModel = require("../models/taskModel");
const Task = require("../repositories/taskRepository");

const createTask = async (req, res) => {
  try {
    const task = await Task.createTask({ ...req.body, user: req.user.id });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
    try {
      const { id } = req.params;
  
      const task = await Task.deleteTask({ _id: id, user: req.user.id });
  
      if (!task) {
        return res.status(404).json({ message: "Task not found or not authorized to delete" });
      }
  
      res.status(200).json({ message: "Task deleted successfully", taskId: id });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  };
  
const getTasks = async (req, res) => {
    try {
      const { page = 1, limit = 5, ...filters } = req.query;
      const parsedPage = parseInt(page, 10);
      const parsedLimit = parseInt(limit, 10);
  
      const { tasks, total } = await Task.getTasksByUserId(req.user.id, filters, parsedPage, parsedLimit);
  
      res.json({
        tasks,
        total,
        currentPage: parsedPage,
        totalPages: Math.ceil(total / parsedLimit),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  



  const getTaskStatistics = async (req, res) => {
    try {
      const tasks = await taskModel.find({ user: req.user._id });
  
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task) => task.status==="finished").length;
      const pendingTasks = totalTasks - completedTasks;
      // console.log(totalTasks , completedTasks)
  
      const averageCompletionTime = calculateAverageCompletionTime(tasks);
  
      const prioritySummary = [1, 2, 3, 4, 5].map((priority) => {
        const tasksByPriority = tasks.filter(
          (task) => task.priority === priority && task.status==="pending"
        );
  
        return {
          priority,
          pendingTasks: tasksByPriority.length,
          timeLapsed: calculateTimeLapsed(tasksByPriority),
          balanceTime: calculateBalanceEstimatedTime(tasksByPriority), 
        };
      });
  
      res.json({
        totalTasks,
        completedPercentage: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0,
        pendingPercentage: totalTasks > 0 ? ((pendingTasks / totalTasks) * 100).toFixed(1) : 0,
        averageCompletionTime,
        pendingSummary: prioritySummary,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  


const calculateBalanceEstimatedTime = (tasks) => {
    return tasks.reduce((sum, task) => {
      const balanceTime = Math.max(0, (new Date(task.endTime) - Date.now()) / (1000 * 60 * 60)); 
      return sum + balanceTime;
    }, 0).toFixed(1);
  };
  const calculateTimeLapsed = (tasks) => {
    return tasks.reduce((sum, task) => {
      const timeLapsed = Math.max(0, (Date.now() - new Date(task.startTime)) / (1000 * 60 * 60)); 
      return sum + timeLapsed;
    }, 0).toFixed(1);
  };

  const calculateAverageCompletionTime = (tasks) => {
    const completedTasks = tasks.filter((task) => task.status==="finished");
    if (completedTasks.length === 0) return 0;
  
    const totalTime = completedTasks.reduce((sum, task) => {
      const completionTime = Math.max(0, (new Date(task.endTime) - new Date(task.startTime)) / (1000 * 60 * 60));
      return sum + completionTime;
    }, 0);
  
    return (totalTime / completedTasks.length).toFixed(1);
  };
  
const updateTask = async (req, res) => {
    try {
      const { id } = req.params; 
      const updates = req.body; 
  
      const task = await Task.updateTaskRepo(
        { _id: id, user: req.user.id }, 
        updates,
        { new: true, runValidators: true } 
      );
  
      if (!task) {
        return res.status(404).json({ message: "Task not found or not authorized to update" });
      }
  
      res.status(200).json({
        message: "Task updated successfully",
        task,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  };
  
module.exports = { createTask, getTasks,getTaskStatistics,deleteTask,updateTask };
