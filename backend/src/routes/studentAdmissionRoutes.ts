import express from "express";
import {
    getStudentAdmissions,
    getStudentAdmission,
    createStudentAdmission,
    updateStudentAdmission,
    deleteStudentAdmission
} from '../controllers/studentAdmissionController'

const router = express.Router()

router.get('/', getStudentAdmissions)
router.get('/:id', getStudentAdmission)
router.post('/', createStudentAdmission)
router.put('/:id', updateStudentAdmission)
router.delete('/:id', deleteStudentAdmission)

export default router