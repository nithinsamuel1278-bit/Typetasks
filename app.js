import { advanceTask, addTask, countByStatus, deleteTask, filterByStatus, } from "./model.js";
let tasks = [];
let filter = "all";
const titleInput = document.getElementById("title");
const statusSelect = document.getElementById("status");
const addButton = document.getElementById("add");
const taskList = document.getElementById("list");
const filterChips = document.getElementById("chips");
// Adds a trimmed title with the selected starting status.
function addCurrentTask() {
    const title = titleInput.value.trim();
    if (title.length === 0) {
        return;
    }
    const selectedStatus = statusSelect.value;
    if (selectedStatus !== "todo" &&
        selectedStatus !== "in-progress" &&
        selectedStatus !== "done") {
        return;
    }
    tasks = addTask(tasks, title);
    const newTask = tasks[tasks.length - 1];
    if (selectedStatus !== "todo") {
        tasks = tasks.map((task) => task.id === newTask.id ? { ...task, status: selectedStatus } : task);
    }
    titleInput.value = "";
    render();
}
// Updates the active task filter and refreshes the list.
function setFilter(nextFilter) {
    filter = nextFilter;
    render();
}
// Returns the human-readable label for a filter chip.
function filterLabel(taskFilter) {
    if (taskFilter === "all") {
        return `All (${tasks.length})`;
    }
    const label = taskFilter === "in-progress" ? "In progress" : taskFilter;
    return `${label} (${countByStatus(tasks, taskFilter)})`;
}
// Creates a filter control with its current count.
function createFilterChip(taskFilter) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className =
        taskFilter === filter ? "filter-chip active" : "filter-chip";
    chip.textContent = filterLabel(taskFilter);
    chip.setAttribute("aria-pressed", String(taskFilter === filter));
    chip.addEventListener("click", () => {
        setFilter(taskFilter);
    });
    return chip;
}
// Creates a task row using text nodes for all user-provided content.
function createTaskRow(task) {
    const row = document.createElement("li");
    row.className = "task";
    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;
    const badge = document.createElement("span");
    badge.className = `status-badge status-${task.status}`;
    badge.textContent =
        task.status === "in-progress"
            ? "In progress"
            : task.status === "todo"
                ? "To do"
                : "Done";
    const advanceButton = document.createElement("button");
    advanceButton.type = "button";
    advanceButton.className = "row-button";
    advanceButton.textContent = "Advance";
    advanceButton.disabled = task.status === "done";
    advanceButton.addEventListener("click", () => {
        tasks = advanceTask(tasks, task.id);
        render();
    });
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "row-button delete-button";
    removeButton.textContent = "Delete";
    removeButton.addEventListener("click", () => {
        tasks = deleteTask(tasks, task.id);
        render();
    });
    row.append(title, badge, advanceButton, removeButton);
    return row;
}
// Renders the filter counts and visible task rows.
function render() {
    filterChips.replaceChildren();
    const filters = ["all", "todo", "in-progress", "done"];
    filters.forEach((taskFilter) => {
        filterChips.append(createFilterChip(taskFilter));
    });
    taskList.replaceChildren();
    const visibleTasks = filter === "all" ? tasks : filterByStatus(tasks, filter);
    if (visibleTasks.length === 0) {
        const emptyState = document.createElement("li");
        emptyState.className = "empty-state";
        emptyState.textContent =
            tasks.length === 0 ? "Your list is clear. Add a task to begin." : "No tasks here yet.";
        taskList.append(emptyState);
        return;
    }
    visibleTasks.forEach((task) => {
        taskList.append(createTaskRow(task));
    });
}
addButton.addEventListener("click", addCurrentTask);
titleInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addCurrentTask();
    }
});
render();
