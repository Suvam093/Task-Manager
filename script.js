const taskForm = document.querySelector('.taskForm');
const taskNameInput = document.querySelector('#taskname');
const dueDateInput = document.querySelector('#duedate');
const prioritySelect = document.querySelector('#priority');
const taskList = document.querySelector('#tasklist');
const duedateinput = document.querySelector('#duedate');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    renderTasks();
}

taskForm.addEventListener('submit', addTask);

function addTask(e) {
    e.preventDefault();
    console.log('Form submitted!'); 

    const taskName = taskNameInput.value;
    const dueDate = dueDateInput.value;
    const priority = prioritySelect.value;

    const task = {
        id: Date.now(),  
        taskName,
        dueDate,
        priority,
        completed: false,
    };

    if(taskName!="") {
        tasks.push(task);
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));

    taskForm.reset();

    // Re-render the task list
    renderTasks();
}

const today = new Date().toISOString().split('T')[0];
duedateinput.setAttribute('min', today);
console.log(today)

function renderTasks() {
    console.log(tasks.length)
    if(tasks.length==0) {
        taskList.innerHTML = '<li>There are no tasks to show.</li>';
    }
    taskList.innerHTML = ''; 

    tasks.map((task) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item', task.priority);

    
        if (task.completed) {
            taskItem.classList.add('completed');
        }
    
        taskItem.innerHTML = `
            <div>
                <span>${task.taskName}</span>

                <span>
                    <input type="checkbox" class="task-complete" ${task.completed ? 'checked' : ''}>
                    <button class="edit" data-id="${task.id}">Edit</button>
                    <button class="delete" data-id="${task.id}">Delete</button>
                </span>
            </div>
            <div>(Due: ${task.dueDate})</div>
        `;
    

        const taskCompleteCheckbox = taskItem.querySelector('.task-complete');
        taskCompleteCheckbox.addEventListener('change', (e) => {
            toggleTaskCompletion(task.id, e.target.checked);
        });
    
        taskItem.querySelector('.edit').addEventListener('click', () => {
            editTask(task.id);
        });
    
        taskItem.querySelector('.delete').addEventListener('click', () => {
            deleteTask(task.id);
        });
    
        taskList.appendChild(taskItem);
    });
    
}

function toggleTaskCompletion(taskId, isChecked) {
    const task = tasks.find((t) => t.id === taskId);
    task.completed = isChecked;

    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasks();
}


function editTask(taskId) {
    const task = tasks.find((t) => t.id === taskId);

    taskNameInput.value = task.taskName;
    dueDateInput.value = task.dueDate;
    prioritySelect.value = task.priority;

    deleteTask(taskId);
}



function deleteTask(taskId) {
    tasks = tasks.filter((t) => t.id !== taskId);

    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasks();
}
