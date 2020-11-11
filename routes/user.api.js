const express = require("express");
const router = express.Router();
const validators = require("../middlewares/validators");
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authentication");
/**
 * @route POST api/users
 * @description Register new user
 * @access Public
 */
router.post(
  "/",
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email").exists().isEmail(),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  userController.register
);

/**
 * @route PUT api/users/
 * @description Update user profile
 * @access Login required
 */
// router.put("/", authMiddleware.loginRequired, userController.updateProfile);

/**
 * @route GET api/users/me
 * @description Get current user info
 * @access Login required
 */
router.get("/me", authMiddleware.loginRequired, userController.getCurrentUser);

router.post("/verify_email", userController.verifyEmail);
// get User by Email (to change userRole)
router.get("/:email", userController.getUserRoleIdByEmail);
// edit User Role - employmentType by Id
router.patch("/",authMiddleware.loginRequired, authMiddleware.isManagerOrAdmin, userController.editUserRole)

module.exports = router;
