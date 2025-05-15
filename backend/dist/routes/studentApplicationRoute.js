"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentApplicationController_1 = require("../controllers/studentApplicationController");
const router = express_1.default.Router();
router.get('/', studentApplicationController_1.getStudentApplications);
router.post('/createStudentApplication', studentApplicationController_1.createStudentApplicant);
router.put('/editStudentApplication/:id', studentApplicationController_1.editStudentApplication);
exports.default = router;
