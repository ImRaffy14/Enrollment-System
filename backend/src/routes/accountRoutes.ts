import express from 'express';
import { 
    getUser, 
    editUser, 
    changePassword,
    deleteUser
} from '../controllers/accountControllers';
import upload from '../middlewares/multer';
import { bearerAuth } from '../middlewares/bearerAuth';

const router = express.Router();

router.get('/users',  getUser);
router.put('/editUser/:id', upload.single('image'), editUser)
router.put('/changePassword/:id', changePassword)
router.delete('/deleteUser/:id', deleteUser)

export default router