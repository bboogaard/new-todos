class Todos {

  constructor(settings) {
    this.client = settings.client;
    this.router = settings.router;
    this.userInfo = settings.userInfo;
    this.loginWidget = settings.loginWidget;
    this.widgets = settings.widgets;
  }

  init() {
    this.setUpRoutes();
    this.router.resolve();
  }

  setUpRoutes() {
    let self = this;

    this.router.on('/login', () => {
      self.login();
    });
    this.router.on('/', () => {
      self.index();
    });
  }

  login() {
    this.userInfo.innerHTML = "";
    this.loginWidget.setUpHandlers();
    this.loginWidget.show();
    for (let widget of this.widgets) {
      widget.hide();
    }
  }

  index() {
    let self = this;

    if (!this.client.isAuthenticated()) {
      this.router.navigate('/login');
      return;
    }

    this.userInfo.innerHTML = "Welcome, " + this.client.username; 
    this.loginWidget.hide();
    for (let widget of this.widgets) {
      widget.setUpHandlers();
      widget.show();
    }
  }

}
