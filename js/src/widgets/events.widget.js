import WidgetRenderer from './widget.js';


class Renderer extends WidgetRenderer {

  async renderElement() {
    const events = await this.getEvents();
    return events.map( (event) => {
      const dt = new Date(event.datetime);
      event.datetimeHuman = dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString(); 
      return event;
    });
  }

  async getEvents() {
    const response = await this.client.getJson('/events/');
    return response.json;
  }

  async getEvent(event_id) {
    const response = await this.client.getJson('/events/' + event_id);
    return response.json;
  }

  async createEvent(payload) {
    return await this.client.postJson('/events/', payload);
  }

  async updateEvent(event_id, payload) {
    return await this.client.putJson('/events/' + event_id, payload);
  }

  async deleteEvent(event_id) {
    const response = await this.client.deleteJson('/events/' + event_id);
    return response.json;
  }

}

const EventRenderer = (client) => {
  return new Renderer({
    client: client,
    container: document.getElementById('event-widget'),
    widgetId: 'events',
    defaultValue: []
  });
}

export default EventRenderer;