import * as express from 'express';
import * as api from './api';
import { ENV } from './env';

const app = express();
const port = parseInt(ENV.PORT);

//middleware
app.use(express.json());

//api
app.get('/api/todos', api.listTodos);
app.post('/api/todos', api.createTodo);
app.put('/api/todos', api.updateTodo);
app.delete('/api/todos/:id', api.deleteTodo);

//static content
app.use(express.static('public'));

export function start() {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}...`);
  });
}
