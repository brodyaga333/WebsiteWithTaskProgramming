async function loadTasks(difficulty = 'beginner') {
    const container = document.getElementById('tasks-container'); // id из вашего HTML
    container.innerHTML = 'Загрузка задач...';

    try {
        const res = await fetch(`/api/problems?difficulty=${difficulty}`);

        if (!res.ok) {
            throw new Error(`Ошибка сервера: ${res.status}`);
        }

        const tasks = await res.json();
        console.log('tasks:', tasks);

        if (!Array.isArray(tasks)) {
            throw new Error('Ответ не массив');
        }

        container.innerHTML = tasks.map(task => `
            <div class="task" id="task-${task.id}">
                <div class="difficulty ${task.difficulty}">
                    ${getDifficultyLabel(task.difficulty)}
                </div>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <pre>${task.templateCode.replace(/\\n/g, '\n')}</pre>
                <textarea id="code-${task.id}" class="code-editor">${task.templateCode}</textarea>
                <button onclick="checkSolution(${task.id})">Проверить решение</button>
                <div id="result-${task.id}" class="result"></div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = `Ошибка загрузки задач: ${err.message}`;
        console.error(err);
    }
}

function getDifficultyLabel(difficulty) {
    const labels = {
        beginner: 'Начинающий',
        intermediate: 'Средний',
        expert: 'Эксперт'
    };
    return labels[difficulty] || 'Неизвестно';
}

async function checkSolution(taskId) {
    const code = document.getElementById(`code-${taskId}`).value;
    const resultDiv = document.getElementById(`result-${taskId}`);
    resultDiv.innerHTML = 'Проверяем...';

    try {
        const res = await fetch('/api/check-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ problemId: taskId, code })
        });

        if (!res.ok) {
            throw new Error(`Ошибка сервера: ${res.status}`);
        }

        const result = await res.json();
        showResults(taskId, result);
    } catch (err) {
        resultDiv.innerHTML = `Ошибка: ${err.message}`;
    }
}

function showResults(taskId, result) {
    const resultDiv = document.getElementById(`result-${taskId}`);

    let html = `<div class="test-summary">
        ${result.allCorrect ? '✅ Все тесты пройдены!' : `❌ Пройдено ${result.passedTests} из ${result.totalTests} тестов`}
    </div>`;

    html += '<div class="test-results">';
    result.results.forEach((test, i) => {
        html += `
            <div class="test-case ${test.passed ? 'passed' : 'failed'}">
                <strong>Тест ${i + 1}:</strong> ${test.passed ? '✅' : '❌'}
                <div>Ввод: ${JSON.stringify(test.input)}</div>
                ${!test.passed ? `
                    <div>Ожидалось: ${JSON.stringify(test.expected)}</div>
                    <div>Получено: ${JSON.stringify(test.actual)}</div>
                    ${test.error ? `<div class="error">Ошибка: ${test.error}</div>` : ''}
                ` : ''}
            </div>
        `;
    });
    html += '</div>';

    resultDiv.innerHTML = html;
}

// Загрузка задач по умолчанию — начинающий
window.onload = () => loadTasks('beginner');
