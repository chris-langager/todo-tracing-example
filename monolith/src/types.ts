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
  createdBy: string;
  boardId: string;
  text: string;
  completed: boolean;
}
