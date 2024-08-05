import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../database';

const SECRET = 'your_jwt_secret'; // Use environment variables in a real application

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Register route
  fastify.post('/auth/register', async (request, reply) => {
    const { username, password } = request.body as { username: string; password: string };

    const hashedPassword = await bcrypt.hash(password, 10);
    const db = getDb();
    const collection = db.collection('users');
    await collection.insertOne({ username, password: hashedPassword });

    reply.status(200).send({ message: 'User registered successfully' });
  });

  // Login route
  fastify.post('/auth/login', async (request, reply) => {
    const authorization = request.headers["authorization"];
    let token = authorization?.split(' ')[1];

    if(token) {
      return jwt.verify(token, SECRET)
      ? reply.status(200).send({ token, message: "Logged In" })
      : reply.status(500).send({ message: "Session Expired. Please Log In Again"});
    }

    const { username, password } = request.body as { username: string; password: string };
    const db = getDb();
    const collection = db.collection('users');
    const user = await collection.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.status(401).send({ message: 'Invalid username or password' });
    }

    token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '1h' });
    console.log(token);
    reply.status(200).send({ token });
  });
};

export default authRoutes;
