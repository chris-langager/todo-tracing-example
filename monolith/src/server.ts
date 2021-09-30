import * as express from 'express';
import * as api from './api';
import { ENV } from './env';

const app = express();
const port = parseInt(ENV.PORT);

app.use((req, res, next) => {
  console.log(req.path);
  next();
});

//middleware
app.use(express.json());

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}
app.use((req, res, next) => {
  req.userId = 'e687f45a-1bec-429a-bb51-caa5aa505b87';
  next();
});

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.get('/users', api.listUsers);
app.post('/users', api.createUser);
app.put('/users', api.updateUser);

app.get('/boards', api.listBoards);
app.post('/boards', api.createBoard);
app.put('/boards/:id', api.updateBoard);

app.get('/todos', api.listTodos);
app.post('/todos', api.createTodo);
app.put('/todos/:id', api.updateTodo);
app.delete('/todos/:id', api.deleteTodo);

export function start() {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}...`);
  });
}
