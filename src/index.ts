import App from './App';
import dotenv from 'dotenv';
import UserController from './controllers/UserController';

dotenv.config();
const port: Number = parseInt(process.env.PORT as string, 10);

const app = new App(port);

app.listen();

export default app;