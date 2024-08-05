import { FastifyPluginAsync } from 'fastify';
import jwt from 'jsonwebtoken';
import { getDb } from '../database';
import { ObjectId } from 'mongodb';

interface Task {
  readonly id?: string;
  readonly title: string;
  readonly isCompleted: boolean;
  readonly deadline: string;
}

interface JWTPayload {
  id: string;
}

const SECRET = 'your_jwt_secret'; // Use environment variables in a real application

const taskRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/tasks/view', async (request, reply) => {
    const authorization = request.headers["authorization"];
    const token = authorization?.split(' ')[1];

    if(!token) return;

    const db = getDb();
    const response = jwt.verify(token, SECRET) as JWTPayload;

    if(response){
      const collection = db.collection('tasks');
      const tasks = await collection.find({uid: response.id}).toArray();
      reply.status(200).send({ tasks: tasks.map((task) => ({ ...task, id: task._id }))});
    } else {
      reply.status(500).send({ message: "Something Went Wrong" });
    }
  });

  fastify.post('/tasks/addOrUpdate', async (request, reply) => {
    const { task } = request.body as { task: Task };
    const authorization = request.headers["authorization"];
    const token = authorization?.split(' ')[1];
    if(!token) return;
    const db = getDb();
    const response = jwt.verify(token, SECRET) as JWTPayload;

    let newTask = {};
    if(response){
      const collection = db.collection('tasks');
      if(task.id){
        await collection.updateOne({_id: new ObjectId(task.id)}, {$set: {task}});
        newTask = task;
      } else {
        newTask = await collection.insertOne({...task, uid: response.id});
      }

      reply.status(200).send({ message: 'Task Added Successfully', task: newTask });
    } else {
      reply.status(500).send({ message: "Something Went Wrong" });
    }
  });

  fastify.post('/tasks/delete', async (request, reply) => {
    const { id } = request.body as { id: string };
    const authorization = request.headers["authorization"];
    const token = authorization?.split(' ')[1];
    if(!token) return;
    const db = getDb();
    const response = jwt.verify(token, SECRET) as JWTPayload;

    if(response){
      const collection = db.collection('tasks');
      await collection.deleteOne({ _id: new ObjectId(id) });

      reply.status(200).send({ id, message: 'Task Deleted Successfully' });
    } else {
      reply.status(500).send({ message: "Something Went Wrong" });
    }
  });
};

export default taskRoutes;
