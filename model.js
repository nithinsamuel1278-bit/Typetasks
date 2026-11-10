// Returns a new list with a uniquely numbered task in the todo status.
export function addTask(tasks, title) {
    const nextId = tasks.length === 0
        ? 1
        : tasks.reduce((maxId, task) => Math.max(maxId, task.id), tasks[0].id) + 1;
    return [...tasks, { id: nextId, title, status: "todo" }];
}
// Returns a new list with the matching task marked done.
export function completeTask(tasks, id) {
    return tasks.map((task) => task.id === id ? { ...task, status: "done" } : task);
}
// Returns a new list containing only tasks with the requested status.
export function filterByStatus(tasks, status) {
    return tasks.filter((task) => task.status === status);
}
// Advances a task from todo to in-progress to done; done tasks stay done.
export function advanceTask(tasks, id) {
    return tasks.map((task) => {
        if (task.id !== id || task.status === "done") {
            return task;
        }
        return {
            ...task,
            status: task.status === "todo" ? "in-progress" : "done",
        };
    });
}
// Counts tasks with the requested status.
export function countByStatus(tasks, status) {
    return tasks.filter((task) => task.status === status).length;
}
// Returns a new list without the task matching the provided id.
export function deleteTask(tasks, id) {
    return tasks.filter((task) => task.id !== id);
}
// Uncomment these lines to verify that TypeScript catches each type error:
// const missingStatus: Task = { id: 3, title: "Missing status" };
//const stringId: Task = { id: "3", title: "String id", status: "todo" };
//filterByStatus([], "finished");
