class TodoWidget extends Widget {

  constructor(settings) {
  	super(settings);
    this.todoList = settings.todoList;
    this.saveButton = settings.saveButton;
    this.deleteButton = settings.deleteButton;
  }

  setUpHandlers() {
    let self = this;

    this.getItems().then( (res) => {
      self.renderItems(res.json);
      self.events.addEvent(self.saveButton, 'click', () => {
        let items = self.listItems();
        self.saveItems(items).then( () => {
          self.getItems().then( (res) => {
            self.renderItems(res.json);
          });
        });
      });
      self.events.addEvent(self.deleteButton, 'click', () => {
        let items = self.listItems();
        self.deleteItems(items.filter( (item) => {
          return item.state;
        })).then( () => {
          self.getItems().then( (res) => {
            self.renderItems(res.json);
          });
        });
      });
    });
  }

  listItems() {
    return Array.from(this.todoList.getElementsByTagName("li")).map( (el) => {
      let inp = Array.from(el.getElementsByTagName('input'))[0];
      return {
        id: el.getAttribute('data-id'),
        text: el.innerText.trim(),
        state: inp !== undefined ? inp.checked : false
      }
    });
  }

  async getItems() {
    return await this.client.getJson('/todos/');
  }

  async saveItems(items) {
    let result = [];
    for (let i =0; i<items.length; i++) {
      let item = items[i];
      let payload = {
        text: item.text
      }
      if (item.id) {
        result.push(await this.client.putJson('/todos/' + item.id, payload));
      }
      else {
        result.push(await this.client.postJson('/todos/', payload));  
      }
    }
    return result;
  }

  async deleteItems(items) {
    let result = [];
    for (let i =0; i<items.length; i++) {
      let item = items[i];
      result.push(await this.client.deleteJson('/todos/' + item.id));
    }
    return result;
  }

  renderItems(items) {
    items.push({
      id: '',
      text: 'Enter item'
    });
    let html = items.map(function (item) {
      return '<li' + (item.id ? ' data-id="' + item.id + '"': '') + '>' + (item.id ? '<input type="checkbox"> ' : '  ') + item.text + '</li>';
    }).join("");
    this.todoList.innerHTML = html;
  }

}
