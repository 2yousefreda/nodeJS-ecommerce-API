const express = require("express");
const router = express.Router();

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  activateUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator
} = require("../utils/validators/userValidator");
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  activateUser,
  changeUserPassword,
  uploadUserImage,
  resizeImage,
updateLoggedUserPassword,
  getLoggedUserData,
  updateLoggedUserData,
  deleteLoggedUser
} = require("../services/userService");
const authService = require("../services/authService");

router.get("/me", authService.protect, getLoggedUserData, getUser);
router.put("/changeMyPassword", authService.protect, updateLoggedUserPassword);
router.put("/updateMe", authService.protect, updateLoggedUserValidator, updateLoggedUserData);
router.put("/deleteMe", authService.protect, deleteLoggedUser);

router.use(authService.protect, authService.allowedTo("admin", "manager"));

router
  .route("/")
  .get(getUsers)
  .post(
   
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );
router
  .route("/:id")
  .get(
   
    getUserValidator,
    getUser
  )
  .put(
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .put(
    
    deleteUserValidator,
    deleteUser
  );
router.route("/:id/activate").put(activateUserValidator, activateUser);
router
  .route("/:id/change-password")
  .put(changeUserPasswordValidator, changeUserPassword);

module.exports = router;
