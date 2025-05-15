"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
const router = express_1.default.Router();
router.get('/', studentController_1.getStudents);
router.get('/:id', studentController_1.getStudent);
router.put('/:id', studentController_1.updateStudent);
router.patch('/:id/status', studentController_1.updateStudentStatus);
exports.default = router;
