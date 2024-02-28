class LoginWidget extends Widget {

  constructor(settings) {
  	super(settings);
    this.loginForm = settings.loginForm;
    this.loginButton = settings.loginButton;
  }

  setUpHandlers() {
    let self = this;

    this.loginButton.addEventListener('click', (event) => {
      event.preventDefault();

      let formData = new FormData(self.loginForm);
      let formValues = Object.fromEntries(formData);

      self.client.login(formValues.username, formValues.password).then( (res) => {
        if (res.ok) {
          self.router.navigate('/');
        }
      });
    });
  }

}
