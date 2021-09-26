import * as express from 'express';
import { migrate } from './store/migrate';
import * as store from './store';
import { v4 as newId } from 'uuid';

const app = express();
const port = parseInt(process.env.PORT || '3000');

app.use(express.json());

app.get('/api/todos', async (req, res) => {
  const { todos } = await store.listTodos();
  res.json({ data: todos });
});

app.post('/api/todos', async (req, res) => {
  const data = req.body;
  if (!data.text) {
    res.statusCode = 400;
    res.json({
      code: 400,
      message: 'missing required property "text"',
    });
    return;
  }

  const id = newId();

  const todo = await store.upsertTodo({
    id,
    createdBy: 'e687f45a-1bec-429a-bb51-caa5aa505b87',
    boardId: '60748e3f-9118-49f5-b650-9f98855cd0ba',
    text: data.text,
    completed: false,
  });
  res.json(todo);
});

app.put('/api/todos', async (req, res) => {
  const { id, text, completed } = req.body;
  const todo = await store.getTodo(id);
  if (!todo) {
    res.json({ code: 404, message: `could not find todo with id "${id}"` });
  }

  const updatedTodo = store.upsertTodo({ ...todo, text, completed });
  res.json(updatedTodo);
});

app.delete('/api/todos/:id', (req, res) => {
  // store.deleteTodo(req.params.id);
  res.json({});
});

app.use(express.static('public'));

(async () => {
  console.log('running db migrations...');
  await migrate();

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}...`);
  });
})();
