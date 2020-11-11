const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const Employee = require("../models/employee");
const employeeController = {};
employeeController.getEmployeeList = catchAsync(async (req, res, next) => {
  let employees = await Employee.find({ isFired: false }).populate(
    "employeeId"
  );
  console.log(employees);
  // let { category } = { ...req.query };
  if (!employees)
    return next(
      new AppError(404, "employees not found", "Get Menu by Category Error")
    );
  // let menuByCategory = await Employee.find({ category: { $in: category } });
  // menuDrinkByCategory=menuDrinkByCategory.toJSON() //toJSON de khong hien thi nhung cai da bi delete
  return sendResponse(res, 200, true, { employees }, null, "");
});


module.exports = employeeController;
