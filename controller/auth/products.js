const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const connection = require("../../config/config");
const bcrypt = require("bcrypt");
require("dotenv").config();
var jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_KEY;
const productModel = require("../../models/productModel");

console.log("in function");

const searchUser = async (req, res) => {
  try {
    const { name, email } = req.query;
    // if (!name || !email || email == null || name == null)
    //   throw Error("Provide name and email to perform filteration");
    // console.log("req.query", req.query, name, email, typeof email);
    console.log("name", name);
    const queryParam = {};
    if (name) {
      queryParam.name = { $regex: req.query.name, $options: "i" };
    }
    if (email) {
      queryParam.email = { $regex: req.query.email, $options: "i" };
    }
    const result = await model.find(queryParam, { name: 1, email: 1 });
    console.log("queryParam", queryParam);
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
const paginationProducts = async (req, res) => {
  try {
    let { pageSize, pageNumber } = req.query;
    if(!pageSize || !pageNumber)
    throw Error("Page size and page number is not provided")
    // let result = await productModel.skip((pageNumber - 1) * pageSize).limit(pageSize).find();
    let result = await productModel.find().skip((pageNumber - 1) * pageSize).limit(pageSize)
    console.log("result",result)
    return res.status(200).send({
      success: "true",
      data: result,
    });
  } catch (e) {
    return res.status(400).send({
      success: "false",
      message: e.message,
    });
  }
};
module.exports = {
  searchUser,
  paginationProducts,
};
