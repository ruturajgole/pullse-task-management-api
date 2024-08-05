"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database");
const mongodb_1 = require("mongodb");
const SECRET = 'your_jwt_secret'; // Use environment variables in a real application
const taskRoutes = async (fastify) => {
    fastify.post('/tasks/view', async (request, reply) => {
        const authorization = request.headers["authorization"];
        const token = authorization?.split(' ')[1];
        if (!token)
            return;
        const db = (0, database_1.getDb)();
        const response = jsonwebtoken_1.default.verify(token, SECRET);
        if (response) {
            const collection = db.collection('tasks');
            const tasks = await collection.find({ uid: response.id }).toArray();
            reply.status(200).send({ tasks: tasks.map((task) => ({ ...task, id: task._id })) });
        }
    });
    fastify.post('/tasks/addOrUpdate', async (request, reply) => {
        const { task } = request.body;
        const authorization = request.headers["authorization"];
        const token = authorization?.split(' ')[1];
        if (!token)
            return;
        const db = (0, database_1.getDb)();
        const response = jsonwebtoken_1.default.verify(token, SECRET);
        let newTask = {};
        if (response) {
            const collection = db.collection('tasks');
            if (task.id) {
                await collection.updateOne({ _id: new mongodb_1.ObjectId(task.id) }, { $set: { task } });
                newTask = task;
            }
            else {
                newTask = await collection.insertOne({ ...task, uid: response.id });
            }
            reply.status(200).send({ message: 'Task Added Successfully', task: newTask });
        }
    });
    fastify.post('/tasks/delete', async (request, reply) => {
        const { id } = request.body;
        const authorization = request.headers["authorization"];
        const token = authorization?.split(' ')[1];
        if (!token)
            return;
        const db = (0, database_1.getDb)();
        const response = jsonwebtoken_1.default.verify(token, SECRET);
        if (response) {
            const collection = db.collection('tasks');
            await collection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            reply.status(200).send({ id, message: 'Task Deleted Successfully' });
        }
    });
};
exports.default = taskRoutes;
