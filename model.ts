export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

// Returns a new list with a uniquely numbered task in the todo status.
export function addTask(tasks: Task[], title: string): Task[] {
  const nextId: number =
    tasks.length === 0
      ? 1
      : tasks.reduce(
          (maxId: number, task: Task): number => Math.max(maxId, task.id),
          tasks[0].id,
        ) + 1;

  return [...tasks, { id: nextId, title, status: "todo" }];
}

// Returns a new list with the matching task marked done.
export function completeTask(tasks: Task[], id: number): Task[] {
  return tasks.map((task: Task): Task =>
    task.id === id ? { ...task, status: "done" } : task,
  );
}

// Returns a new list containing only tasks with the requested status.
export function filterByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((task: Task): boolean => task.status === status);
}

// Advances a task from todo to in-progress to done; done tasks stay done.
export function advanceTask(tasks: Task[], id: number): Task[] {
  return tasks.map((task: Task): Task => {
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
export function countByStatus(tasks: Task[], status: TaskStatus): number {
  return tasks.filter((task: Task): boolean => task.status === status).length;
}

let demoTasks: Task[] = [];
demoTasks = addTask(demoTasks, "Write typed task logic");
demoTasks = addTask(demoTasks, "Check task status");
demoTasks = completeTask(demoTasks, 1);
console.log("Tasks:", demoTasks);
console.log('Todo tasks:', filterByStatus(demoTasks, "todo"));

// Uncomment these lines to verify that TypeScript catches each type error:
// const missingStatus: Task = { id: 3, title: "Missing status" };
//const stringId: Task = { id: "3", title: "String id", status: "todo" };
//filterByStatus(demoTasks, "finished");