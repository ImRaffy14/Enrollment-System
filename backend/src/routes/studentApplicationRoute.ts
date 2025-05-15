import express from "express";
import {
    getStudentApplications,
    createStudentApplicant,
    editStudentApplication
} from '../controllers/studentApplicationController'

const router = express.Router()

router.get('/', getStudentApplications)
router.post('/createStudentApplication', createStudentApplicant)
router.put('/editStudentApplication/:id', editStudentApplication)

export default router