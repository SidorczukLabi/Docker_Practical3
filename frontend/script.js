
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const message = document.getElementById('message');

// Отримання завдань із сервера
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');

        if (!response.ok) {
            throw new Error('Не вдалося завантажити завдання');
        }

        const tasks = await response.json();

        taskList.innerHTML = '';

        if (tasks.length === 0) {
            message.textContent = 'Завдань поки немає.';
            return;
        }

        message.textContent = '';

        tasks.forEach(task => {
            const item = document.createElement('li');
            const title = document.createElement('span');
            const deleteButton = document.createElement('button');

            title.textContent = task.title;
            deleteButton.textContent = 'Видалити';

            deleteButton.addEventListener('click', () => {
                deleteTask(task.id);
            });

            item.appendChild(title);
            item.appendChild(deleteButton);
            taskList.appendChild(item);
        });
    } catch (error) {
        message.textContent = 'Помилка підключення до сервера.';
        console.error(error);
    }
}

// Додавання нового завдання
taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) return;

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            throw new Error('Не вдалося додати завдання');
        }

        taskInput.value = '';
        await loadTasks();
    } catch (error) {
        message.textContent = 'Помилка додавання завдання.';
        console.error(error);
    }
});

// Видалення завдання
async function deleteTask(id) {
    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Не вдалося видалити завдання');
        }

        await loadTasks();
    } catch (error) {
        message.textContent = 'Помилка видалення завдання.';
        console.error(error);
    }
}

// Початкове завантаження
loadTasks();
