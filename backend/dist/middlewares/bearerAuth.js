"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bearerAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const bearerAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({
            error: 'Unauthorized',
            message: 'Unathorized access, token not provided'
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userExists = await prisma_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true }
        });
        if (!userExists) {
            res.status(401).json({
                error: 'Invalid Token',
                message: 'User not found'
            });
            return;
        }
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                error: 'Token Expired',
                message: 'Token has expired'
            });
            return;
        }
        if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                error: 'Invalid Token',
                message: 'Malformed token'
            });
            return;
        }
        console.error('Authentication error:', err);
        res.status(500).json({
            error: 'Authentication Failed'
        });
    }
};
exports.bearerAuth = bearerAuth;
