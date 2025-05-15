"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("./../controllers/authController");
const verifyToken_1 = require("../middlewares/verifyToken");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = (0, express_1.Router)();
router.post('/register', multer_1.default.single('image'), authController_1.registerUser);
router.post('/login', authController_1.loginUser);
router.get('/profile', verifyToken_1.verifyToken, authController_1.getUserProfile);
router.post('/logout', authController_1.logoutUser);
exports.default = router;
