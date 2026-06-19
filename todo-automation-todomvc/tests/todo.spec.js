import { test, expect } from '@playwright/test';
import { TodoAppAutomation } from '../pages/todo';
import testData from '../test-data/testData.json';

test.describe('TodoMVC Automation', () => {

  /** @type {TodoAppAutomation} */
  let todo;

  test.beforeEach(async ({page}) => {
    todo = new TodoAppAutomation(page);
    await todo.gotoTodoMVC();
  });

  //'add a todo task and check whether it's visible
  test('Add a todo task and verify it appears @TC-01', async() => {

    await todo.addTodoTask(testData.twoTasks[1]);
    await expect(todo.todoItem.filter({ hasText: testData.twoTasks[1]})).toBeVisible();
    await expect(todo.todoItem).toHaveCount(1);

  });

  //'add multiple todo tasks and check whether they are visible
  test('Add multiple todo tasks @TC-02', async() => {
    
    await todo.addTodoTasks(testData.multipleTasks);
    await expect(todo.todoItem).toHaveCount(5);
    await expect(todo.todoItem).toContainText(testData.multipleTasks);
    
  });

  test('Mark the task as completed @TC-03', async() => {

    //add two todo tasks and mark them as completed
    await todo.addTodoTasks(testData.twoTasks);
    await todo.completeTodoTask(testData.twoTasks[0]);

    //navigate to completed section and check completed task is visible
    await todo.filterCompletedTasks();
    await expect(todo.todoItem).toHaveCount(1);
    await expect(todo.todoItem.filter({hasText: testData.twoTasks[0]})).toBeVisible();

    //navigate to active section and check active task is visible
    await todo.filterActiveTasks();
    await expect(todo.todoItem).toHaveCount(1);
    await expect(todo.todoItem.filter({hasText: testData.twoTasks[1]})).toBeVisible();


  });

  test('Unmark the completed task  @TC-04', async() => {

    //add todo tasks and check whether they are added 
    await todo.addTodoTasks(testData.twoTasks);
    await expect(todo.todoItem).toContainText(testData.twoTasks);
    
    //check added task as completed and check whether it available in completed section
    await todo.completeTodoTask(testData.twoTasks[1]);
    await todo.filterCompletedTasks();
    await expect(todo.todoItem.filter({ hasText: testData.twoTasks[1]})).toBeVisible();

    //navigate to all section and check completed task visible 
    await todo.filterAllTasks();
    await expect(todo.todoItem.filter({ hasText: testData.twoTasks[1]})).toBeVisible();

    //unmark the completed todo and check whether it's available in active section again
    await todo.markTaskIncomplete(testData.twoTasks[1]);
    await todo.filterActiveTasks();
    await expect(todo.todoItem).toHaveCount(2);
    await expect(todo.todoItem.filter({hasText: testData.twoTasks[1]})).toBeVisible();

  });

  test('Filter active todo tasks @TC-05', async() => {
      
    //add todo tasks and check whether they are added 
    await todo.addTodoTasks(testData.multipleTasks);
    await expect(todo.todoItem).toHaveCount(5);

    //mark 3 tasks as completed
    await todo.completeTodoTasks(testData.tasksToComplete);

    //navigate to active section and check if active tasks visible 
    await todo.filterActiveTasks();
    await expect(todo.todoItem).toHaveCount(2);
    await expect(todo.todoItem.filter({hasText: testData.twoTasks[0]})).toBeVisible();
    await expect(todo.todoItem.filter({hasText: testData.twoTasks[1]})).toBeVisible();

    await expect(todo.todoItem.filter({hasText: testData.tasksToComplete[0]})).not.toBeAttached();
    await expect(todo.todoItem.filter({hasText: testData.tasksToComplete[1]})).not.toBeAttached();
    await expect(todo.todoItem.filter({hasText: testData.tasksToComplete[2]})).not.toBeAttached();
  });

  
  test('Filter completed todo tasks @TC-06', async() => {
    
    //add todo tasks and check whether they are added 
    await todo.addTodoTasks(testData.multipleTasks);
    await expect(todo.todoItem).toHaveCount(5);

    //mark 3 tasks as completed
    await todo.completeTodoTasks(testData.tasksToComplete);

    //navigate to completed section and check if completed tasks visible 
    await todo.filterCompletedTasks();
    await expect(todo.todoItem).toHaveCount(3);
    await expect(todo.todoItem.filter({ hasText: testData.tasksToComplete[0]})).toBeVisible();
    await expect(todo.todoItem.filter({ hasText: testData.tasksToComplete[1]})).toBeVisible();
    await expect(todo.todoItem.filter({ hasText: testData.tasksToComplete[2]})).toBeVisible();

    await expect(todo.todoItem.filter({ hasText: testData.twoTasks[0]})).not.toBeAttached();
    await expect(todo.todoItem.filter({ hasText: testData.twoTasks[1]})).not.toBeAttached();
  });

  
  test('Add empty todo task @TC-07', async() => {
    await todo.addTodoTask('');
    await expect(todo.todoItem).toHaveCount(0);
    await expect(todo.textInput).toBeEmpty()
  });

  
  test('Clear all completed tasks @TC-08', async() => {

    await todo.addTodoTasks(testData.multipleTasks);

    //check if tasks added 
    await expect(todo.todoItem).toHaveCount(5);
    await todo.completeTodoTasks(testData.tasksToComplete);
    await todo.filterCompletedTasks();

    //check whether 3 completed tasks exist in completed section
    await expect(todo.todoItem).toHaveCount(3);

    //check whether clear completed button visible
    await expect(todo.clearCompleted).toBeVisible();

    //clear completed tasks and check their existance 
    await todo.clearCompleted.click();
    await expect(todo.todoItem).toHaveCount(0);
    
    //navigate to active section and check if 2 active tasks still available
    await todo.filterActiveTasks();
    await expect(todo.todoItem).toHaveCount(2);
  });
  
  
  test('Delete a todo task @TC-09', async() => {

    //add todo tasks and check whether they added
    await todo.addTodoTasks(testData.twoTasks);
    await expect(todo.todoItem).toHaveCount(2);

    //delete one task and check it's existance
    await todo.deleteTodoTask(testData.twoTasks[0]);
    await expect(todo.todoItem).toHaveCount(1);
    await expect(todo.todoItem.filter({ hasText: testData.twoTasks[0]})).toHaveCount(0);

    //check active task's visibility
    await expect(todo.todoItem.filter({ hasText: testData.twoTasks[1]})).toBeVisible();

  });

  test('Todo tasks count updates correctly @TC-10', async() => {

    //add todo tasks one by one and check if they added 
    await todo.addTodoTask(testData.twoTasks[0]);
    await expect(todo.todoCount).toContainText('1 item left!');
    await todo.addTodoTask(testData.twoTasks[1]);
    await expect(todo.todoCount).toContainText('2 items left!');

    //complete one task and check todo item count 
    await todo.completeTodoTask(testData.twoTasks[0]);
    await expect(todo.todoCount).toContainText('1 item left!');

    //unmark completed todo and check todo item count
    await todo.markTaskIncomplete(testData.twoTasks[0]);
    await expect(todo.todoCount).toContainText('2 items left!');

    //delete one task and check todo item count
    await todo.deleteTodoTask(testData.twoTasks[1]);
    await expect(todo.todoCount).toContainText('1 item left!');

  });

});