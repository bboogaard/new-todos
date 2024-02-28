class Events {

  constructor(settings) {
  	this.client = settings.client;
  	this.router = settings.router;
  }

  addEvent(el, trigger, callback) {
  	let self = this;
  
  	el.addEventListener(trigger, (event) => {
  		event.preventDefault();
  		if (!self.client.isAuthenticated()) {
  			self.router.navigate('/login');
  			return;
  		}
  		callback();
  	});
  }

}
