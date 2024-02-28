class FileWidget extends Widget {

  constructor(settings) {
  	super(settings);
    this.fileList = settings.fileList;
    this.saveButton = settings.saveButton;
    this.deleteButton = settings.deleteButton;
    this.uploadForm = settings.uploadForm;
  }

  setUpHandlers() {
    let self = this;

    this.getFiles().then( (res) => {
      self.renderFiles(res.json);
      self.events.addEvent(self.saveButton, 'click', () => {
        let data = new FormData(self.uploadForm);
        self.saveFile(data).then( (res) => {
          self.getFiles().then( (res) => {
            self.renderFiles(res.json);
          });
        });
      });
      self.events.addEvent(self.deleteButton, 'click', () => {
        let files = self.listFiles();
        self.deleteFiles(files.filter( (file) => {
          return file.state;
        })).then( () => {
          self.getFiles().then( (res) => {
            self.renderFiles(res.json);
          });
        });
      });
    });

  }

  listFiles() {
    return Array.from(this.fileList.getElementsByTagName("li")).map( (el) => {
      let inp = Array.from(el.getElementsByTagName('input'))[0];
      return {
        id: el.getAttribute('data-id'),
        state: inp !== undefined ? inp.checked : false
      }
    });
  }

  async getFiles() {
    return await this.client.getJson('/files/');
  }

  async saveFile(data) {
    return await this.client.post('/files/', data);
  }

  async deleteFiles(files) {
    let result = [];
    for (let i =0; i<files.length; i++) {
      let file = files[i];
      result.push(await this.client.deleteJson('/files/' + file.id));
    }
    return result;
  }

  renderFiles(files) {
    let self = this;

    let html = files.map(function (file) {
      let link = '<a href="" target="_blank">' + file.filename + '</a>';
      return '<li' + (file.id ? ' data-id="' + file.id + '"': '') + '>' + (file.id ? '<input type="checkbox"> ' : '  ') + link + '</li>';
    }).join("");
    this.fileList.innerHTML = html;
    Array.from(this.fileList.getElementsByTagName("li")).forEach( (el) => {
      let file_id = el.getAttribute('data-id');
      let link = el.getElementsByTagName('a')[0];
      self.events.addEvent(link, 'click', () => {
        self.client.download('/files/' + file_id).then( (res) => {
          window.open(URL.createObjectURL(res));
        });
      });
    });
  }

}
