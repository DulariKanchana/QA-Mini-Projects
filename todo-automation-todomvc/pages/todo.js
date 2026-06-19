export class TodoAppAutomation {

    constructor(page) {
        this.page = page;
        this.textInput = page.getByTestId('text-input');
        this.todoItem = page.getByTestId('todo-item-label');
        this.clearCompleted = page.getByRole('button', { name: 'Clear completed' });
        this.todoCount = page.locator('.todo-count');
        
    };

    async gotoTodoMVC() {
        await this.page.goto('https://todomvc.com/examples/react/dist/');
    }

    async addTodoTask(input) {
        await this.textInput.fill(input);
        await this.textInput.press('Enter');
    }

    async addTodoTasks(tasks) {
        for (const task of tasks) {
            await this.textInput.fill(task);
            await this.textInput.press('Enter');
        }
    }

    async completeTodoTask(task) {
        await this.getTodoListItem(task).getByTestId('todo-item-toggle').check();
    }

    async completeTodoTasks(tasks) {
        for (const task of tasks) {
            await this.getTodoListItem(task).getByTestId('todo-item-toggle').check();
        }
    }

    async filterCompletedTasks() {
        await this.page.getByRole('link', { name: 'Completed' }).click();
    }

    async filterActiveTasks() {
        await this.page.getByRole('link', { name: 'Active' }).click();
    }

    async filterAllTasks() {
        await this.page.getByRole('link', { name: 'All' }).click();
    }

    async markTaskIncomplete(task) {
        await this.getTodoListItem(task).getByTestId('todo-item-toggle').uncheck();
    }

    async deleteTodoTask(task) {
        await this.getTodoListItem(task).hover();
        await this.getTodoListItem(task).getByRole('button', { name: 'Delete todo' }).click();
    }

    getTodoListItem(task) {
        return this.page.getByRole('listitem').filter({ hasText: task });
    }

}
