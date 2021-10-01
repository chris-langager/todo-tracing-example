export interface User {
  id: string;
  name: string;
}

export interface Board {
  id: string;
  createdBy: string;
  name: string;
}

export interface Todo {
  id: string;
  dateCreated: string;
  dateUpdated: string;
  createdBy: User;
  boardId: string;
  text: string;
  completed: boolean;
}

export async function getSelf(): Promise<User> {
  const user = await fetch(`/api/self`).then((response) => response.json());
  return user;
}

export async function updateUser(user: User): Promise<User> {
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

export async function listBoards(): Promise<Board[]> {
  const { data: boards } = await fetch(`/api/boards`).then((response) => response.json());
  return boards;
}

export async function listTodos(boardId: string): Promise<Todo[]> {
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

export async function createTodo(todo: { boardId: string; text: string }): Promise<Todo> {
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

export async function updateTodo(todo: {
  id: string;
  boardId: string;
  text: string;
  completed: boolean;
}): Promise<Todo> {
  return await fetch(`/api/todos/${todo.id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(todo),
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error('error updating todo');
    }
    return response.json();
  });
}

export async function deleteTodo(id: string) {
  await fetch(`/api/todos/${id}`, {
    method: 'DELETE',
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error('error deleting todo');
    }
  });
}
