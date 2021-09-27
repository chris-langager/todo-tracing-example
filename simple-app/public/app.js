const DEFAULT_BOAD = '60748e3f-9118-49f5-b650-9f98855cd0ba';

(async () => {
  const todos = await listTodos(DEFAULT_BOAD);

  const todosListElement = document.getElementById('todos');
  for (let todoElement of todos.map(todoToElement)) {
    todosListElement.appendChild(todoElement);
  }
  //   todosListElement.innerHTML = todos.map(todoToElement).join('');
})();

async function listTodos(boardId) {
  const { data: todos } = await fetch(`/api/todos?boardId=${boardId}`).then((response) => response.json());
  const userIds = [...new Set(todos.map((todo) => todo.createdBy))];
  const { data: users } = await fetch(`/api/users?ids=${userIds.join(',')}`).then((response) => response.json());

  const usersById = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  return todos.map((todo) => ({
    ...todo,
    createdBy: usersById[todo.createdBy] || null,
  }));
}

async function listTodos(boardId) {
  const { data: todos } = await fetch(`/api/todos?boardId=${boardId}`).then((response) => response.json());
  const userIds = [...new Set(todos.map((todo) => todo.createdBy))];
  const { data: users } = await fetch(`/api/users?ids=${userIds.join(',')}`).then((response) => response.json());

  const usersById = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  return todos.map((todo) => ({
    ...todo,
    createdBy: usersById[todo.createdBy] || null,
  }));
}

async function updateTodo(todo) {
  await fetch(`/api/todos/${todo.id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(todo),
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error('error updating todo');
    }
  });
}

function todoToElement(todo) {
  const element = htmlToElement(`
      <div class="todo ${todo.completed ? 'completed' : ''}">
          <div class="todo-text">
          ${todo.text}
          <div>

          <div class="todo-created-by">
          ${todo.createdBy.name}
          <div>

          <div class="todo-date-created">
          ${new Date(todo.dateCreated).toLocaleString()}
          <div>
      </div>
      `);

  element.onclick = async () => {
    todo.completed = !todo.completed;
    try {
      await updateTodo(todo);
      element.classList.toggle('completed');
    } catch (e) {
      console.log(e);
      todo.completed = !todo.completed;
    }
  };

  return element;
}

function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}
