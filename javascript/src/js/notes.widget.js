class NoteWidget extends Widget {

  constructor(settings) {
  	super(settings);
    this.notesField = settings.notesField;
    this.saveButton = settings.saveButton;
  }

  setUpHandlers() {
  	let self = this;

  	this.getNotes().then( (res) => {
  		self.renderNotes(res.json.text);
  	  self.events.addEvent(self.saveButton, 'click', () => {
  	  	self.saveNotes().then( () => {
  	  		self.getNotes().then( (res) => {
  	  			self.renderNotes(res.json.text);
  	  		});
  	  	});
  	  });
  	});
  }

  async getNotes() {
    return await this.client.getJson('/notes/');
  }

  async saveNotes() {
  	let payload = {
  	  text: this.getContent()
  	} 
    return await this.client.postJson('/notes/', payload);
  }

  renderNotes(notes) {
  	let self = this;

  	if (notes === undefined) {
  		return;
  	}
  	setTimeout( () => {
  		let html = '<input id="notes-content" value="' + notes + '" type="hidden" name="content">' +
  	             '<trix-editor id="notes-editor" input="notes-content"></trix-editor>';
  	  self.notesField.innerHTML = html;
  	}, 300);
  }

  getContent() {
  	return document.getElementById('notes-content').value;
  }

}