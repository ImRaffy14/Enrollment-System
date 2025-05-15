"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        res.status(401).json({ error: 'No token provided. Authorization denied.' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'string') {
            res.status(401).json({ error: 'Malformed token payload.' });
            return;
        }
        const payload = decoded;
        if (!payload.userId || !payload.email) {
            res.status(401).json({ error: 'Invalid token payload.' });
            return;
        }
        req.user = payload;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid or expired token. Authorization denied.' });
    }
};
exports.verifyToken = verifyToken;
