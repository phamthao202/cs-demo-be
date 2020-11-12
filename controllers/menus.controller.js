const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const Menu = require("../models/menus");

const getMenuByCategory = catchAsync(async (req, res, next) => {
  let { category } = { ...req.query };
  if (!category)
    return next(
      new AppError(404, "Category not found", "Get Menu by Category Error")
    );
  let menuByCategory = await Menu.find({ category: { $in: category } });
  // menuDrinkByCategory=menuDrinkByCategory.toJSON() //toJSON de khong hien thi nhung cai da bi delete
  return sendResponse(res, 200, true, { menuByCategory }, null, "");
});

//Manger create/edit/delete menu
const createItem = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { title, pictureUrl, price, category } = req.body;
  const item = await Menu.create({
    title,
    pictureUrl,
    price,
    category: category.toLowerCase(),
  });
  return sendResponse(
    res,
    200,
    true,
    { item },
    null,
    "Successfully created a dish"
  );
});

const getSingleItem = catchAsync(async (req, res, next) => {
  let singleItem = await Menu.findById(req.params.id);
  if (!singleItem)
    return next(new AppError(404, "Menu not found", "Get Single Menu Error"));
  singleItem = singleItem.toJSON();
  // blog.reviews = await Review.find({ blog: blog._id }).populate("user");
  return sendResponse(res, 200, true, singleItem, null, null);
});

const getMenuByTitle = catchAsync(async (req, res, next) => {
    const title = req.params.title;
    //   console.log(email)
    const menu = await Menu.findOne({ title });
   console.log("chay den cho nay chua")
    if (!menu)
      return next(new AppError(400, "Menu Not Found", "Find Menu Error"));
  
    // const targetMenu = await Menu.findOne({ employeeId: user._id });
  
    // accessToken = await user.generateToken();//tai sao phai accesstoken
    return sendResponse(
      res,
      200,
      true,
      {
       menu
      },
      null,
      "Get menu successful"
    );
  });


const updateSingleItem = catchAsync(async (req, res, next) => {
  const itemId = req.params.id;
  const {} = req.body;

  const item = await Menu.findOneAndUpdate(
    { _id: itemId },
    { $set: { ...req.body } },
    { new: true }
  );
  if (!item)
    return next(
      new AppError(
        400,
        "Item not found or User not authorized",
        "Update Item Error"
      )
    );
  return sendResponse(res, 200, true, item, null, "Update Item successful");
});

const deleteSingleItem = catchAsync(async (req, res, next) => {
  const itemId = req.params.id;
  const item = await Menu.findOneAndUpdate(
    { _id: itemId },
    { isDeleted: true },
    { new: true }
  );
  if (!item)
    return next(
      new AppError(
        400,
        "Item not found or User not authorized",
        "Delete Item Error"
      )
    );
  return sendResponse(res, 200, true, null, null, "Delete Item successful");
});

module.exports = {
  createItem,
  getMenuByCategory,
//   getSingleItem,
  updateSingleItem,
  deleteSingleItem,
  getMenuByTitle
};
