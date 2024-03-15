import WidgetRenderer from './widget.js';


class Renderer extends WidgetRenderer {

  async renderElement() {
    return await this.getUsers();
  }

  async getUsers() {
    const response = await this.client.getJson('/users/');
    return response.json;
  }

  async getUser(username) {
    const response = await this.client.getJson('/users/' + username);
    return response.json;
  }

  async createUser(payload) {
    return await this.client.postJson('/users/', payload);
  }

  async updateUser(username, payload) {
    return await this.client.putJson('/users/' + username, payload);
  }

  async deleteUser(username) {
    const response = await this.client.deleteJson('/users/' + username);
    return response.json;
  }

}

const UserRenderer = (client) => {
  return new Renderer({
    client: client,
    container: document.getElementById('user-widget'),
    widgetId: 'users',
    defaultValue: []
  });
}

export default UserRenderer;