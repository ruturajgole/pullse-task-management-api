"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database");
const SECRET = 'your_jwt_secret'; // Use environment variables in a real application
const authRoutes = async (fastify) => {
    // Register route
    fastify.post('/auth/register', async (request, reply) => {
        const { username, password } = request.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const db = (0, database_1.getDb)();
        const collection = db.collection('users');
        const user = await collection.findOne({ username });
        if (user) {
            reply.status(409).send({ message: "User Already Exists" });
            return;
        }
        await collection.insertOne({ username, password: hashedPassword });
        reply.status(200).send({ message: "User Registered Successfully" });
    });
    // Login route
    fastify.post('/auth/login', async (request, reply) => {
        const authorization = request.headers["authorization"];
        let token = authorization?.split(' ')[1];
        if (token) {
            return jsonwebtoken_1.default.verify(token, SECRET)
                ? reply.status(200).send({ token, message: "Logged In" })
                : reply.status(500).send({ message: "Session Expired. Please Log In Again" });
        }
        const { username, password } = request.body;
        const db = (0, database_1.getDb)();
        const collection = db.collection('users');
        const user = await collection.findOne({ username });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            reply.status(401).send({ message: 'Invalid username or password' });
            return;
        }
        token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '1h' });
        reply.status(200).send({ token });
    });
};
exports.default = authRoutes;
