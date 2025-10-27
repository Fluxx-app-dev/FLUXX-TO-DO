document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const quoteText = document.getElementById('quote-text');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    const quotes = [
        "The only way to do great work is to love what you do. – Steve Jobs",
        "Believe you can and you're halfway there. – Theodore Roosevelt",
        "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
        "You miss 100% of the shots you don't take. – Wayne Gretzky",
        "Keep going. Everything you need will come to you at the perfect time."
    ];

    // Load tasks and display initial quote
    loadTasks();
    displayRandomQuote();

    // Event listeners
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    newQuoteBtn.addEventListener('click', displayRandomQuote);
    filterBtns.forEach(btn => btn.addEventListener('click', filterTasks));

    function addTask() {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;
        if (taskText === '') return;

        const taskItem = createTaskElement(taskText, false, priority);
        taskList.appendChild(taskItem);
        saveTasks();
        updateProgress();
        taskInput.value = '';
    }

    function createTaskElement(text, completed, priority) {
        const li = document.createElement('li');
        li.className = 'task-item ${priority}';
        if (completed) li.classList.add('completed');

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = text;
        span.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks();
            updateProgress();
        });

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editTask(li, span));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(li);
            saveTasks();
            updateProgress();
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(actions);
        return li;
    }

    function editTask(li, span) {
        const input = document.createElement('input');
        input.className = 'edit-input';
        input.value = span.textContent;
        li.replaceChild(input, span);

        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn';
        saveBtn.textContent = 'Save';
        saveBtn.addEventListener('click', () => {
            span.textContent = input.value.trim() || span.textContent;
            li.replaceChild(span, input);
            li.removeChild(saveBtn);
            saveTasks();
        });

        li.appendChild(saveBtn);
    }

    function filterTasks(e) {
        const filter = e.target.id.split('-')[1];
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        document.querySelectorAll('.task-item').forEach(item => {
            const isCompleted = item.classList.contains('completed');
            if (filter === 'all' || (filter === 'pending' && !isCompleted) || (filter === 'completed' && isCompleted)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function updateProgress() {
        const total = document.querySelectorAll('.task-item').length;
        const completed = document.querySelectorAll('.task-item.completed').length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        progressFill.style.width = '${percentage}%;'
        progressText.textContent = '${percentage}% Complete';
    }

    function displayRandomQuote() {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteText.textContent = randomQuote;
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(item => {
            tasks.push({
                text: item.querySelector('.task-text').textContent,
                completed: item.classList.contains('completed'),
                priority: item.classList[1] // Assumes class order: task-item priority
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = createTaskElement(task.text, task.completed, task.priority);
            taskList.appendChild(taskItem);
        });
        updateProgress();
    }
});