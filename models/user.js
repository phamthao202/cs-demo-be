const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const utilsHelper = require("../helpers/utils.helper");
const emailsHelper = require("../helpers/email.helper");
const userController = require("../controllers/user.controller");
const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String, require: false, default: "" },
    password: { type: String, required: true, select: false },
    emailVerificationCode: { type: String, select: false },
    emailVerified: { type: Boolean, require: true, default: false },
    userRole: {
      type: String,
      default: "user",
      enum: ["user", "manager", "staff", "owner"],
    },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

userSchema.plugin(require("./plugins/isDeletedFalse"));

// userSchema.virtual("employees", {
//   ref: "Employee",
//   localField: "_id",
//   foreignField: "employeeId",
//   justOne: false,
// });

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.emailVerified;
  delete obj.emailVerificationCode;
  delete obj.isDeleted;
  return obj;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};
//create a verification code when user register
userSchema.pre("save", function (next) {
  if (this.isNew) {
    this.emailVerificationCode = utilsHelper.generateRandomHexString(15);
    this.wasNew = true; // Read why at https://stackoverflow.com/a/18305924/396324'
  }

  next();
});
//send verification code to user's mail
userSchema.post("save", function (next) {
  if (this.wasNew) {
    emailsHelper.sendVerificationEmail(this);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
