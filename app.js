'use strict';

const refs = {
  form: document.querySelector('.js-editor'),
  todoList: document.querySelector('.js-todo-list'),
  doneIcon: document.querySelector('.done-icon')
};

const todo = {
  todoArr: JSON.parse(localStorage.getItem('todos') || '[]'),
  add(text) {
    const todo = {
      id: shortid(),
      text
    };
    this.todoArr.push(todo);
    localStorage.setItem('todos', JSON.stringify(this.todoArr));
    return todo;
  },
  delete(id) {
    this.todoArr = this.todoArr.filter(el => el.id !== id);
    localStorage.setItem('todos', JSON.stringify(this.todoArr));
  },
  displayTodo() {
    this.todoArr.map(todo => createMarkup(todo));
  },
  showAlert(message) {
    const div = document.createElement('div');
    div.classList.add('error');
    div.textContent = message;
    document.body.insertBefore(div, form);
    setTimeout(() => {
      div.remove();
    }, 2000);
  }
};

refs.form.addEventListener('submit', submitHandler);
refs.todoList.addEventListener('click', deleteTodo);
refs.todoList.addEventListener('click', editTodo);
document.addEventListener('DOMContentLoaded', todo.displayTodo.bind(todo));

function submitHandler(e) {
  e.preventDefault();
  const input = e.currentTarget.elements.text.value;
  if (input !== '') {
    const todoObj = todo.add(input);
    createMarkup(todoObj);
    e.currentTarget.reset();
  } else {
    todo.showAlert("You didn't add anything!");
  }
}

function createMarkup(obj) {
  const markup = `
  <li data-id="${obj.id}" class="todo-list__item">
    <div class="todo__actions">
      <button class="button">Done</button>
      <p class="todo__text">${obj.text}</p>
      <a href="#" class="edit"><i class="material-icons edit">edit</i></a>
    </div>
  </li>
  `;
  refs.todoList.insertAdjacentHTML('beforeend', markup);
}

function deleteTodo(e) {
  if (e.target.nodeName === 'BUTTON') {
    const li = e.target.closest('.todo-list__item');
    li.style.textDecoration = 'line-through';
    refs.doneIcon.classList.remove('hide');
    refs.doneIcon.src = './img/checkmark.gif'
    setTimeout(() => {
      todo.delete(li.dataset.id);
      li.remove();
      refs.doneIcon.classList.add('hide');
    }, 1400)
  }
}

function editTodo(e) {
  if(e.target.classList.contains('edit')) {
    const editContainer = document.createElement('div');
    const editInputField = document.createElement('input');
    const saveIcon = document.createElement('a');
    saveIcon.classList.add('save');
    saveIcon.innerHTML = `<i class="material-icons save-icon">save</i>`;
    const li = e.target.closest('.todo-list__item');
    editContainer.classList.add('edit-container');
    editInputField.classList.add('edit-input');
    let originalText = li.children[0].children[1].innerText;
    editInputField.defaultValue = originalText;
    editContainer.append(editInputField);
    editContainer.append(saveIcon);
    li.append(editContainer);
  } else if(e.target.classList.contains('save-icon')) {
    let newInputValue = e.target.parentElement.parentElement.children[0].value;
    let oldInputValue = e.target.parentElement.parentElement.previousElementSibling.children[1].textContent;
    todo.todoArr.forEach(el => {
      el.text === oldInputValue ? el.text = newInputValue : el;
    });
    console.log(todo.todoArr);
    localStorage.setItem('todos', JSON.stringify(todo.todoArr));
    e.target.parentElement.parentElement.previousElementSibling.children[1].textContent = newInputValue;
    e.target.closest('.edit-container').remove();
  }
}