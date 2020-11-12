const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const DailyPayslip = require("../models/dailyPayslip");
const dailyPayslipController = {};

dailyPayslipController.createOrEditPayslip = catchAsync(async (req, res, next) => {
  const {
    staff_id,
    date,
    pt_salary_shift_1,
    pt_salary_shift_2,
    ft_working_days_per_month,
    ft_monthly_salary,
    ft_working_hours_per_day,
    working_hour_shift_1,
    working_hour_shift_2,
    late_shift_1,
    late_shift_2,
    OT_shift_1,
    OT_shift_2,
    allowance,
    bonus,
    current_monthly_salary,
  } = req.body;
  //kiem tra coi date co chua, neu chua thi create

  let pt_salary_shift1 = pt_salary_shift_1 * working_hour_shift_1;
  let pt_salary_shift2 = pt_salary_shift_2 * working_hour_shift_2;
  let pt_penalty_late_shift1 = pt_salary_shift_1 * late_shift_1 * 1.5;
  let pt_penalty_late_shift2 = pt_salary_shift_2 * late_shift_2 * 1.5;
  let pt_salary_OT_shift1 = pt_salary_shift_1 * OT_shift_1 * 1.5;
  let pt_salary_OT_shift2 = pt_salary_shift_2 * OT_shift_2 * 1.5;
  let part_time_daily_salary =
    pt_salary_shift1 +
    pt_salary_shift2 +
    pt_salary_OT_shift1 +
    pt_salary_OT_shift2 +
    allowance.meal +
    allowance.parking +
    bonus.sale +
    bonus.special_bonus -
    pt_penalty_late_shift1 -
    pt_penalty_late_shift2;
  console.log("part_time_daily_salary", part_time_daily_salary);
  let ft_salary_shift_1_2 =
    ft_monthly_salary / ft_working_days_per_month / ft_working_hours_per_day;
  let ft_salary_shift_1 = ft_salary_shift_1_2 * working_hour_shift_1;
  let ft_salary_shift_2 = ft_salary_shift_1_2 * working_hour_shift_2;
  let ft_penalty_late_shift_1 = ft_salary_shift_1_2 * late_shift_1 * 1.5;
  let ft_penalty_late_shift_2 = ft_salary_shift_1_2 * late_shift_2 * 1.5;
  let ft_salary_OT_shift_1 = ft_salary_shift_1_2 * OT_shift_1 * 1.5;
  let ft_salary_OT_shift_2 = ft_salary_shift_1_2 * OT_shift_2 * 1.5;
  let full_time_daily_salary =
    ft_salary_shift_1 +
    ft_salary_shift_2 +
    ft_salary_OT_shift_1 +
    ft_salary_OT_shift_2 +
    allowance.meal +
    allowance.parking +
    bonus.sale +
    bonus.special_bonus -
    ft_penalty_late_shift_1 -
    ft_penalty_late_shift_2;
  console.log(
    ft_salary_shift_1,
    ft_salary_shift_2,
    ft_salary_OT_shift_1,
    ft_salary_OT_shift_2,
    allowance.meal,
    allowance.parking,
    bonus.sale,
    bonus.special_bonus,
    ft_penalty_late_shift_1,
    ft_penalty_late_shift_2,
    full_time_daily_salary
  );

  const payslip = await DailyPayslip.create({
    staff_id,
    date,
    pt_salary_shift_1,
    pt_salary_shift_2,
    ft_monthly_salary,
    ft_working_days_per_month,
    ft_working_hours_per_day,
    working_hour_shift_1,
    pt_salary_shift1: pt_salary_shift1,
    ft_salary_shift_1: ft_salary_shift_1,
    working_hour_shift_2,
    ft_salary_shift_2: ft_salary_shift_2,
    pt_salary_shift2: pt_salary_shift2,

    late_shift_1,
    pt_penalty_late_shift_1: pt_penalty_late_shift1,
    ft_penalty_late_shift_1: ft_penalty_late_shift_1,
    late_shift_2,
    pt_penalty_late_shift_2: pt_penalty_late_shift2,
    ft_penalty_late_shift_2: ft_penalty_late_shift_2,
    OT_shift_1,
    pt_salary_OT_shift_1: pt_salary_OT_shift1,
    ft_salary_OT_shift_1: ft_salary_OT_shift_1,
    OT_shift_2,
    pt_salary_OT_shift_2: pt_salary_OT_shift2,
    ft_salary_OT_shift_2: ft_salary_OT_shift_2,
    allowance,
    bonus,
    daily_salary: {
      full_time_daily_salary: full_time_daily_salary,
      part_time_daily_salary: part_time_daily_salary,
    },
    current_monthly_salary,
  });

  return sendResponse(
    res,
    200,
    true,
    payslip,
    null,
    "Create new Payslip successful"
  );
});

dailyPayslipController.getSinglePayslipByDate = catchAsync(
  async (req, res, next) => {
    let date= req.body.date;
    let staff_id = req.body.staff_id;
    let targetPayslip = await DailyPayslip.find({
      staff_id: staff_id,
      date: date,
    });
    if (!targetPayslip) {
      return next(
        new AppError(
          404,
          "Payslip on that date not found",
          "Get Payslip By Date Error"
        )
      );
    }
    // targetPayslip = targetPayslip.toJSON();s
    return sendResponse(res, 200, true, targetPayslip, null, null);
  }
);

dailyPayslipController.editPayslip = catchAsync(async (req, res, next) => {
  const payslipId = req.body;
  const {} = req.body;

  const payslipTarget = await DailyPayslip.findOneAndUpdate(
    { _id: payslipId },
    { $set: { ...req.body } },
    { new: true }
  );
  if (!payslipTarget)
    return next(
      new AppError(
        400,
        "Payslip not found or User not authorized",
        "Edit Payslip Error"
      )
    );
  return sendResponse(
    res,
    200,
    true,
    payslipTarget,
    null,
    "Update Item successful"
  );
});

module.exports = dailyPayslipController;
