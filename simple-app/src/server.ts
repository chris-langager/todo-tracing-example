import * as express from 'express';
import * as api from './api';
import { ENV } from './env';

const app = express();
const port = parseInt(ENV.PORT);

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

app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

//api
app.get('/api/users', api.listUsers);
app.post('/api/users', api.createUser);
app.put('/api/users', api.updateUser);

app.get('/api/boards', api.listBoards);
app.post('/api/boards', api.createBoard);
app.put('/api/boards/:id', api.updateBoard);

app.get('/api/todos', api.listTodos);
app.post('/api/todos', api.createTodo);
app.put('/api/todos/:id', api.updateTodo);
app.delete('/api/todos/:id', api.deleteTodo);

//static content
app.use(express.static('public'));

export function start() {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}...`);
  });
}
