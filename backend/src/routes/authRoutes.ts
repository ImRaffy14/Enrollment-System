import { Router } from 'express';
import { 
    registerUser, 
    loginUser,
    getUserProfile, 
    logoutUser 
} from './../controllers/authController';
import { verifyToken } from '../middlewares/verifyToken';
import upload from '../middlewares/multer';

const router = Router();

router.post('/register', upload.single('image'),registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, getUserProfile);
router.post('/logout', logoutUser);

export default router;