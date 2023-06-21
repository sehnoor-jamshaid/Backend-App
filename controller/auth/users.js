const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const connection = require("../../config/config");
require("dotenv").config();
var jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_KEY;
const model = require("../../models/Usermodel");

console.log("in function");

const users = async (req, res) => {
  let connect;
  try {
    connect = await connection.createConnection();
    // Perform the count operation
    const count = await model.countDocuments();
    const data = await model.find();

    // Return the count as a response
    res.send({ count, data: data });
  } catch (error) {
    console.error("Error getting count:", error);
    res.status(500).json({ error: "Error getting count" });
  } finally {
    if (connect) {
      connect.close();
      console.log("connection close");
    }
  }
};
const signUp = async (req, res) => {
  let connect;
  try {
    connect = await connection.createConnection();
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract validated data
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await model.find({ email: email });
    console.log("existingUser", existingUser.length);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const Users = new model(req.body);
    console.log("users", Users);

    const save = async (token, res) => {
      const db = await Users.save().then((result) => {
        console.log("res", res);
        res.send({ message: "Sign-up successful", user: result });
      });
    };
    jwt.sign({ Users }, jwtKey, (err, token) => {
      if (err) {
        res.send({ err: "Error has occured in token generation" });
      } else {
        console.log("saveinnn");
        save(token, res);
      }
    });
  } catch (error) {
    console.error("Sign-up failed:", error);
    res.status(400).json({ error: "Sign-up failed" });
  } finally {
    if (connect) {
      connect.close();
      console.log("connection close");
    }
  }
};
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    let _id = new mongoose.Types.ObjectId(id);
    console.log("id", id);
    if (!id) throw Error("Id is not provided");

    let user = await model.aggregate([
      {
        $match: {
          _id,
        },
      },
      {
        $lookup: {
          as: "otp creation",
          from: "otps",
          localField: "_id",
          foreignField: "userId",
        },
      },

      {
        $project: {
          "otp creation.expiry": 1,
          "otp creation.createdAt": 1,
          "otp creation.updatedAt": 1,
          name: 1,
          email: 1,
        },
      },
      { $limit: 1 },
    ]);
    return res.status(200).send({ status: "true", data: user[0] });
  } catch (e) {
    return res.status(400).send({ status: "false", message: e.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const _id = new mongoose.Types.ObjectId(id);

    if (!_id) throw Error("Id is not provided");
    const userName = await model.findOne({ _id: _id }, { name: 1 });

    let user = await model.findByIdAndDelete(_id);
    return res.status(200).send({
      success: "true",
      data: userName != null ? userName : "No data found, already deleted",
      message: `Deleted successfully`,
    });
  } catch (e) {
    return res.status(400).send({
      success: "false",
      message: e.message,
    });
  }
};
const searchUser = async (req, res) => {
  try {
    const { name, email } = req.query;
    // if (!name || !email || email == null || name == null)
    //   throw Error("Provide name and email to perform filteration");
    // console.log("req.query", req.query, name, email, typeof email);
    console.log("name",name)
    const queryParam={}
    if(name)
    {
      queryParam.name={ $regex: req.query.name, $options: "i" }
    }
    if(email)
    {
      queryParam.email={ $regex: req.query.email, $options: "i" }
    }
    const result = await model.find(
      queryParam,{name:1,email:1}
    );
    console.log("queryParam",queryParam)
    return res.status(200).send({
      sucess: "true",
      data: result,
    });
  } catch (e) {
    return res.status(400).send({
      sucess: "false",
      message: e.message,
    });
  }
};
module.exports = {
  users,
  signUp,
  getUserById,
  deleteUser,
  searchUser,
};
