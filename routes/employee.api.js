const express = require("express");
const router = express.Router();
const validators = require("../middlewares/validators");
const { body } = require("express-validator");
const employeeController = require("../controllers/employee.controller");
const authMiddleware = require("../middlewares/authentication");

// get  employees
router.get(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.isManagerOrAdmin,
  employeeController.getEmployeeList
);

module.exports = router;
