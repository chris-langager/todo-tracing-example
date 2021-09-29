let selectedBoardId, user;

const todosListElement = document.getElementById('todos');

const userFormElement = document.getElementById('user-form');
const userInputElement = document.getElementById('user-input');

pageLoaded();

async function pageLoaded() {
  user = await getSelf();
  userInputElement.value = user.name;

  userFormElement.onsubmit = (e) => {
    e.preventDefault();
    usernameUpdated(e.target[0].value);
  };

  const boards = await listBoards();

  const boardsListElement = document.getElementById('boards');

  for (let boardElement of boards.map(toBoardElement)) {
    await boardsListElement.appendChild(boardElement);
  }

  boardSelected(boards[0]);

  const newTodoFormElement = document.getElementById('new-todo-form');
  newTodoFormElement.onsubmit = newTodoFormSubmitted;
}

async function usernameUpdated(username) {
  userInputElement.value = username;
  userInputElement.blur();
}

async function newTodoFormSubmitted(e) {
  e.preventDefault();
  const [input] = e.target;
  const { value } = input;

  const todo = await createTodo({
    boardId: selectedBoardId,
    text: value,
  });

  const todoElement = todoToElement(todo);
  todosListElement.appendChild(todoElement);

  const newTodoInputElement = document.getElementById('new-todo-input');
  newTodoInputElement.value = '';
  newTodoInputElement.focus();
}

async function boardSelected(board) {
  const { id, name } = board;
  if (selectedBoardId === id) return;
  selectedBoardId = id;

  const boardElements = document.getElementsByClassName('board');
  for (let boardElement of boardElements) {
    boardElement.classList.remove('selected');
  }
  document.getElementById(`board-${id}`).classList.add('selected');

  todosListElement.innerHTML = `loading ${name} board...`;
  const todos = await listTodos(id);
  todosListElement.innerHTML = '';

  for (let todoElement of todos.map(todoToElement)) {
    todosListElement.appendChild(todoElement);
  }
}

function toBoardElement(board) {
  const { id, name } = board;
  const element = htmlToElement(`
  <div id="board-${id}" class="board">
     ${name}
  </div>
  `);

  element.onclick = () => boardSelected(board);

  return element;
}

async function deleteButtonClicked(e, id) {
  e.stopPropagation();
  await deleteTodo(id);
  document.getElementById(`todo-${id}`).remove();
}

function todoToElement(todo) {
  const element = htmlToElement(`
      <div id="todo-${todo.id}" class="todo ${todo.completed ? 'completed' : ''}">
          <div class="todo-text">
          ${todo.text}
          </div>

          <div class="delete" onclick="deleteButtonClicked(event, '${todo.id}')">x</div>

          <div class="todo-created-by">
          ${todo.createdBy.name}
          </div>

          <div class="todo-date-created">
          ${new Date(todo.dateCreated).toLocaleString()}
          </div>

          
      </div>
      `);

  // const deleteButtonElement = htmlToElement(`<div class="delete">x</div>`);
  // element.replaceChild(deleteButtonElement, element.childNodes[2]);
  // deleteButtonElement.onclick = (e) => {
  //   e.stopPropagation();
  //   todoDeleted(todo.id);
  // };

  // element.appendChild(deleteButtonElement);

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

async function getSelf() {
  return {
    id: 'asdf',
    name: 'anonymous',
  };
}

async function listBoards() {
  const { data: boards } = await fetch(`/api/boards`).then((response) => response.json());
  return boards;
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

async function createTodo(todo) {
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

async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, {
    method: 'DELETE',
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error('error deleting todo');
    }
  });
}
