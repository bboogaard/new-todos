import WidgetRenderer from './widget.js';


class Renderer extends WidgetRenderer {

  async renderElement() {
    const todos = await this.getTodos();
    return todos;
  }
  
  async getTodos() {
  	const response = await this.client.getJson('/todos/');
  	return response.json;
  }

  async getTodo(todo_id) {
    const response = await this.client.getJson('/todos/' + todo_id);
    return response.json;
  }

  async createTodo(payload) {
  	const response = await this.client.postJson('/todos/', payload);
  	return response.json;
  }

  async deleteTodo(todo_id) {
  	const response = await this.client.deleteJson('/todos/' + todo_id);
  	return response.json;
  }

}

const TodoRenderer = (client) => {
  return new Renderer({
    client: client,
    container: document.getElementById('todo-widget'),
    widgetId: 'todos',
    defaultValue: []
  });
}

export default TodoRenderer;
