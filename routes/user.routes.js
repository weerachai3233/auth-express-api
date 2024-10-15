const express = require("express");
const { authenticateJWT } = require("../middlewares/auth.middleware");
const { getProfile } = require("../controllers/user.controller");

const router = express.Router();

router.get("/profile", authenticateJWT, getProfile);

module.exports = router;
