const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authentication");
const menusController = require("../controllers/menus.controller");
//create one item
router.post(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.isManagerOrAdmin,
  menusController.createItem
);
// get menu by Category
router.get("/", menusController.getMenuByCategory);
// edit one item
router.patch(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.isManagerOrAdmin,
  menusController.updateSingleItem
);
// delete one item
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.isManagerOrAdmin,
  menusController.deleteSingleItem
);
// get one item
router.get(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.isManagerOrAdmin,
  menusController.getSingleItem
);
module.exports = router;
