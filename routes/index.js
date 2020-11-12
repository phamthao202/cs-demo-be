var express = require("express");
var router = express.Router();

//userApi
var usersRouter = require("./user.api");
router.use("/users", usersRouter);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({ status: "ok", data: "hahaha" });
});

//menu
const menuRouter = require("./menus.js");
router.use("/menu", menuRouter);

// authApi
const authApi = require("./auth.api");
router.use("/auth", authApi);

//dailyPayslip
const dailyPayslipRouter = require("./dailyPayslip.api");
router.use("/payslip", dailyPayslipRouter);
// employeeApi
const employeeApi = require("./employee.api");
router.use("/employee", employeeApi);
module.exports = router;
