import {
  advanceTask,
  addTask,
  countByStatus,
  deleteTask,
  filterByStatus,
  type Task,
  type TaskStatus,
} from "./model.js";

type TaskFilter = "all" | TaskStatus;

let tasks: Task[] = [];
let filter: "all" | TaskStatus = "all";

const titleInput: HTMLInputElement = document.getElementById(
  "title",
) as HTMLInputElement;
const statusSelect: HTMLSelectElement = document.getElementById(
  "status",
) as HTMLSelectElement;
const addButton: HTMLButtonElement = document.getElementById(
  "add",
) as HTMLButtonElement;
const taskList: HTMLUListElement = document.getElementById(
  "list",
) as HTMLUListElement;
const filterChips: HTMLDivElement = document.getElementById(
  "chips",
) as HTMLDivElement;

// Adds a trimmed title with the selected starting status.
function addCurrentTask(): void {
  const title: string = titleInput.value.trim();
  if (title.length === 0) {
    return;
  }

  const selectedStatus: string = statusSelect.value;
  if (
    selectedStatus !== "todo" &&
    selectedStatus !== "in-progress" &&
    selectedStatus !== "done"
  ) {
    return;
  }

  tasks = addTask(tasks, title);
  const newTask: Task = tasks[tasks.length - 1];
  if (selectedStatus !== "todo") {
    tasks = tasks.map((task: Task): Task =>
      task.id === newTask.id ? { ...task, status: selectedStatus } : task,
    );
  }

  titleInput.value = "";
  render();
}

// Updates the active task filter and refreshes the list.
function setFilter(nextFilter: "all" | TaskStatus): void {
  filter = nextFilter;
  render();
}

// Returns the human-readable label for a filter chip.
function filterLabel(taskFilter: TaskFilter): string {
  if (taskFilter === "all") {
    return `All (${tasks.length})`;
  }

  const label: string =
    taskFilter === "in-progress" ? "In progress" : taskFilter;
  return `${label} (${countByStatus(tasks, taskFilter)})`;
}

// Creates a filter control with its current count.
function createFilterChip(taskFilter: TaskFilter): HTMLButtonElement {
  const chip: HTMLButtonElement = document.createElement("button");
  chip.type = "button";
  chip.className =
    taskFilter === filter ? "filter-chip active" : "filter-chip";
  chip.textContent = filterLabel(taskFilter);
  chip.setAttribute("aria-pressed", String(taskFilter === filter));
  chip.addEventListener("click", (): void => {
    setFilter(taskFilter);
  });
  return chip;
}

// Creates a task row using text nodes for all user-provided content.
function createTaskRow(task: Task): HTMLLIElement {
  const row: HTMLLIElement = document.createElement("li");
  row.className = "task";

  const title: HTMLSpanElement = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;

  const badge: HTMLSpanElement = document.createElement("span");
  badge.className = `status-badge status-${task.status}`;
  badge.textContent =
    task.status === "in-progress"
      ? "In progress"
      : task.status === "todo"
        ? "To do"
        : "Done";

  const advanceButton: HTMLButtonElement = document.createElement("button");
  advanceButton.type = "button";
  advanceButton.className = "row-button";
  advanceButton.textContent = "Advance";
  advanceButton.disabled = task.status === "done";
  advanceButton.addEventListener("click", (): void => {
    tasks = advanceTask(tasks, task.id);
    render();
  });

  const removeButton: HTMLButtonElement = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "row-button delete-button";
  removeButton.textContent = "Delete";
  removeButton.addEventListener("click", (): void => {
    tasks = deleteTask(tasks, task.id);
    render();
  });

  row.append(title, badge, advanceButton, removeButton);
  return row;
}

// Renders the filter counts and visible task rows.
function render(): void {
  filterChips.replaceChildren();
  const filters: TaskFilter[] = ["all", "todo", "in-progress", "done"];
  filters.forEach((taskFilter: TaskFilter): void => {
    filterChips.append(createFilterChip(taskFilter));
  });

  taskList.replaceChildren();
  const visibleTasks: Task[] =
    filter === "all" ? tasks : filterByStatus(tasks, filter);
  if (visibleTasks.length === 0) {
    const emptyState: HTMLLIElement = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent =
      tasks.length === 0 ? "Your list is clear. Add a task to begin." : "No tasks here yet.";
    taskList.append(emptyState);
    return;
  }

  visibleTasks.forEach((task: Task): void => {
    taskList.append(createTaskRow(task));
  });
}

addButton.addEventListener("click", addCurrentTask);
titleInput.addEventListener("keydown", (event: KeyboardEvent): void => {
  if (event.key === "Enter") {
    addCurrentTask();
  }
});

render();
