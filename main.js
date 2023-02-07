const taskForm = document.querySelector('.form--task');
const taskTitle = document.getElementById('task-title');
const taskDueDate = document.getElementById('due-date');
const taskDescription = document.querySelector('.task-description');
const error = document.querySelector('.error-message');
const taskContainer = document.querySelector('.task-list-container');
const newTask = document.querySelector('.btn--new-task');

const filterMenu = document.querySelector('.filter-menu');
const allButton = document.querySelector('.all-btn');
const completedButton = document.querySelector('.completed-btn');
const uncompletedButton = document.querySelector('.uncompleted-btn');

let lastId;

let filterNumber = localStorage.getItem('filter') || -1;

allButton.addEventListener('click', (e) => {
    resetFilter(e);
    filterButtonColor(e);
    fetchFilterTask(-1);
});

completedButton.addEventListener('click', (e) => {
    resetFilter(e);
    filterButtonColor(e);
    fetchFilterTask(1);
});

uncompletedButton.addEventListener('click', (e) => {
    resetFilter(e);
    filterButtonColor(e);
    fetchFilterTask(0);
});

let resetFilter = (e) => {
    for (let ele of filterMenu.children) {
        ele.style.backgroundColor = '#fff';
        ele.style.borderColor = '#ebebeb';
    }
};

let filterButtonColor = (e) => {
    e.target.style.backgroundColor = 'var(--color-primary)';
    e.target.style.borderColor = 'var(--color-primary)';
};

let fetchFilterTask = (status) => {
    localStorage.setItem('filter', status);
    if (status === -1) {
        allButton.style.backgroundColor = 'var(--color-primary)';
        allButton.style.borderColor = 'var(--color-primary)';
        createTask(tasks);
        return;
    }
    let compTask = tasks.filter((obj) => {
        return obj.status === status
    });
    createTask(compTask);
};



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
    fetchFilterTask(parseInt(localStorage.getItem('filter')));
    localStorage.setItem('data', JSON.stringify(tasks));
    resetForm();
}

let createTask = (t = tasks) => {
    if (t.length !== 0) {
        taskContainer.innerHTML = t.map((obj) => {
            let { id, title, dueDate, description, status } = obj;
            return `<div class="task-list" id=task-id-${id}>
            <svg class="icon task--status" onclick=changeStatus(${id}) style="fill : ${status === 0 ? 'var(--color-text)' : 'var(--color-primary)'}">
                <use href="images/sprite.svg#${status === 0 ? 'circle' : 'taskdone'}"></use>
            </svg>
            <div class="task__title">
                <span class="task__title-name">${title}</span>
                <span class="task__title-date">${dueDate}</span>
            </div>
            <p class="task__description">${description}</p>
            <div class="task-list__action-btn">
                <span class="icon-container icon--task-list-action" onclick=updateTask(${id})>
                    <svg class="icon btn--edit-delete">
                        <use href="images/sprite.svg#edit"></use>
                    </svg>
                </span>
                <span class="icon-container icon--task-list-action" onclick=deleteTask(${id})>
                    <svg class="icon btn--edit-delete">
                        <use href="images/sprite.svg#delete"></use>
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
            <source type="image/webp" src="./images/notFound.webp">
            <source type="image/png" src="./images/notFound.png">
            <img src="images/notFound.png" alt="">
        </picture>
        <p class="not-found-label"> Task list is empty.</p>
    </div>`;
    }

};

fetchFilterTask(-1);


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
    fetchFilterTask(parseInt(localStorage.getItem('filter')));
    localStorage.setItem('data', JSON.stringify(tasks));
}

let changeStatus = (id) => {
    let res = tasks.findIndex((obj) => obj.id === id);
    tasks[res].status = (tasks[res].status === 0) ? 1 : 0;
    // console.log(typeof );
    fetchFilterTask(parseInt(localStorage.getItem('filter')));
    localStorage.setItem('data', JSON.stringify(tasks));
};