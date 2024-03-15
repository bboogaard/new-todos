class WidgetRenderer {

  constructor(settings) {
    this.client = settings.client;
    this.container = settings.container;
    this.widgetId = settings.widgetId;
    this.defaultValue = settings.defaultValue;
  }

  async render() {
  	const hasPerm = await this.hasPermission();
  	if (!hasPerm) {
  		this.container.style.display = 'none';
  		return this.defaultValue;
  	}
  	this.container.style.display = 'block';
  	return await this.renderElement();
  }

  async renderElement() {}

  async hasPermission() {
  	if (!this.client.isAuthenticated()) {
  		return false;
  	}
    const widgets = await this.client.getWidgets();
    return widgets.indexOf(this.widgetId) !== -1;
  }

}

export default WidgetRenderer;