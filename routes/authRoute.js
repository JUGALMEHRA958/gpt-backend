const express = require("express");
const { register, login, logout } = require("../controller/authController");
// This is the new way of creating a router.
const router = express.Router();
//REGISTER
router.post("/register", register);

//LOGIN
router.post("/login", login);

//LOGOUT
router.post("/logout", logout);

module.exports = router;
