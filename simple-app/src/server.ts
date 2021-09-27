import * as express from 'express';
import * as api from './api';
import { ENV } from './env';

const app = express();
const port = parseInt(ENV.PORT);

//middleware
app.use(express.json());

app.use('/api', (req, res, next) => {
  console.log('header set');
  res.setHeader('Content-Type', 'application/json');
  next();
});

//api
app.get('/api/users', api.listUsers);
app.post('/api/users', api.createUser);
app.put('/api/users', api.updateUser);

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
