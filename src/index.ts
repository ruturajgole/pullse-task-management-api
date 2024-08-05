import Fastify from 'fastify';
import { connectToDatabase } from './database';
import cors from "@fastify/cors";
import authRoutes from './routes/auth';
import taskRoutes from './routes/task';

const fastify = Fastify({
  logger: true
});
fastify.register(cors, {origin: "http://localhost:3001"});
fastify.register(authRoutes);
fastify.register(taskRoutes);

const start = async () => {
  try {
    await connectToDatabase();
    await fastify.listen({ port: 3000 });
    console.log('Server is running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
