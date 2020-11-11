const mongoose = require("mongoose");
const User = require("./user");

const schema = new mongoose.Schema(
  {
    staff_id: {
      type: mongoose.Schema.ObjectId,
      require: true,
      ref: "User",
    },
    date: {
      type: String,
      require: true,
    },
    pt_salary_shift_1: {
      type: Number,
      default: 0,
    },
    pt_salary_shift_2: {
      type: Number,
      default: 0,
    },
    ft_monthly_salary: {
      type: Number,
      default: 0,
    },
    ft_working_days_per_month: {
      type: Number,
    },
    ft_working_hours_per_day: {
      type: Number,
    },
    working_hour_shift_1: {
      type: Number,
      default: 0,
    },
    pt_salary_shift1: {
      type: Number,
      default: 0,
    },
    ft_salary_shift_1: {
      type: Number,
      default: 0,
    },
    working_hour_shift_2: {
      type: Number,
    },

    ft_salary_shift_2: { type: Number, default: 0 },
    pt_salary_shift2: { type: Number, default: 0 },

    late_shift_1: {
      type: Number,
    },
    pt_penalty_late_shift_1: { type: Number, default: 0 },
    ft_penalty_late_shift_1: { type: Number, default: 0 },
    late_shift_2: {
      type: Number,
    },
    pt_penalty_late_shift_2: {
      type: Number,
      default: 0,
    },
    ft_penalty_late_shift_2: {
      type: Number,
      default: 0,
    },
    OT_shift_1: {
      type: Number,
    },
    pt_salary_OT_shift_1: {
      type: Number,
      default: 0,
    },
    ft_salary_OT_shift_1: {
      type: Number,
      default: 0,
    },
    OT_shift_2: {
      type: Number,
    },
    pt_salary_OT_shift_2: { type: Number, default: 0 },
    ft_salary_OT_shift_2: { type: Number, default: 0 },
    allowance: {
      meal: Number,
      parking: Number,
    },
    bonus: {
      sale: Number,
      special_bonus: Number,
    },
    daily_salary: {
      part_time_daily_salary: Number,
      full_time_daily_salary: Number,
    },
    current_monthly_salary: {
      type: Number,
    },
  },
  { timestamps: true }
);

const DailyPayslip = mongoose.model("DailyPayslip", schema);
module.exports = DailyPayslip;
