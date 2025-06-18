import 'dotenv/config.js';
import { app } from './src/app';

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
);
