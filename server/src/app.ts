import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import { memoriesRoutes } from './routes/memories.routes';
import { authRoutes } from './routes/auth.routes';
import { uploadRoutes } from './routes/upload';
import { resolve } from 'node:path';
import { userRoutes } from './routes/user.routes';

export const app = fastify();

app.register(multipart);

app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
});

app.register(cors, {
  origin: true,
});

app.register(jwt, {
  secret: 'spacetime',
});

app.register(authRoutes);
app.register(userRoutes, { prefix: '/users' });
app.register(memoriesRoutes, { prefix: '/memories' });
app.register(uploadRoutes);
