(function (Drupal) {
  Drupal.behaviors.todoApp = {
    attach(context) {
      const input = once('todo-input', '.todo__input', context)[0];
      const addBtn = once('todo-add', '.todo__add', context)[0];
      const list = once('todo-list', '.todo__list', context)[0];

      // Validation
      if (!input || !addBtn || !list) return;

      // Load tasks from localStorage
      const savedTasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
      savedTasks.forEach(({ task, status }) => {
        const taskText = createTaskElement(task, status);
        list.appendChild(taskText);
      });

      // Reusable function to create a new task element
      function createTaskElement(taskText, isCompleted = false) {
        const li = document.createElement('li');
        li.classList.add('todo__item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo__check';
        checkbox.checked = isCompleted;

        const span = document.createElement('span');
        span.className = 'todo__text';
        span.textContent = taskText;
        if (isCompleted) span.classList.add('completed');

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo__delete';
        const deleteIcon = document.createElement('i');
        deleteBtn.appendChild(deleteIcon);
        deleteIcon.classList.add('fa-solid', 'fa-xmark');

        checkbox.addEventListener('change', () => {
          span.classList.toggle('completed', checkbox.checked);
          updateLocalStorage();
        });

        deleteBtn.addEventListener('click', () => {
          li.remove();
          updateLocalStorage();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        return li;
      }

      // Add new task
      addBtn.addEventListener('click', () => {
        const task = input.value.trim();
        if (task) {
          const newTask = createTaskElement(task);
          list.appendChild(newTask);
          input.value = '';
          updateLocalStorage();
        }
      });

      // Update localStorage with current list
      function updateLocalStorage() {
        const tasks = Array.from(list.children).map((li) => {
          return {
            task: li.querySelector('.todo__text').textContent,
            status: li.querySelector('.todo__check').checked
          };
        });
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
      }
    }
  };
})(Drupal);
