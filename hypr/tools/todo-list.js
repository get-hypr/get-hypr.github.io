export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">To-Do List</h3>
      <button id="pin-todo-list" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Add and manage your tasks.</p>
    <input id="todo-input" type="text" placeholder="Enter a task" class="tool-input">
    <button onclick="Hypr.toolUtilities.todoList.addTask()" class="todo-button primary">Add Task</button>
    <ul id="todo-list" class="todo-list"></ul>
  </div>
`;

export const css = `
  .todo-list { list-style: none; padding: 0; margin: 12px 0; }
  .todo-list li { display: flex; justify-content: space-between; align-items: center; padding: 8px; background-color: #334155; border: 1px solid #475569; border-radius: 8px; margin-bottom: 8px; color: #f1f5f9; }
  .todo-button { padding: 10px; background-color: #334155; color: #f1f5f9; border: 1px solid #475569; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background-color 0.2s, border-color 0.2s, transform 0.2s; }
  .todo-button:hover { background-color: #475569; border-color: #ff1a1a; transform: scale(1.05); }
  .todo-button.primary { background-color: #ff1a1a; border-color: #ff1a1a; }
  .todo-button.primary:hover { background-color: #e01414; border-color: #e01414; transform: scale(1.05); }
  .todo-delete { background-color: #334155; border: 1px solid #475569; color: #f1f5f9; padding: 5px 10px; border-radius: 8px; cursor: pointer; transition: background-color 0.2s, border-color 0.2s; }
  .todo-delete:hover { background-color: #ff1a1a; border-color: #ff1a1a; }
`;

export const init = (utils) => {
  const todoList = {
    addTask() {
      const input = utils.dom.getElement('todo-input');
      const list = utils.dom.getElement('todo-list');
      if (!input || !list || !input.value.trim()) return;

      const li = document.createElement('li');
      li.innerHTML = `
        <span>${input.value}</span>
        <button class="todo-delete" onclick="Hypr.toolUtilities.todoList.removeTask(this)">Delete</button>
      `;
      list.appendChild(li);
      input.value = '';
    },
    removeTask(button) {
      const li = button.parentElement;
      if (li) li.remove();
    }
  };
  Hypr.toolUtilities.todoList = todoList;
  const addButton = utils.dom.query('.todo-button.primary');
  if (addButton) addButton.addEventListener('click', todoList.addTask);
};