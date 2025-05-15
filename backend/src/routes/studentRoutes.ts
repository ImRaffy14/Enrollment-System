import express from "express";
import {
  getStudents,
  getStudent,
  updateStudent,
  updateStudentStatus
} from '../controllers/studentController';

const router = express.Router();

router.get('/', getStudents);
router.get('/:id', getStudent);
router.put('/:id', updateStudent);
router.patch('/:id/status', updateStudentStatus);

export default router;