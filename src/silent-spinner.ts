export class SilentSpinner {
  constructor(protected readonly tasks: Task[]) {}

  add(task: Task) {
    this.tasks.push(task);
  }

  async run(ctx: object = {}) {
    for (const task of this.tasks) {
      if (task.skip) {
        if (task.skip === true) continue;
        if (await task.skip(ctx)) continue;
      }
      await task.task(ctx, { title: task.title });
    }
  }
}

interface Task {
  title: string;
  skip?: boolean | ((ctx: object) => boolean | Promise<boolean>);
  task: (ctx: object, task: { title: string }) => Promise<any>;
}
