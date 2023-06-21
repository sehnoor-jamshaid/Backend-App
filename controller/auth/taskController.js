const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const connection = require("../../config/config");
const task = require("../../models/taskModel");
const ERRORS = require("../../Errors/errors");
require("dotenv").config();
var jwt = require("jsonwebtoken");
const { objectValidator } = require("../../utils/helpers");
const jwtKey = process.env.JWT_KEY;
const productModel = require("../../models/productModel");

console.log("in function");

const filterTask = async (req, res) => {
  try {
    const { assignee, priority, title, role } = req.query;
    const queryParam = {};
    if (assignee) {
      queryParam.assignee = { $regex: req.query.assignee, $options: "i" };
    }
    if (priority) {
      queryParam.priority = { $regex: req.query.priority, $options: "i" };
    }
    if (title) {
      queryParam.title = { $regex: req.query.title, $options: "i" };
    }
    if (role) {
      queryParam.role = { $regex: req.query.role, $options: "i" };
    }
    const result = await task.find(queryParam);
    console.log("queryParam", queryParam,result);
    return res.status(200).send({
      sucess: "true",
      data:
        result == "" ? "No records that match the specified criteria." : result,
    });
  } catch (e) {
    return res.status(400).send({
      sucess: "false",
      message: e.message,
    });
  }
};
const createTask = async (req, res) => {
  let connect;
  try {
    connect = await connection.createConnection();
    // Check for validation errors

    // Extract validated data
    const { title, dueDate, assignee } = req.body;
    let body = req.body;
    console.log("body", body);
    if ((!title, !dueDate, !assignee)) throw Error("fields are req");
    // const objValid = await objectValidator(body);
    // console.log("objValid",objValid)
    // if (!objValid) throw Error(ERRORS.NULL_FIELD);
    const Tasks = new task(req.body);
    console.log("users", Tasks);

    const db = await Tasks.save();
    return res.status(200).send({
      success: "true",
      message: "Task created Successfully",
    });
  } catch (e) {
    return res.status(400).send({
      success: "false",
      message: e.message,
    });
  } finally {
    if (connect) {
      connect.close();
      console.log("connection close");
    }
  }
};

const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const _id = new mongoose.Types.ObjectId(id);

    if (!_id) throw Error("Id is not provided");
    const Tasks = await task.findOne({ _id: _id });

    await task.findByIdAndDelete(_id);
    return res.status(200).send({
      success: "true",
      data: Tasks != null ? Tasks : "No data found, already deleted",
      message: `Deleted successfully`,
    });
  } catch (e) {
    return res.status(400).send({
      success: "false",
      message: e.message,
    });
  }
};
module.exports = {
  filterTask,
  createTask,
  deleteTask,
};
