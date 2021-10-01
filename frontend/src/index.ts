import * as sdk from './restSdk';
import { htmlToElement } from './utils';

let selectedBoardId, user;

const todosListElement = document.getElementById('todos');

const userFormElement = document.getElementById('user-form');
const userInputElement = document.getElementById('user-input') as HTMLInputElement;

pageLoaded();

async function pageLoaded() {
  user = await sdk.getSelf();
  userInputElement.value = user.name;

  userFormElement.onsubmit = (e) => {
    e.preventDefault();
    usernameUpdated(e.target[0].value);
  };

  const boards = await sdk.listBoards();

  const boardsListElement = document.getElementById('boards');

  for (let boardElement of boards.map(toBoardElement)) {
    await boardsListElement.appendChild(boardElement);
  }

  boardSelected(boards[0]);

  const newTodoFormElement = document.getElementById('new-todo-form');
  newTodoFormElement.onsubmit = newTodoFormSubmitted;
}

async function usernameUpdated(name) {
  user = await sdk.updateUser({ ...user, name });
  userInputElement.value = user.name;
  userInputElement.blur();
  const usernameElements = document.getElementsByClassName(`todo-created-by-${user.id}`);
  for (let usernameElement of Array.from(usernameElements)) {
    usernameElement.innerHTML = user.name;
  }
}

async function newTodoFormSubmitted(e) {
  e.preventDefault();
  const [input] = e.target;
  const { value } = input;

  const todo = await sdk.createTodo({
    boardId: selectedBoardId,
    text: value,
  });

  const todoElement = todoToElement({ ...todo, createdBy: user });
  todosListElement.appendChild(todoElement);

  const newTodoInputElement = document.getElementById('new-todo-input') as HTMLInputElement;
  newTodoInputElement.value = '';
  newTodoInputElement.focus();
}

async function boardSelected(board) {
  const { id, name } = board;
  if (selectedBoardId === id) return;
  selectedBoardId = id;

  const boardElements = document.getElementsByClassName('board');

  for (let boardElement of Array.from(boardElements)) {
    boardElement.classList.remove('selected');
  }
  document.getElementById(`board-${id}`).classList.add('selected');

  todosListElement.innerHTML = `loading ${name} board...`;
  const todos = await sdk.listTodos(id);
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

window['deleteButtonClicked'] = async (e: MouseEvent, id: string) => {
  e.stopPropagation();
  await sdk.deleteTodo(id);
  document.getElementById(`todo-${id}`).remove();
};

function todoToElement(todo) {
  const element = htmlToElement(`
      <div id="todo-${todo.id}" class="todo ${todo.completed ? 'completed' : ''}">
        <div class="top">   
          <div class="todo-text">
            ${todo.text}
          </div>
      
          <div class="delete" onclick="deleteButtonClicked(event, '${todo.id}')">x</div>
        </div>

        <div class="bottom">  
          <div class="todo-created-by todo-created-by-${todo.createdBy.id}">
          ${todo.createdBy.name}
          </div>

          <div class="todo-date-created">
          ${new Date(todo.dateCreated).toLocaleString()}
          </div>
        </div>
      </div>
      `);

  element.onclick = async () => {
    todo.completed = !todo.completed;
    try {
      await sdk.updateTodo(todo);
      element.classList.toggle('completed');
    } catch (e) {
      console.log(e);
      todo.completed = !todo.completed;
    }
  };

  return element;
}
