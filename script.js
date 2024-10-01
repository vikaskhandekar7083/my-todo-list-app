<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced To-Do List</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Roboto:wght@400;500&display=swap" rel="stylesheet">
    <style>
        /* [Previous CSS remains the same, adding new styles for priorities] */
        .priority-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            margin-left: 8px;
        }

        .priority-high {
            background-color: #f44336;
            color: white;
        }

        .priority-medium {
            background-color: #ff9800;
            color: white;
        }

        .priority-low {
            background-color: #4caf50;
            color: white;
        }

        .completed-task {
            text-decoration: line-through;
            opacity: 0.7;
        }

        .progress-container {
            background-color: #e0e0e0;
            border-radius: 50px;
            margin: 20px 0;
            height: 10px;
        }

        .progress-bar {
            background-color: #4caf50;
            height: 100%;
            border-radius: 50px;
            transition: width 0.3s ease;
        }

        .dark-mode .progress-container {
            background-color: #444;
        }

        .dark-mode .progress-bar {
            background-color: #76ff03;
        }

        .task-input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }

        .task-input-group select {
            width: 30%;
        }

        .task-input-group input {
            width: 70%;
            margin-bottom: 0;
        }
    </style>
</head>
<body>
    <button class="mode-toggle" id="modeToggle">Dark Mode</button>
    <div class="container">
        <h1>Advanced To-Do List</h1>
        <form id="addTaskForm" class="task-input-group">
            <input type="text" id="newTaskInput" placeholder="Enter new task" required>
            <select id="taskPriority">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
        </form>
        <button id="addTaskBtn">Add Task</button>
        <input type="text" id="searchTask" placeholder="Search tasks">
        <div class="progress-container">
            <div class="progress-bar" style="width: 0%"></div>
        </div>
        <ul id="taskList"></ul>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Select DOM elements
            const taskInput = document.getElementById('newTaskInput');
            const taskList = document.getElementById('taskList');
            const searchInput = document.getElementById('searchTask');
            const progressBar = document.querySelector('.progress-bar');
            const addTaskBtn = document.getElementById('addTaskBtn');
            const modeToggle = document.getElementById('modeToggle');
            const taskPriority = document.getElementById('taskPriority');

            // Initialize tasks array
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

            // Function to add a new task
            function addTask(taskText, priority = 'Low', completed = false) {
                const task = {
                    id: Date.now(),
                    text: taskText,
                    priority: priority,
                    completed: completed
                };
                tasks.push(task);
                saveTasks();
                renderTasks();
                updateProgressBar();
            }

            // Function to render tasks
            function renderTasks(filter = '') {
                const filteredTasks = tasks.filter(task =>
                    task.text.toLowerCase().includes(filter.toLowerCase())
                );

                taskList.innerHTML = filteredTasks.map(task => `
                    <li class="task-item ${task.completed ? 'completed-task' : ''}">
                        <div class="task-content">
                            <span>${task.text}</span>
                            <span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
                        </div>
                        <div class="button-group">
                            <button onclick="toggleTask(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                            <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                        </div>
                    </li>
                `).join('');
            }

            // Function to toggle task completion
            window.toggleTask = function(taskId) {
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    task.completed = !task.completed;
                    saveTasks();
                    renderTasks(searchInput.value);
                    updateProgressBar();
                }
            };

            // Function to edit task
            window.editTask = function(taskId) {
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    const newText = prompt('Edit task:', task.text);
                    if (newText !== null && newText.trim() !== '') {
                        task.text = newText.trim();
                        saveTasks();
                        renderTasks(searchInput.value);
                    }
                }
            };

            // Function to delete task
            window.deleteTask = function(taskId) {
                if (confirm('Are you sure you want to delete this task?')) {
                    tasks = tasks.filter(t => t.id !== taskId);
                    saveTasks();
                    renderTasks(searchInput.value);
                    updateProgressBar();
                }
            };

            // Function to update progress bar
            function updateProgressBar() {
                const totalTasks = tasks.length;
                const completedTasks = tasks.filter(t => t.completed).length;
                const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                progressBar.style.width = `${progress}%`;
            }

            // Function to save tasks to localStorage
            function saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }

            // Event Listeners
            addTaskBtn.addEventListener('click', function() {
                const taskText = taskInput.value.trim();
                if (taskText) {
                    addTask(taskText, taskPriority.value);
                    taskInput.value = '';
                }
            });

            taskInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addTaskBtn.click();
                }
            });

            searchInput.addEventListener('input', function() {
                renderTasks(this.value);
            });

            modeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                const isDarkMode = document.body.classList.contains('dark-mode');
                this.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
                localStorage.setItem('darkMode', isDarkMode);
            });

            // Initialize
            if (localStorage.getItem('darkMode') === 'true') {
                document.body.classList.add('dark-mode');
                modeToggle.textContent = 'Light Mode';
            }

            renderTasks();
            updateProgressBar();
        });
    </script>
</body>
</html>