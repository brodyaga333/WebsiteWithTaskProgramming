async function loadTasks(difficulty = 'beginner') {
    const container = document.getElementById('tasks-container');
    container.innerHTML = 'Загрузка...';

    try {
        const res = await fetch(`/api/problems?difficulty=${difficulty}`);
        const tasks = await res.json();

        container.innerHTML = tasks.map(task => `
            <div class="task">
                <div class="difficulty ${task.difficulty}">
                    ${getDifficultyLabel(task.difficulty)}
                </div>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <pre>${task.templateCode.replace(/\\n/g, '\n')}</pre>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = 'Ошибка загрузки задач';
        console.error(err);
    }
}

function getDifficultyLabel(difficulty) {
    const labels = {
        beginner: 'Начинающий',
        intermediate: 'Продвинутый',
        expert: 'Мастер'
    };
    return labels[difficulty] || 'Неизвестно';
}

// Загрузка задач для начинающих при старте
window.onload = () => loadTasks('beginner');