"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectPrisma = exports.connectPrisma = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const connectPrisma = async () => {
    await prisma.$connect();
};
exports.connectPrisma = connectPrisma;
const disconnectPrisma = async () => {
    await prisma.$disconnect();
};
exports.disconnectPrisma = disconnectPrisma;
exports.default = prisma;
