require('dotenv').config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import { errorHandler } from './utils/errorHandler';
import authRoutes from './routes/authRoutes';
import accountRoutes from './routes/accountRoutes';
import requestLogger from './middlewares/logger';
import studentApplicationRoute from './routes/studentApplicationRoute'
import studentAdmissionRoute from './routes/studentAdmissionRoutes'
import studentRoutes from './routes/studentRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

const app = express();

const allowedOrigins = ['http://localhost:3003', 'https://enrollment-sms.imraffydev.com'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)

app.use('/api/auth', authRoutes)
app.use('/api/account', accountRoutes)
app.use('/api/studentApplication', studentApplicationRoute)
app.use('/api/admissions', studentAdmissionRoute)
app.use('/api/students', studentRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use(errorHandler)


export default app;