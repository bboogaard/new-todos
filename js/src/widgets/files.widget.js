import WidgetRenderer from './widget.js';


class Renderer extends WidgetRenderer {

  async renderElement() {
    return await this.getFiles();
  }

  async getFiles() {
    const response = await this.client.getJson('/files/');
    return response.json;
  }

  async saveFile(data) {
    return await this.client.post('/files/', data);
  }

  downloadFile(file_id) {
    this.client.download('/files/' + file_id).then( (res) => {
      window.open(URL.createObjectURL(res));
    });
  }

  async deleteFiles(file_ids) {
    let result = [];
    for (const file_id of file_ids) {
      result.push(await this.client.deleteJson('/files/' + file_id));
    }
    return Promise.all(result);
  }

}

const FileRenderer = (client) => {
  return new Renderer({
    client: client,
    container: document.getElementById('file-widget'),
    widgetId: 'files',
    defaultValue: []
  });
}

export default FileRenderer;