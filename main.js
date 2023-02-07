const taskForm = document.querySelector('.form--task');
const taskTitle = document.getElementById('task-title');
const taskDueDate = document.getElementById('due-date');
const taskDescription = document.querySelector('.task-description');
const error = document.querySelector('.error-message');
const taskContainer = document.querySelector('.task-list-container');
const newTask = document.querySelector('.btn--new-task');

let lastId;


newTask.addEventListener('click', () => {
    taskTitle.focus();
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formValidation();
});

let formValidation = () => {
    if (taskTitle.value === '') {
        error.innerText = "Task can't be empty";
    }
    else {
        error.innerText = "";
        acceptData();
    }
};

let tasks = JSON.parse(localStorage.getItem('data')) || [];
let acceptData = () => {
    lastId = (tasks.length !== 0) ? tasks[tasks.length - 1].id + 1 : 1;
    tasks.push({
        id: lastId,
        title: taskTitle.value,
        dueDate: taskDueDate.value,
        description: taskDescription.value,
        status: 0
    });
    createTask();
    localStorage.setItem('data', JSON.stringify(tasks));
    resetForm();
}

let createTask = () => {
    if (tasks.length !== 0) {
        taskContainer.innerHTML = tasks.map((obj) => {
            let { id, title, dueDate, description, status } = obj;
            return `<div class="task-list" id=task-id-${id}>
            <svg class="icon task--status" onclick=changeStatus(${id}) style="fill : ${status === 0 ? 'var(--color-text)' : 'var(--color-primary)'}">
                <use xlink:href="images/sprite.svg#${status === 0 ? 'circle' : 'taskdone'}"></use>
            </svg>
            <div class="task__title">
                <span class="task__title-name">${title}</span>
                <span class="task__title-date">${dueDate}</span>
            </div>
            <p class="task__description">${description}</p>
            <div class="task-list__action-btn">
                <span class="icon-container icon--task-list-action" onclick=updateTask(${id})>
                    <svg class="icon btn--edit-delete">
                        <use xlink:href="images/sprite.svg#edit"></use>
                    </svg>
                </span>
                <span class="icon-container icon--task-list-action" onclick=deleteTask(${id})>
                    <svg class="icon btn--edit-delete">
                        <use xlink:href="images/sprite.svg#delete"></use>
                    </svg>
                </span>
            </div>
        </div>
        `
        }).join('');
    }
    else {
        taskContainer.innerHTML = `<div class="not-found">
        <picture>
            <source type="image/webp" src="./images/empty.webp">
            <source type="image/png" src="./images/empty.png">
            <img src="./images/empty.png" alt="">
        </picture>
        <p class="not-found-label"> Task list is empty.</p>
    </div>`;
    }

};

createTask();

let resetForm = () => {
    taskTitle.value = '';
    taskDueDate.value = '';
    taskDescription.value = '';
};


let updateTask = (id) => {
    let currTask = tasks.find((obj) => obj.id === id);
    taskTitle.value = currTask.title;
    taskDueDate.value = currTask.dueDate;
    taskDescription.value = currTask.description;
    deleteTask(id);
}

let deleteTask = (id) => {
    let res = tasks.findIndex((obj) => obj.id === id);
    tasks.splice(res, 1);
    createTask();
    localStorage.setItem('data', JSON.stringify(tasks));
}

let changeStatus = (id) => {
    let res = tasks.findIndex((obj) => obj.id === id);
    tasks[res].status = 1;
    createTask();
    localStorage.setItem('data', JSON.stringify(tasks));
};