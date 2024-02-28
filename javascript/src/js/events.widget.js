class EventWidget extends Widget {

  constructor(settings) {
  	super(settings);
    this.eventList = settings.eventList;
    this.eventText = settings.eventText;
    this.eventDate = settings.eventDate;
    this.eventTime = settings.eventTime;
    this.addButton = settings.addButton;
    this.deleteButton = settings.deleteButton;
  }

  setUpHandlers() {
    let self = this;

    this.getEvents().then( (res) => {
      self.renderEvents(res.json);
      self.events.addEvent(self.addButton, 'click', () => {
        self.addEvent().then( () => {
          self.clearFields();
          self.getEvents().then( (res) => {
            self.renderEvents(res.json);
          });
        });
      });
      self.events.addEvent(self.deleteButton, 'click', () => {
        let events = self.listEvents();
        self.deleteEvents(events.filter( (event) => {
          return event.state;
        })).then( () => {
          self.getEvents().then( (res) => {
            self.renderEvents(res.json);
          });
        });
      });
    });

    let dtString = new Date().toISOString();
    this.eventDate.min = dtString.split('T')[0];
  }

  listEvents() {
    return Array.from(this.eventList.getElementsByTagName("li")).map( (el) => {
      let inp = Array.from(el.getElementsByTagName('input'))[0];
      return {
        id: el.getAttribute('data-id'),
        text: el.innerText.trim(),
        state: inp !== undefined ? inp.checked : false
      }
    });
  }

  async getEvents() {
    return await this.client.getJson('/events/');
  }

  async addEvent() {
    let payload = {
      text: this.eventText.value,
      datetime: this.eventDate.value + 'T' + this.eventTime.value
    }
    return await this.client.postJson('/events/', payload);
  }

  async deleteEvents(events) {
    let result = [];
    for (let i =0; i<events.length; i++) {
      let event = events[i];
      result.push(await this.client.deleteJson('/events/' + event.id));
    }
    return result;
  }

  renderEvents(events) {
    let html = events.map(function (event) {
      let dt = new Date(event.datetime);
      return '<li' + (event.id ? ' data-id="' + event.id + '"': '') + '>' + (event.id ? '<input type="checkbox"> ' : '  ') + 
      dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString() + ': ' + event.text + '</li>';
    }).join("");
    this.eventList.innerHTML = html;
  }

  clearFields() {
    this.eventText.value = '';
    this.eventDate.value = '';
    this.eventTime.value = '';
  }

}
