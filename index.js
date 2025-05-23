import 'dotenv/config.js';
import express from 'express';

const app = express();

app.listen(process.env.PORT, () => console.log('listening on port 8080'));
