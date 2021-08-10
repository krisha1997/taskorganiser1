//selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

//functions
const addTodo = (event) => {
  event.preventDefault();

  console.log("Add todo");
  if (todoInput.value === "") {
    alert("Please enter a task");
    return;
  }

  //Creating TODO Div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  //Create List Item
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  //Save todo to localStorage
  let status = "incomplete";
  saveTodos(todoInput.value, status);

  //Check mark button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = `<i class="fas fa-check"></i>`;
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);

  //Check mark button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);

  //Add the TODO Div to ul
  todoList.appendChild(todoDiv);
  todoInput.value = "";
};

const deleteCheck = (e) => {
  const item = e.target;

  //Delete Item
  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;
    todo.classList.add("fall");
    removeSavedTodos(todo);
    todo.addEventListener("transitionend", () => todo.remove());
  }

  //Check Item
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");

    if (todo.classList.contains("completed")) {
      updateSavedStatuses(todo, "completed");
    } else updateSavedStatuses(todo, "incomplete");

    filterTodo();
  }
};

const filterTodo = (e) => {
  const todos = todoList.childNodes;

  todos.forEach((todo) => {
    switch (filterOption.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) todo.style.display = "flex";
        else todo.style.display = "none";
        break;
      case "incomplete":
        if (!todo.classList.contains("completed")) todo.style.display = "flex";
        else todo.style.display = "none";
        break;
    }
  });
};

const saveTodos = (todo, status) => {
  //Check if there are todos already stored in localStorage
  let [todos, statuses] = checkLocalStorage();

  todos.push(todo);
  statuses.push(status);
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("statuses", JSON.stringify(statuses));
};

const getTodos = () => {
  //Check if there are todos already stored in localStorage
  let [todos, statuses] = checkLocalStorage();

  todos.forEach((todo, index) => {
    //Creating TODO Div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    //Create List Item
    const newTodo = document.createElement("li");
    newTodo.innerText = todo;
    newTodo.classList.add("todo-item");

    todoDiv.appendChild(newTodo);
    if (statuses !== null && statuses[index] === "completed")
      newTodo.parentElement.classList.add("completed");

    //Check mark button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = `<i class="fas fa-check"></i>`;
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    //Check mark button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    //Add the TODO Div to ul
    todoList.appendChild(todoDiv);
  });
};

const removeSavedTodos = (todo) => {
  //Check if there are todos already stored in localStorage
  let [todos, statuses] = checkLocalStorage();

  const todoIndex = todo.children[0].innerText;
  statuses.splice(todos.indexOf(todoIndex), 1);
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("statuses", JSON.stringify(statuses));
};

const updateSavedStatuses = (todo, status) => {
  //Check if there are todos already stored in localStorage
  let [todos, statuses] = checkLocalStorage();

  const todoIndex = todo.children[0].innerText;
  statuses[todos.indexOf(todoIndex)] = status;
  localStorage.setItem("statuses", JSON.stringify(statuses));
};

const checkLocalStorage = () => {
  let todos, statuses;

  if (
    localStorage.getItem("todos") === null &&
    localStorage.getItem("statuses") === null
  ) {
    todos = [];
    statuses = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
    statuses = JSON.parse(localStorage.getItem("statuses"));
  }

  return [todos, statuses];
};

//event listeners
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);
document.addEventListener("DOMContentLoaded", getTodos);
document.addEventListener("DOMContentLoaded", filterTodo);
