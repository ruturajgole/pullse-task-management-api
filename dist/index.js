"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const database_1 = require("./database");
const cors_1 = __importDefault(require("@fastify/cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const task_1 = __importDefault(require("./routes/task"));
const fastify = (0, fastify_1.default)({
    logger: true
});
fastify.register(cors_1.default, { origin: "http://localhost:3001" });
fastify.register(auth_1.default);
fastify.register(task_1.default);
const start = async () => {
    try {
        await (0, database_1.connectToDatabase)();
        await fastify.listen({ port: 3000 });
        console.log('Server is running at http://localhost:3000');
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
