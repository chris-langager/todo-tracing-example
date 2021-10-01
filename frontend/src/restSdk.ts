export async function getSelf() {
  const user = await fetch(`/api/self`).then((response) => response.json());
  return user;
}

export async function updateUser(user) {
  const updatedUser = await fetch(`/api/users/${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(user),
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error('error updating user');
    }
    return response.json();
  });

  return updatedUser;
}

export async function listBoards() {
  const { data: boards } = await fetch(`/api/boards`).then((response) => response.json());
  return boards;
}

export async function listTodos(boardId) {
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

export async function createTodo(todo) {
  return fetch(`/api/todos`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(todo),
  }).then(async (response) => {
    if (response.status !== 200) {
      throw new Error('error creating todo');
    }
    return response.json();
  });
}

export async function updateTodo(todo) {
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

export async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, {
    method: 'DELETE',
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error('error deleting todo');
    }
  });
}
