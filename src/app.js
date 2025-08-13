import express from 'express';
import { usersRouter, transactionsRouter, authRouter } from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const swaggerDocument = JSON.parse(
    fs.readFileSync(
        path.join(import.meta.dirname, '../docs/swagger.json'),
        'utf8',
    ),
);

export const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/auth', authRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
