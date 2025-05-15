"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accountControllers_1 = require("../controllers/accountControllers");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = express_1.default.Router();
router.get('/users', accountControllers_1.getUser);
router.put('/editUser/:id', multer_1.default.single('image'), accountControllers_1.editUser);
router.put('/changePassword/:id', accountControllers_1.changePassword);
router.delete('/deleteUser/:id', accountControllers_1.deleteUser);
exports.default = router;
