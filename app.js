'use strict';

const refs = {
  form: document.querySelector('.js-editor'),
  todoList: document.querySelector('.js-todo-list')
};

class ToDo {
  todoList = JSON.parse(localStorage.getItem('todos') || '[]');
  add(text) {
    const todo = {
      id: shortid(),
      text
    };
    this.todoList.push(todo);
    return todo;
  }
  delete(id) {
    this.todoList = this.todoList.filter(el => el.id !== id);
  }
  displayToDos() {
    this.todoList.forEach(todo => createMarkup(todo));
  }
  showAlert(message) {
    const div = document.createElement('div');
    div.classList.add('error');
    div.textContent = message;
    document.body.insertBefore(div, form);
    setTimeout(() => {
      div.remove();
    }, 2000);
  }
}

const todo = new ToDo();

refs.form.addEventListener('submit', submitHandler);
document.addEventListener('DOMContentLoaded', todo.displayToDos.bind(todo));

function submitHandler(e) {
  e.preventDefault();
  const input = e.currentTarget.elements.text.value;
  if (input !== '') {
    const createdToDo = todo.add(input);
    createMarkup(createdToDo);
    localStorage.setItem('todos', JSON.stringify(todo.todoList));
    e.currentTarget.reset();
  } else {
    todo.showAlert("You didn't add anything!");
  }
}

function createMarkup(item) {
  const markup = `
  <li data-id="${item.id}" class="todo-list__item">
    <div class="todo__actions">
      <p class="todo__text">${item.text}</p>
      <button class="button">Delete</button>
    </div>
  </li>
  `;
  refs.todoList.insertAdjacentHTML('beforeend', markup);
}

refs.todoList.addEventListener('click', deleteToDo);

function deleteToDo(e) {
  if (e.target.tagName === 'BUTTON') {
    const li = e.target.closest('.todo-list__item');
    todo.delete(li.dataset.id);
    localStorage.setItem('todos', JSON.stringify(todo.todoList));
    li.remove();
  }
}