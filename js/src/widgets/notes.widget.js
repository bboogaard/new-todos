import WidgetRenderer from './widget.js';


class Renderer extends WidgetRenderer {

  async renderElement() {
    const notes = await this.getNotes();
    return notes.text;
  }

  async getNotes() {
    const response = await this.client.getJson('/notes/');
    return response.json;
  }

  async saveNotes(payload) {
    return await this.client.postJson('/notes/', payload);
  }

}

const NoteRenderer = (client) => {
  return new Renderer({
    client: client,
    container: document.getElementById('note-widget'),
    widgetId: 'notes',
    defaultValue: ''
  });
}

export default NoteRenderer;
