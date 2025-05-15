"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = require("./utils/errorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
const logger_1 = __importDefault(require("./middlewares/logger"));
const studentApplicationRoute_1 = __importDefault(require("./routes/studentApplicationRoute"));
const studentAdmissionRoutes_1 = __importDefault(require("./routes/studentAdmissionRoutes"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const app = (0, express_1.default)();
const allowedOrigins = ['http://localhost:3003', 'https://enrollment-sms.imraffydev.com'];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(logger_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/account', accountRoutes_1.default);
app.use('/api/studentApplication', studentApplicationRoute_1.default);
app.use('/api/admissions', studentAdmissionRoutes_1.default);
app.use('/api/students', studentRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(errorHandler_1.errorHandler);
exports.default = app;
