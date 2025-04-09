document.addEventListener('DOMContentLoaded', () => {
    const newTaskInput = document.getElementById('newTask');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const allBtn = document.getElementById('allBtn');
    const activeBtn = document.getElementById('activeBtn');
    const completedBtn = document.getElementById('completedBtn');

    let tasks = [];
    let currentFilter = 'all';

    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="${task.completed ? 'completed-task' : ''}">${task.text}</span>
                <div class="task-actions">
                    ${task.completed ? '<button class="undo" data-index="' + index + '">Undo</button>' : '<button class="complete" data-index="' + index + '">Complete</button>'}
                    <button class="delete" data-index="${index}">Delete</button>
                </div>
            `;
            taskList.appendChild(listItem);
        });

        // Add event listeners to the newly created buttons
        addEventListenersToTaskActions();
    }

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText !== '') {
            tasks.push({ text: taskText, completed: false });
            newTaskInput.value = '';
            renderTasks();
        }
    }

    function toggleComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    }

    function deleteTask(index) {
        tasks = tasks.filter((_, i) => i !== index);
        renderTasks();
    }

    function addEventListenersToTaskActions() {
        const completeButtons = document.querySelectorAll('.complete');
        completeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                toggleComplete(index);
            });
        });

        const undoButtons = document.querySelectorAll('.undo');
        undoButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                toggleComplete(index);
            });
        });

        const deleteButtons = document.querySelectorAll('.delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                deleteTask(index);
            });
        });
    }

    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    allBtn.addEventListener('click', () => {
        currentFilter = 'all';
        renderTasks();
        setActiveFilterButton(allBtn);
    });

    activeBtn.addEventListener('click', () => {
        currentFilter = 'active';
        renderTasks();
        setActiveFilterButton(activeBtn);
    });

    completedBtn.addEventListener('click', () => {
        currentFilter = 'completed';
        renderTasks();
        setActiveFilterButton(completedBtn);
    });

    function setActiveFilterButton(activeButton) {
        document.querySelectorAll('.filter-buttons button').forEach(btn => {
            btn.classList.remove('active-filter');
        });
        activeButton.classList.add('active-filter');
    }

    // Initial rendering of tasks (if any were loaded from storage, for example)
    renderTasks();
});