"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentAdmissionController_1 = require("../controllers/studentAdmissionController");
const router = express_1.default.Router();
router.get('/', studentAdmissionController_1.getStudentAdmissions);
router.get('/:id', studentAdmissionController_1.getStudentAdmission);
router.post('/', studentAdmissionController_1.createStudentAdmission);
router.put('/:id', studentAdmissionController_1.updateStudentAdmission);
router.delete('/:id', studentAdmissionController_1.deleteStudentAdmission);
exports.default = router;
