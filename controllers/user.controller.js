const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const userController = {};
const Employee = require("../models/employee");
userController.register = catchAsync(async (req, res, next) => {
  let { name, email, avatarUrl, password, userRole } = req.body;
  let user = await User.findOne({ email });
  if (user)
    return next(new AppError(409, "User already exists", "Register Error"));

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({
    name,
    email,
    password,
    avatarUrl,
    userRole,
  });
  const accessToken = await user.generateToken();

  return sendResponse(res, 200, true, { user }, null, "Create user successful");
});
userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  if (!user)
    return next(new AppError(400, "User not found", "Get Current User Error"));
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get current user successful"
  );
});

userController.updateProfile = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const allows = ["name", "password", "avatarUrl"];
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError(404, "Account not found", "Update Profile Error"));
  }

  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });
  await user.save();
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Update Profile successfully"
  );
});

userController.verifyEmail = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  let user = await User.findOne({
    emailVerificationCode: code,
  });
  if (!user) {
    return next(
      new AppError(400, "Invalid Verification Code", "Verify Email Error")
    );
  }
  user = await User.findByIdAndUpdate(
    user._id,
    {
      $set: { emailVerified: true },
      $unset: { emailVerificationCode: 1 },
    },
    { new: true }
  );
  return sendResponse(
    res,
    200,
    true,
    { user },
    null,
    "Email successfully verified!"
  );
});

//Manager can change User Role : User to Staff
userController.getUserRoleIdByEmail = catchAsync(async (req, res, next) => {
  const email = req.params.email;
  //   console.log(email)
  const user = await User.findOne({ email });

  if (!user)
    return next(new AppError(400, "User Not Found", "Find User Error"));

  const employee = await Employee.findOne({ employeeId: user._id });

  accessToken = await user.generateToken();//tai sao phai accesstoken
  return sendResponse(
    res,
    200,
    true,
    {
      user,
      userId: user._id,
      userRole: user.userRole,
      employmentType: employee ? employee.employmentType : "",
    },
    null,
    "Get userRole successful"
  );
});

userController.editUserRole = catchAsync(async (req, res, next) => {
  const { targetId, newUserRole, employmentType } = req.body;
  let allows = [];
  if (req.role === "manager") {
    allows = ["staff", "user"];
  }

  if (req.role === "owner") {
    allows = ["staff", "user", "manager"];
  }

  if (newUserRole && !allows.includes(newUserRole)) {
    return next(
      new AppError(403, "You are not authorized to set this role", "Auth Error")
    );
  }
  const targetUser = await User.findById(targetId);
  if (!targetUser) {
    return next(new AppError(404, "User not found", "Update User Role Error"));
  }
  if (
    targetUser.userRole === "owner" ||
    (req.role === "manager" && targetUser.userRole === "manager")
  ) {
    return next(
      new AppError(403, "Dang lam quyen roi day", "Update User Role Error")
    );
  }

  let employee = await Employee.findOne({ employeeId: targetId });
  if (!employee) {
    employee = await Employee.create({
      employeeId: targetId,
      employmentType,
      isFired: false,
    });
  } else {
    if (newUserRole === "user" && targetUser.userRole !== "user") {
      employee.isFired = true;
      employee.employmentType = "none";
      await employee.save();
    } else if (newUserRole !== "user") {
      console.log(employee);
      if (targetId) employee.employeeId = targetId;
      if (employmentType) employee.employmentType = employmentType;
      employee.isFired = false;
      await employee.save();
    }
  }
  if (newUserRole) targetUser.userRole = newUserRole;
  await targetUser.save();
  return sendResponse(
    res,
    200,
    true,
    targetUser,
    null,
    "Update userRole successfully"
  );
});

module.exports = userController;
