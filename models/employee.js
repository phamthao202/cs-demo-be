const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = Schema(
  {
    employeeId: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "none"],
      default: "none",
    },
    // currentSalary: {
    //   fullTime: {
    //     salaryPerMonth: {
    //       type: Number,
    //       default: 0,
    //     },
    //     workingDaysPerMonth: {
    //       type: Number,
    //       default: 26,
    //     },
    //     workingHoursPerDay: {
    //       type: Number,
    //       default: 11,
    //     },
    //   },
    //   partTime: {
    //     salaryPerHourShift1: { type: Number, default: 0 },
    //     salaryPerHourShift2: { type: Number, default: 0 },
    //   },
    // },
    history: [{ type: Schema.ObjectId, ref: "DailyPayslip" }],
    isFired: { type: Boolean, default: false },
  },

  { timestamps: true }
);

const Employee = mongoose.model("Employee", userSchema);
module.exports = Employee;
