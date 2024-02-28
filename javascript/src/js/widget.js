class Widget {

  constructor(settings) {
  	this.client = settings.client;
  	this.router = settings.router;
    this.events = settings.events;
  	this.container = settings.container;
  }

  setUpHandlers() {

  }

  show() {
    this.container.style.display = "block";
  }

  hide() {
  	this.container.style.display = "none";
  }

}
